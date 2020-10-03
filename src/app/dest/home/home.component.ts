import { AfterViewInit, Component, OnDestroy, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { environment } from '@environment';

import { StorageService } from '@app/services/storage.service';
import { FileMetadata, FirestoreService, Section } from '@app/services/firestore.service';
import { FirebaseService } from '@app/services/firebase.service';
import { LoaderService } from '@app/services/loader.service';
import { GalleryComponent } from '@app/components/gallery/gallery.component';
import { OverlayGalleryService } from '@app/services/overlay-gallery.service';

// export interface UploadFile {
//     file: File;
//     filename: string;
//     src: string | ArrayBuffer | null | undefined;
// }

@Component({
    selector: 'home',
    templateUrl: './home.template.html',
    styleUrls: ['./home.style.scss']
})
export class HomeComponent implements AfterViewInit, OnDestroy {
    @ViewChild('gallery', {static: false}) public galleryRef!: GalleryComponent;

    public files?: FileMetadata[] = [];

    public sections: Section[] = [];
    public selectedSection?: Section;

    public showTopNavSections: boolean = false;

    public revealImageCount: number = 0;
    public revealSectionCount: number = 0;

    public _revealImageInterval?: number;
    public _revealSectionInterval?: number;

    private _queryCount: number = 0;

    constructor(private router: Router, private firestoreService: FirestoreService, private loaderService: LoaderService, 
        private overlayGalleryService: OverlayGalleryService) {
    }

    public ngAfterViewInit(): void {
        this.loaderService.setShowLoader(true);

        this._queryCount += 1;
        const _queryCount = this._queryCount;

        void this._initalize().then(() => {
            if (_queryCount === this._queryCount) {
                this.loaderService.setShowLoader(false);
            }
        });
    }

    private _initalize(): Promise<void> {
        return this._getSections().then(() => {
            return this._getFiles();
        });
    }

    private _getSections(): Promise<void> {
        this.sections = [];

        return this.firestoreService.getSections().then(_sections => {
            this.sections = _sections;

            if (!this.selectedSection) {
                this.setSelectedSection(this.sections[0]);
            }

            this.revealSectionCount = 0;

            clearInterval(this._revealSectionInterval);

            this._revealSectionInterval = window.setInterval(() => {
                if (!this.files) {
                    return;
                }

                this.revealSectionCount += 1;
                
                if (this.revealSectionCount >= this.sections.length) {
                    clearInterval(this._revealSectionInterval);
                }
            }, 200);
        });
    }

    private _getFiles(): Promise<void> {
        return this.firestoreService.getFiles('timestamp').then(files => {
            this.files = files;
            // this.files = files.slice(0, 3);
            console.log(files);

            this.revealImageCount = 0;

            clearInterval(this._revealImageInterval);

            this._revealImageInterval = window.setInterval(() => {
                if (!this.files) {
                    return;
                }
    
                this.revealImageCount += 1;
                
                if (this.revealImageCount >= this.files.length) {
                    clearInterval(this._revealImageInterval);
                }
            }, 200);
        });
    }

    public setSelectedSection(section: Section): void {
        this.selectedSection = section;
    }

    public setSections(show: boolean): void {
        this.showTopNavSections = show;
    }

    public activateOverlay(index: number): void {
        if (!this.files) {
            return;
        }

        this.overlayGalleryService.activate(index, this.files);
    }

    public ngOnDestroy(): void {
        this.loaderService.setShowLoader(false);
        clearInterval(this._revealImageInterval);
        clearInterval(this._revealSectionInterval);
    }
}
