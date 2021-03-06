import { AfterViewInit, Component, TemplateRef, ViewChild } from '@angular/core';

import { environment } from '@environment';

import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';

import { StorageService } from '@app/services/storage.service';
import { FileMetadata, Section, FirestoreService } from '@app/services/firestore.service';
import { HelperService } from '@app/services/helper.service';
import { LoaderService } from '@app/services/loader.service';
import { PendingUploadFile, UploadComponent } from './upload/upload.component';

export interface ModalData<T, V=any> {
    templateRef: TemplateRef<T>;
    context: V | null;
    [key: string]: any;
}

@Component({
    selector: 'moo-management',
    templateUrl: './management.template.html',
    styleUrls: ['./management.style.scss']
})
export class ManagementComponent implements AfterViewInit {
    @ViewChild('modalTemplate', {static: true}) private modalTemplate!: TemplateRef<any>;

    @ViewChild('uploadComponent') uploadComponent!: UploadComponent;
    public expandUpload: boolean = false;

    public newSectionText: string = '';
    public newSectionError: string = '';

    public sections: Section[] = [];

    public loading: boolean = false;

    public expandSections: boolean = false;

    public sectionFiltersMap: {
        [slug: string]: boolean;
    } = {};

    public sectionFilterSelected: boolean = false;

    public expandFiles: boolean = false;

    public files: FileMetadata[] = [];
    public filesMap: {
        [slug: string]: FileMetadata[];
    } = {};

    public testList: Section[] = [];

    public initalized: boolean = false;
    public saving: boolean = false;

    public newSections: Section[] = [];

    public modalIsOpen: boolean = false;
    public discardChangesPromise: Promise<boolean>;
    public discardChangesPromiseFunc: (discard: boolean) => Promise<boolean>;

    public changesMade: boolean = false;

    constructor(private firestoreService: FirestoreService, 
        private storageService: StorageService, private helperService: HelperService, 
        private loaderService: LoaderService, private _snackBar: MatSnackBar, 
        public dialogRef: MatDialog) {

        this.discardChangesPromise = Promise.resolve(true);
        this.discardChangesPromiseFunc = (discard: boolean) => {return this.discardChangesPromise};
    }

    public ngAfterViewInit(): void {
        this.firestoreService.getSections().then(sections => {
            this.sections = sections;
            this.testList = [];

            for (const section of this.sections) {
                this.testList.push(section);
            }
        });

        this._initalize().catch(error => {
            console.error(error);

            this._snackBar.open(error.message || 'Unexpected error. Please try again later', undefined, {
                duration: 5000,
                panelClass: 'snackbar-error',
            });
        });

        this.sectionFiltersMap['delete__SPECIAL'] = true;
    }

    public openDiscardChangesModal() {
        this.modalIsOpen = true;

        const dialogRef = this.dialogRef.open(this.modalTemplate);

        this.discardChangesPromise = new Promise((resolve: (discard: boolean) => void) => {
            this.discardChangesPromiseFunc = (discard: boolean) => {
                resolve(discard);
                this.dialogRef.closeAll();
    
                return this.discardChangesPromise;
            };
        }).catch(error => {
            console.error(error);
            return true;
        });

        dialogRef.afterClosed().subscribe(() => {
            this.modalIsOpen = false;
        });
    }

    private _initalize(): Promise<void> {
        this.initalized = false;

        const promises = [];

        this.loaderService.setShowLoader(true);

        promises.push(this.firestoreService.getFiles('order').then(files => {
            this.files = files;
        }));

        promises.push(this.firestoreService.getSections().then(sections => {
            this.sections = sections;
            // this.getSectionFilters();
        }));

        return Promise.all(promises).then(() => {
            this.filesMap = {};

            for (const section of this.sections) {
                this.filesMap[section.slug] = [];
            }

            this.filesMap["no-section__SPECIAL"] = [];
            this.filesMap["delete__SPECIAL"] = [];

            for (const file of this.files) {
                const slug = file.sectionSlug;

                let found = false;
                for (const section of this.sections) {
                    if (section.slug === slug) {
                        this.filesMap[file.sectionSlug || "no-section__SPECIAL"].push(file);
                        found = true;
                        break;
                    }
                }

                if (!found) {
                    this.filesMap["no-section__SPECIAL"].push(file);
                }
            }

            this.loaderService.setShowLoader(false);

            this.initalized = true;
        });
    }

    public updateNewSectionText(text: string): void {
        this.newSectionText = text || '';
    }

    public addSection(): void {
        const text = this.newSectionText;
        const slug = this.helperService.slugify(text);

        if (!slug) {
            console.error("Unexpected missing slug");
            this.newSectionError = "Unexpected missing slug";
            return;
        }

        for (const section of this.sections) {
            if (slug === section.slug) {
                console.error("Unexpected duplicate slug");
                this.newSectionError = "Unexpected duplicate slug";
                return;
            }
        }

        const s = {
            text: text,
            slug: slug,
            order: this.sections.length + 1,
        };

        this.sections.push(s);

        this.newSections.push(s);

        this.newSectionText = "";
        this.newSectionError = "";

        this.filesMap[slug] = [];

        this.changesMade = true;
    }

    public deleteSection(section: Section, index: number): void {
        this.sections.splice(index, 1);

        for (const file of this.filesMap[section.slug]) {
            this.filesMap['no-section__SPECIAL'].unshift(file);
        }
        
        if (this.sectionFiltersMap[section.slug]) {
            this.toggleSectionFilter(section.slug);
        }

        this.filesMap[section.slug] = [];

        this.uploadComponent.removeSection(section);

        this.changesMade = true;
    }

    public dropSection(event: CdkDragDrop<Section[]>) {
        if (event.previousContainer === event.container) {
            moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
        } else {
            transferArrayItem(event.previousContainer.data,
                            event.container.data,
                            event.previousIndex,
                            event.currentIndex);
        }

        this.handleFileDropped(event);
    }

    public dropFile(event: CdkDragDrop<FileMetadata[]>) {
        if (event.previousContainer === event.container) {
            moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
        } else {
            transferArrayItem(event.previousContainer.data,
                            event.container.data,
                            event.previousIndex,
                            event.currentIndex);
        }

        this.handleFileDropped(event);
    }

    public handleFileDropped(event: CdkDragDrop<any[]>) {
        console.log(event);
        if (event.previousIndex !== event.currentIndex || event.previousContainer !== event.container) {
            this.changesMade = true;
        }
    }

    public save(): Promise<void> {
        if (this.saving) {
            return Promise.resolve();
        }

        this.loaderService.setShowLoader(true);

        this.saving = true;

        const promises = [];

        for (const file of this.filesMap['delete__SPECIAL']) {
            promises.push(this.storageService.deleteFile(file.filename));
        }

        return Promise.all(promises).then(() => {
            const batch = this.firestoreService.getBatch();

            for (let i = 0; i < this.sections.length; i++) {
                const section = this.sections[i];

                section.order = this.sections.length - i;
            }

            this.firestoreService.batchSetSections(batch, this.sections);

            for (const section of this.sections) {
                const files = this.filesMap[section.slug];

                for (let i = 0; i < files.length; i++) {
                    const file = files[i];
                    file.order = files.length - i;
                    file.sectionSlug = section.slug;

                    this.firestoreService.batchSetFile(batch, file, section);
                }
            }

            const noSectionFiles = this.filesMap['no-section__SPECIAL'];

            for (let i = 0; i < noSectionFiles.length; i++) {
                const file = noSectionFiles[i];
                file.order = noSectionFiles.length - i;
                file.sectionSlug = undefined;

                this.firestoreService.batchSetFile(batch, file);
            }

            const deleteFiles = this.filesMap['delete__SPECIAL'];

            for (let i = 0; i < deleteFiles.length; i++) {
                const file = deleteFiles[i];
                file.order = deleteFiles.length - i;
                file.sectionSlug = undefined;

                this.firestoreService.batchDeleteFile(batch, file);
            }

            return batch.commit().then(() => {
                this.filesMap["delete__SPECIAL"] = [];

                for (const deleteFile of deleteFiles) {
                    for (let i = 0; i < this.files.length; i++) {
                        const file = this.files[i];

                        if (file.firestoreID === deleteFile.firestoreID) {
                            this.files.splice(i, 1);
                            break;
                        }
                    }
                }

                this.newSections = [];

                this.changesMade = false;
                
                this._snackBar.open('Save complete!', undefined, {
                    duration: 2000,
                    panelClass: 'snackbar-success',
                });
            });
        }).catch(error => {
            console.error(error);

            this._snackBar.open(error.message || 'Unexpected error', undefined, {
                duration: 5000,
                panelClass: 'snackbar-error',
            });
        }).then(() => {
            this.saving = false;
            this.loaderService.setShowLoader(false);
        });
    }

    public handleFileUploaded(pendingUploadFile: PendingUploadFile): void {
        if (pendingUploadFile.metadata) {
            this.files.unshift(pendingUploadFile.metadata);
            this.filesMap[pendingUploadFile.metadata.sectionSlug || "no-section__SPECIAL"].unshift(pendingUploadFile.metadata);
        } else {
            console.error("Unexpected missing metadata from uploaded pendingUploadFile");
            debugger;
        }
    }

    public toggleSectionFilter(sectionSlug: string): void {
        this.sectionFiltersMap[sectionSlug] = !this.sectionFiltersMap[sectionSlug];

        this.sectionFilterSelected = false;

        for (const key of Object.keys(this.sectionFiltersMap)) {
            if (key === 'delete__SPECIAL') {
                continue;
            }
            
            if (this.sectionFiltersMap[key]) {
                this.sectionFilterSelected = true;
                break;
            }
        }
    }

    public handleSectionSelected(files: FileMetadata[], event: {slug: string, file: FileMetadata, index: number}): void {
        files.splice(event.index, 1);
        this.filesMap[event.slug || 'no-section__SPECIAL'].unshift(event.file);
        this.changesMade = true;
    }

    public canDeactivate(): Promise<boolean> {
        if (this.modalIsOpen) {
            this.modalIsOpen = false;
            this.dialogRef.closeAll();
            return Promise.resolve(false);
        }

        if (this.changesMade) {
            this.openDiscardChangesModal();
            return this.discardChangesPromise;
        }

        return Promise.resolve(true);
    }

    public ngOnDestroy(): void {
        this.loaderService.setShowLoader(false);
    }
}
