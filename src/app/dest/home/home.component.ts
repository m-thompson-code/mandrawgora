import { AfterViewInit, Component, OnDestroy, ViewChild } from '@angular/core';
import { NavigationEnd, Router, RouterEvent } from '@angular/router';
import { Subscription } from 'rxjs';

import { environment } from '@environment';

import { StorageService } from '@app/services/storage.service';
import { FileMetadata, FirestoreService } from '@app/services/firestore.service';
import { FirebaseService } from '@app/services/firebase.service';
import { LoaderService } from '@app/services/loader.service';
import { GalleryComponent } from '@app/components/gallery/gallery.component';
import { OverlayGalleryService } from '@app/services/overlay-gallery.service';

export interface UploadFile {
    file: File;
    filename: string;
    src: string | ArrayBuffer | null | undefined;
}

@Component({
    selector: 'home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements AfterViewInit, OnDestroy {
    @ViewChild('gallery', {static: false}) public galleryRef!: GalleryComponent;

    public files?: FileMetadata[];

    public sections: string[] = [];
    public selectedSection: string = 'Illustration';

    public showTopNavSections?: boolean;

    constructor(private router: Router, private firestoreService: FirestoreService, private loaderService: LoaderService, 
        private overlayGalleryService: OverlayGalleryService) {
    }

    public ngAfterViewInit(): void {
        this.sections = [];

        this.sections = [
            'Illustration',
            'Comics',
            'About',
        ];

        this.setSelectedSection('Illustration');

        this.loaderService.setShowLoader(true);

        this.firestoreService.getFiles('timestamp').then(files => {
            this.files = files;
            // this.files = files.slice(0, 3);
            console.log(files);

            this.loaderService.setShowLoader(false);
        });
    }

    public setSelectedSection(section: string): void {
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
    }
}
