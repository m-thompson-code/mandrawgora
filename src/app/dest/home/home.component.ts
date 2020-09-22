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
    selector: 'home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements AfterViewInit, OnDestroy {
    public files?: FileMetadata[];

    constructor(private router: Router, private firestoreService: FirestoreService) {
    }

    public ngAfterViewInit(): void {
        this.firestoreService.getFiles('timestamp').then(files => {
            this.files = files;
            // this.files = files.slice(0, 3);
            console.log(files);
        });
    }

    public ngOnDestroy(): void {

    }
}
