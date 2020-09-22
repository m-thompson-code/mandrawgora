import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { NavigationEnd, Router, RouterEvent } from '@angular/router';
import { Subscription } from 'rxjs';

import { environment } from '@environment';

import { StorageService } from '@app/services/storage.service';
import { FileMetadata, FirestoreService } from '@app/services/firestore.service';
import { FirebaseService } from '@app/services/firebase.service';
import { LoaderService } from '@app/services/loader.service';

export interface UploadFile {
    file: File;
    filename: string;
    src: string | ArrayBuffer | null;
}

@Component({
    selector: 'home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements AfterViewInit, OnDestroy {
    public files?: FileMetadata[];

    public sections: string[] = [];
    public selectedSection: string = 'Illustration';

    public showTopNavSections?: boolean;

    constructor(private router: Router, private firestoreService: FirestoreService, private loaderService: LoaderService) {
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

    public ngOnDestroy(): void {
        this.loaderService.setShowLoader(false);
    }
}
