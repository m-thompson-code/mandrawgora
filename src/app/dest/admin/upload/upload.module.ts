import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UploadRoutingModule } from './upload-routing.module';
import { UploadComponent } from './upload.component';

import { StorageService } from '@app/services/storage.service';
import { FirestoreService } from '@app/services/firestore.service';
import { FirebaseService } from '@app/services/firebase.service';

import { DirectivesModule } from '@app/directives';

import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatChipsModule } from '@angular/material/chips';

import { MatRippleModule } from '@angular/material/core';

import { InputModule } from '@app/components/input';
import { SelectModule } from '@app/components/select';
import { UploaderModule } from '@app/components/uploader';

@NgModule({
    declarations: [
        UploadComponent
    ],
    imports: [
        CommonModule,
        
        UploadRoutingModule,

        DirectivesModule,

        MatButtonModule,
        MatProgressBarModule,
        MatChipsModule,

        MatRippleModule,

        InputModule,
        SelectModule,
        UploaderModule,
    ],
    providers: [
        StorageService,
        FirestoreService,
        FirebaseService,
    ],
    bootstrap: [UploadComponent]
})
export class UploadModule { }
