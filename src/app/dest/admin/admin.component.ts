import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { NavigationEnd, Router, RouterEvent } from '@angular/router';
import { Subscription } from 'rxjs';

import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

import { environment } from '@environment';

import { StorageService } from '@app/services/storage.service';
import { FileMetadata, Section, FirestoreService } from '@app/services/firestore.service';
import { FirebaseService } from '@app/services/firebase.service';

import { UploadFile } from '@app/components/uploader/uploader.component';
import { HelperService } from '@app/services/helper.service';

export interface PendingUploadFile extends UploadFile {
    src: string | ArrayBuffer | null | undefined;
}

export interface SectionFilter extends Section {
    selected: boolean;
    noSection?: boolean;
}

@Component({
    selector: 'admin',
    templateUrl: './admin.template.html',
    styleUrls: ['./admin.style.scss']
})
export class AdminComponent implements AfterViewInit, OnDestroy {
    public newSectionText: string = '';
    public newSectionError: string = '';

    public sections: Section[] = [];

    public loading: boolean = false;

    public expandSections: boolean = false;

    public sectionFilters: SectionFilter[] = [];

    constructor(private router: Router, private firestoreService: FirestoreService, 
        private storageService: StorageService, private helperService: HelperService) {
    }

    public ngAfterViewInit(): void {
        // pass
        this.sections = [
            {
                text: 'First Section',
                slug: 'first_section',
                order: 3,
            },
            {
                text: 'Second Section',
                slug: 'second_section',
                order: 2,
            },
            {
                text: 'Third Section',
                slug: 'third_section',
                order: 1,
            },
        ];

        this.getSectionFilters();
    }

    // public handleFilesUploaded(uploadFiles: UploadFile[]): void {
    //     for (let i = 0; i < uploadFiles.length; i++) {
    //         const uploadFile = uploadFiles[i];

    //         const file = uploadFile.file;
    //         const filename = uploadFile.filename;


    //         const _file: PendingUploadFile = {
    //             file: file,
    //             filename: filename,
    //             src: null,
    //         };

    //         this.pendingUploadFiles.push(_file);

    //         const reader = new FileReader();

    //         reader.onload = function (e) {
    //             // get loaded data and render thumbnail.
    //             _file.src = e?.target?.result || reader.result || null;
    //         };
        
    //         // read the image file as a data URL.
    //         reader.readAsDataURL(file);

    //         // this.storageService.uploadFile(file, filename).then(uploadMetadata => {
    //         //     this.firestoreService.saveFile(uploadMetadata.url, filename, undefined);
    //         // });
    //     }
    // }

    public updateNewSectionText(event: any): void {
        this.newSectionText = event?.target?.value || '';
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
    }

    public dropSection(event: CdkDragDrop<Section[]>) {
        moveItemInArray(this.sections, event.previousIndex, event.currentIndex);
    }

    public save(): Promise<void> {
        return this.firestoreService.setSections(this.sections).then(() => {
            console.log("saved");
        });
    }

    public getSectionFilters(): void {
        const selectedMap: {
            [slug: string]: boolean;
        } = {};

        let noSectionSelected = false;

        for (const sectionFilter of this.sectionFilters) {
            if (sectionFilter.noSection && sectionFilter.selected) {
                noSectionSelected = true;
                continue;
            }

            if (sectionFilter.selected) {
                selectedMap[sectionFilter.slug] = true;
            }
        }

        const sectionFilters = [];

        for (const section of this.sections) {
            if (!section.slug) {
                continue;
            }

            sectionFilters.push({
                text: section.text,
                slug: section.slug,
                order: section.order,
                selected: selectedMap[section.slug] || false,
            });
        }

        sectionFilters.push({
            text: "No section",
            slug: "no-section__SPECIAL",
            order: -1,
            selected: noSectionSelected || false,
            noSection: true,
        });

        this.sectionFilters = sectionFilters;
    }

    public toggleSectionFilter(sectionFilter: SectionFilter): void {
        console.log(sectionFilter, this.sectionFilters);
        sectionFilter.selected = !sectionFilter.selected;
    }

    public ngOnDestroy(): void {

    }
}
