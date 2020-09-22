import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { NavigationEnd, Router, RouterEvent } from '@angular/router';
import { Subscription } from 'rxjs';

import { environment } from '@environment';

import { StorageService } from '../../services/storage.service';
import { FileMetadata, FirestoreService } from '../../services/firestore.service';
import { FirebaseService } from '../../services/firebase.service';

export interface UploadFile {
    file: File;
    filename: string;
    src: string | ArrayBuffer | null;
}

@Component({
    selector: 'admin',
    templateUrl: './admin.component.html',
    styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements AfterViewInit, OnDestroy {
    public dragover?: boolean;

    public uploadFiles: UploadFile[] = [];

    constructor(private router: Router, private firestoreService: FirestoreService, 
        private storageService: StorageService) {
    }

    public ngAfterViewInit(): void {
        // pass
    }

    
    public handleFileInputChange(event: any): void {
        console.log(event);

        const _t = event?.target as HTMLInputElement;

        if (!_t || !_t.files || !_t.files.length) {
            console.error("Unexpected missing files from event");
            return;
        }

        const files = _t.files;

        this._handleFileList(files);
    }

    public handleFileInputDrop(event: any): void {
        console.log(event);

        event?.stopPropagation();
        event?.preventDefault();

        const _d = event?.dataTransfer as DataTransfer;

        if (!_d || !_d.files || !_d.files.length) {
            console.error("Unexpected missing files from event");
            return;
        }
        
        const files = _d.files;

        this._handleFileList(files);

        this.dragover = false;
    }

    public handleDragover(event: any): void {
        console.log(event);

        event?.stopPropagation();
        event?.preventDefault();

        if (!event || !event.dataTransfer) {
            return;
        }
        
        // Style the drag-and-drop as a "copy file" operation.
        event.dataTransfer.dropEffect = 'copy';

        this.dragover = true;
    }
    
    public handleDragend(event: any): void {
        console.log(event);

        event?.stopPropagation();
        event?.preventDefault();

        this.dragover = false;
    }

    private _handleFileList(fileList: FileList): void {
        if (!fileList) {
            console.error("Unexpected missing files from Filelist");
            return;
        }

        for (let i = 0; i < fileList.length; i++) {
            const file = fileList[i];

            const reader = new FileReader();

            console.log(file);

            const filename = (file.name || '').toLowerCase();

            const _file: UploadFile = {
                file: file,
                filename: filename,
                src: null,
            };

            this.uploadFiles.push(_file);

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

    }
}
