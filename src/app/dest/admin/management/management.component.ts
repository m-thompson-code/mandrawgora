import { AfterViewInit, Component, OnDestroy, ViewChild, Input } from '@angular/core';
import { NavigationEnd, Router, RouterEvent } from '@angular/router';
import { Subscription } from 'rxjs';

import { environment } from '@environment';

import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

import { StorageService } from '@app/services/storage.service';
import { FileMetadata, Section, FirestoreService } from '@app/services/firestore.service';
import { FirebaseService } from '@app/services/firebase.service';

import { UploadFile } from '@app/components/uploader/uploader.component';
import { HelperService } from '@app/services/helper.service';
import { LoaderService } from '@app/services/loader.service';
import { PendingUploadFile } from './upload/upload.component';

@Component({
    selector: 'management',
    templateUrl: './management.template.html',
    styleUrls: ['./management.style.scss']
})
export class ManagementComponent implements AfterViewInit {
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

    constructor(private router: Router, private firestoreService: FirestoreService, 
        private storageService: StorageService, private helperService: HelperService, 
        private loaderService: LoaderService) {
    }

    public ngAfterViewInit(): void {
        this.firestoreService.getSections().then(sections => {
            this.sections = sections;
            this.testList = [];
            for (const section of this.sections) {
                this.testList.push(section);
            }
            // this.getSectionFilters();
        });

        this.loaderService.setShowLoader(true);

        this._initalize().then(() => {
            this.loaderService.setShowLoader(false);
        });

        this.sectionFiltersMap['delete__SPECIAL'] = true;
    }

    private _initalize(): Promise<void> {
        const promises = [];

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
                this.filesMap[file.sectionSlug || "no-section__SPECIAL"].push(file);
            }
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

        this.sections.push({
            text: text,
            slug: slug,
            order: this.sections.length + 1,
        });

        this.newSectionText = "";
        this.newSectionError = "";

        this.filesMap[slug] = [];
    }

    public deleteSection(section: Section, index: number): void {
        this.sections.splice(index, 1);

        for (const file of this.filesMap[section.slug]) {
            this.filesMap['no-section__SPECIAL'].unshift(file);
        }

        this.filesMap[section.slug] = [];
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
    }

    public save(): Promise<void> {
        const promises = [];

        for (const file of this.filesMap['delete__SPECIAL']) {
            promises.push(this.storageService.deleteFile(file.filename));
        }

        return Promise.all(promises).then(() => {
            const batch = this.firestoreService.getBatch();

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
                
                console.log("saved");
            });
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
        console.log(sectionSlug, this.sectionFiltersMap);
        this.sectionFiltersMap[sectionSlug] = !this.sectionFiltersMap[sectionSlug];

        this.sectionFilterSelected = false;

        for (const key of Object.keys(this.sectionFiltersMap)) {
            if (this.sectionFiltersMap[key]) {
                this.sectionFilterSelected = true;
                break;
            }
        }
    }

    public handleSectionSelected(files: FileMetadata[], event: {slug: string, file: FileMetadata, index: number}): void {
        console.log(files, event);
        files.splice(event.index, 1);
        this.filesMap[event.slug || 'no-section__SPECIAL'].unshift(event.file);
    }

    public ngOnDestroy(): void {
        this.loaderService.setShowLoader(false);
    }
}
