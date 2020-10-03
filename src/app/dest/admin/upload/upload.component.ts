import { AfterViewInit, Component, OnDestroy, ViewChild, Input } from '@angular/core';
import { NavigationEnd, Router, RouterEvent } from '@angular/router';
import { Subscription } from 'rxjs';

import { environment } from '@environment';

import { StorageService } from '@app/services/storage.service';
import { FileMetadata, FirestoreService, Section } from '@app/services/firestore.service';
import { FirebaseService } from '@app/services/firebase.service';
import { LoaderService } from '@app/services/loader.service';
import { GalleryComponent } from '@app/components/gallery/gallery.component';
import { OverlayGalleryService } from '@app/services/overlay-gallery.service';
import { PendingUploadFile } from '../admin.component';
import { UploadFile } from '@app/components/uploader/uploader.component';

// export interface UploadFile {
//     file: File;
//     filename: string;
//     src: string | ArrayBuffer | null | undefined;
// }

@Component({
    selector: 'upload',
    templateUrl: './upload.template.html',
    styleUrls: ['./upload.style.scss']
})
export class UploadComponent implements AfterViewInit, OnDestroy {
    @Input() public sections: Section[] = [];

    public pendingUploadFiles: PendingUploadFile[] = [];

    constructor(private router: Router, private firestoreService: FirestoreService, private loaderService: LoaderService, 
        private overlayGalleryService: OverlayGalleryService, private storageService: StorageService) {
    }

    public ngAfterViewInit(): void {
        // this.loaderService.setShowLoader(true);
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

            this.storageService.uploadFile(file, filename).then(uploadMetadata => {
                this.firestoreService.saveFile(uploadMetadata.url, filename, undefined);
            });
        }
    }

    public ngOnDestroy(): void {
        this.loaderService.setShowLoader(false);
    }
}
