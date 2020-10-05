import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManagementRoutingModule } from './management-routing.module';
import { ManagementComponent } from './management.component';

import { StorageService } from '@app/services/storage.service';
import { FirestoreService } from '@app/services/firestore.service';
import { FirebaseService } from '@app/services/firebase.service';

import { DirectivesModule } from '@app/directives';

import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatChipsModule } from '@angular/material/chips';

import { MatRippleModule } from '@angular/material/core';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { ExpandableModule } from '@app/components/expandable';
import { InputModule } from '@app/components/input';
import { SelectModule } from '@app/components/select';

@NgModule({
    declarations: [
        ManagementComponent
    ],
    imports: [
        CommonModule,
        
        ManagementRoutingModule,

        DirectivesModule,

        MatButtonModule,
        MatProgressBarModule,
        MatChipsModule,

        MatRippleModule,
        DragDropModule,

        ExpandableModule,
        InputModule,
    ],
    providers: [
        StorageService,
        FirestoreService,
        FirebaseService,
    ],
    bootstrap: [ManagementComponent]
})
export class ManagementModule { }
