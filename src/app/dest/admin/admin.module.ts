import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';

import { StorageService } from '@app/services/storage.service';
import { FirestoreService } from '@app/services/firestore.service';
import { FirebaseService } from '@app/services/firebase.service';

import { DirectivesModule } from '@app/directives';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';

import { MatRippleModule } from '@angular/material/core';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { UploaderModule } from '@app/components/uploader';

@NgModule({
    declarations: [
        AdminComponent
    ],
    imports: [
        CommonModule,
        
        AdminRoutingModule,

        DirectivesModule,

        MatFormFieldModule,
        MatButtonModule,
        MatInputModule,
        MatProgressBarModule,
        MatSelectModule,

        MatRippleModule,
        DragDropModule,

        UploaderModule,
    ],
    providers: [
        StorageService,
        FirestoreService,
        FirebaseService,
    ],
    bootstrap: [AdminComponent]
})
export class AdminModule { }
