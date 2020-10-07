import { AfterViewInit, Component, OnDestroy, ViewChild, Input, ElementRef, Output, EventEmitter } from '@angular/core';
import { NavigationEnd, Router, RouterEvent } from '@angular/router';
import { Subscription } from 'rxjs';

import { environment } from '@environment';

import { StorageService } from '@app/services/storage.service';
import { FileMetadata, FirestoreService, Section } from '@app/services/firestore.service';
import { FirebaseService } from '@app/services/firebase.service';
import { LoaderService } from '@app/services/loader.service';

import { OverlayGalleryService } from '@app/services/overlay-gallery.service';

import { UploadFile } from '@app/components/uploader/uploader.component';
import { MatSelectChange } from '@angular/material/select';
import { HelperService } from '@app/services/helper.service';

export interface PendingUploadFile extends UploadFile {
    src: string | ArrayBuffer | null | undefined;
    section?: Section;
    error?: string;
    uploading: boolean;
    progress: number;
    metadata?: FileMetadata,
}

@Component({
    selector: 'moo-upload',
    templateUrl: './upload.template.html',
    styleUrls: ['./upload.style.scss']
})
export class UploadComponent {
    @Input() public sections: Section[] = [];
    @Input() public files: FileMetadata[] = [];

    @Output() public fileUploaded: EventEmitter<PendingUploadFile> = new EventEmitter();

    public pendingUploadFiles: PendingUploadFile[] = [];

    constructor(private router: Router, private firestoreService: FirestoreService, private loaderService: LoaderService, 
        private overlayGalleryService: OverlayGalleryService, private storageService: StorageService, 
        private helperService: HelperService) {
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
                uploading: false,
                progress: 0,
            };

            this.pendingUploadFiles.push(_file);

            const reader = new FileReader();

            reader.onload = function (e) {
                // get loaded data and render thumbnail.
                _file.src = e?.target?.result || reader.result || null;
            };
        
            // read the image file as a data URL.
            reader.readAsDataURL(file);
        }
    }

    public handleSelectionChange(pendingUploadFile: PendingUploadFile, newSection?: Section): void {
        console.log(newSection);
        pendingUploadFile.section = newSection;

        if (pendingUploadFile.metadata) {
            this.firestoreService.updateFile(pendingUploadFile.metadata, newSection);
        }
    }

    public handleFilenameChange(pendingUploadFile: PendingUploadFile, text: string): void {
        console.log(text);
        pendingUploadFile.filename = text;
        // TODO: handle section change
    }

    public uploadFile(pendingUploadFile: PendingUploadFile): Promise<void> {
        if (pendingUploadFile.uploading) {
            return Promise.resolve();
        }

        pendingUploadFile.error = undefined;

        pendingUploadFile.filename = pendingUploadFile.filename.toLowerCase();
        pendingUploadFile.filename = pendingUploadFile.filename.replace(/ /g,"_");

        for (const file of this.files) {
            if (pendingUploadFile.filename === file.filename) {
                pendingUploadFile.error = "Unexpected duplicate filename";
                return Promise.resolve();
            }
        }

        if (!this.helperService.filenameIsValid(pendingUploadFile.filename)) {
            pendingUploadFile.error = "Filename is invalid. Allowed: a-z, 0-9, - _ (no spaces) (extensions: .png, .jpg, .jpeg, .gif)"
            return Promise.resolve();
        }

        const _d = this.storageService.uploadFile(pendingUploadFile.file, pendingUploadFile.filename);

        pendingUploadFile.uploading = true;

        _d.progressObservable.subscribe(progress => {
            pendingUploadFile.progress = progress;
        });

        return _d.fileUploadResult.then(_result => {
            console.log(_result);
            return _result;
        }).then(_result => {
            return this.firestoreService.addFile(_result.url, _result.filename, this.files.length + 1, pendingUploadFile.section).then(metadata => {
                pendingUploadFile.metadata = metadata;
                pendingUploadFile.uploading = false;
                // this.files.push(metadata);
                this.fileUploaded.emit(pendingUploadFile);
            });
        }).catch(error => {
            console.error(error);
            pendingUploadFile.error = error.message || "Unexpected error";
            debugger;
            pendingUploadFile.uploading = false;
        });
    }

    public deleteFile(pendingUploadFile: PendingUploadFile, index: number): Promise<void> {
        const promises: Promise<any>[] = [];

        const filename = pendingUploadFile.filename;
        const metadata = pendingUploadFile.metadata;

        if (metadata) {
            promises.push(this.storageService.deleteFile(filename).then(() => {
                return this.firestoreService.deleteFile(metadata.firestoreID);
            }));
        }

        pendingUploadFile.uploading = true;

        return Promise.all(promises).then(() => {
            this.pendingUploadFiles.splice(index, 1);

            for (let i = 0; i < this.files.length; i++) {
                const file = this.files[i];
                
                if (file === metadata) {
                    this.files.splice(i, 1);
                    break;
                }
            }
        }).catch(error => {
            console.error(error);
            pendingUploadFile.error = error.message || "Unexpected error";
            debugger;
            pendingUploadFile.uploading = false;
        });
    }

    public hideFile(index: number): void {
        this.pendingUploadFiles.splice(index, 1);
    }

    public activateOverlay(index: number): void {
        this.overlayGalleryService.activate(index, this.pendingUploadFiles);
    }
}
