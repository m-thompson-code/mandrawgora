import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UploadRoutingModule } from './upload-routing.module';
import { UploadComponent } from './upload.component';

import { StorageService } from '@app/services/storage.service';
import { FirestoreService } from '@app/services/firestore.service';
import { FirebaseService } from '@app/services/firebase.service';

import { DirectivesModule } from '@app/directives';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';

import { MatRippleModule } from '@angular/material/core';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { UploaderModule } from '@app/components/uploader';
import { ExpandableModule } from '@app/components/expandable';

@NgModule({
    declarations: [
        UploadComponent
    ],
    imports: [
        CommonModule,
        
        UploadRoutingModule,

        DirectivesModule,

        MatFormFieldModule,
        MatButtonModule,
        MatInputModule,
        MatProgressBarModule,
        MatSelectModule,
        MatChipsModule,

        MatRippleModule,
        DragDropModule,

        UploaderModule,
        ExpandableModule,
    ],
    providers: [
        StorageService,
        FirestoreService,
        FirebaseService,
    ],
    bootstrap: [UploadComponent]
})
export class UploadModule { }
