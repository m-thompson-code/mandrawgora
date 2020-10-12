import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManagementRoutingModule } from './management-routing.module';
import { ManagementComponent } from './management.component';
import { ManagementFilesComponent } from './management-files/management-files.component';
import { UploadComponent } from './upload/upload.component';

import { StorageService } from '@app/services/storage.service';
import { FirestoreService } from '@app/services/firestore.service';
import { FirebaseService } from '@app/services/firebase.service';

import { DirectivesModule } from '@app/directives';

import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatRippleModule } from '@angular/material/core';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { ExpandableModule } from '@app/components/expandable';
import { InputModule } from '@app/components/input';
import { SelectModule } from '@app/components/select';
import { UploaderModule } from '@app/components/uploader';

@NgModule({
    declarations: [
        ManagementComponent,
        ManagementFilesComponent,
        UploadComponent,
    ],
    imports: [
        CommonModule,
        
        ManagementRoutingModule,

        DirectivesModule,

        MatButtonModule,
        MatProgressBarModule,
        MatChipsModule,
        MatDividerModule,
        MatMenuModule,
        MatSnackBarModule,
        MatDialogModule,
        MatRippleModule,
        DragDropModule,

        ExpandableModule,
        InputModule,
        SelectModule,
        UploaderModule,
    ],
    providers: [
        StorageService,
        FirestoreService,
        FirebaseService,
    ],
    bootstrap: [ManagementComponent]
})
export class ManagementModule { }
