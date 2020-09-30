import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { NavigationEnd, Router, RouterEvent } from '@angular/router';
import { Subscription } from 'rxjs';

import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

import { environment } from '@environment';

import { StorageService } from '@app/services/storage.service';
import { FileMetadata, Section, FirestoreService } from '@app/services/firestore.service';
import { FirebaseService } from '@app/services/firebase.service';

import { UploadFile } from '@app/components/uploader/uploader.component';

export interface PendingUploadFile extends UploadFile {
    src: string | ArrayBuffer | null | undefined;
}

@Component({
    selector: 'admin',
    templateUrl: './admin.component.html',
    styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements AfterViewInit, OnDestroy {
    public pendingUploadFiles: PendingUploadFile[] = [];

    public newSectionText: string = '';
    public newSectionError?: string = '';

    public sections: Section[] = [];

    constructor(private router: Router, private firestoreService: FirestoreService, 
        private storageService: StorageService) {
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
    }

    public handleFilesUploaded(uploadFiles: UploadFile[]): void {
        for (let i = 0; i < uploadFiles.length; i++) {
            const uploadFile = uploadFiles[i];

            const file = uploadFile.file;
            const filename = uploadFile.filename;


            const _file: PendingUploadFile = {
                file: file,
                filename: filename,
                src: null,
            };

            this.pendingUploadFiles.push(_file);

            const reader = new FileReader();

            reader.onload = function (e) {
                // get loaded data and render thumbnail.
                _file.src = e?.target?.result || reader.result || null;
            };
        
            // read the image file as a data URL.
            reader.readAsDataURL(file);

            // this.storageService.uploadFile(file, filename).then(uploadMetadata => {
            //     this.firestoreService.saveFile(uploadMetadata.url, filename, undefined);
            // });
        }
    }

    public updateNewSectionText(event: any): void {
        this.newSectionText = event?.target?.value || '';
    }

    public dropSection(event: CdkDragDrop<Section[]>) {
        moveItemInArray(this.sections, event.previousIndex, event.currentIndex);
    }

    public ngOnDestroy(): void {

    }
}
