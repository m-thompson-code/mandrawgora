import { AfterViewInit, Component, OnDestroy, ViewChild, Input, Output, EventEmitter } from '@angular/core';
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
import { OverlayGalleryService } from '@app/services/overlay-gallery.service';

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
    @Input() sectionSlug?: string;
    @Input() sections: Section[] = [];

    @Output() sectionSelected: EventEmitter<{slug: string, file: FileMetadata, index: number}> = new EventEmitter();

    constructor(private overlayGalleryService: OverlayGalleryService) {
    }

    public dropFile(event: CdkDragDrop<FileMetadata[]>) {
        if (event.previousContainer === event.container) {
            moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
        } else {
            transferArrayItem(event.previousContainer.data,
                            event.container.data,
                            event.previousIndex,
                            event.currentIndex);
        }
    }

    public activateOverlay(index: number): void {
        this.overlayGalleryService.activate(index, this.files);
    }
}
