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

export interface SectionFilter extends Section {
    selected: boolean;
    noSection?: boolean;
}

@Component({
    selector: 'moo-management-files',
    templateUrl: './management-files.template.html',
    styleUrls: ['./management-files.style.scss']
})
export class ManagementFilesComponent {
    @Input() label?: string;
    @Input() files: FileMetadata[] = [];

    constructor() {
    }

    public dropFile(event: CdkDragDrop<FileMetadata[]>) {
        console.log(event);
        // if (event.previousContainer === event.container) {
        //     // moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
        //     moveItemInArray(this.sections, event.previousIndex, event.currentIndex);
        //   } else {
        //     transferArrayItem(event.previousContainer.data,
        //                       event.container.data,
        //                       event.previousIndex,
        //                       event.currentIndex);
        //   }

        if (event.previousContainer === event.container) {
        moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
        } else {
        transferArrayItem(event.previousContainer.data,
                            event.container.data,
                            event.previousIndex,
                            event.currentIndex);
        }
    }
}
