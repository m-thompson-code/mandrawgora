import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';

import { StorageService } from '@app/services/storage.service';
import { FirestoreService } from '@app/services/firestore.service';
import { FirebaseService } from '@app/services/firebase.service';

import { DirectivesModule } from '@app/directives';

@NgModule({
    declarations: [
        AdminComponent
    ],
    imports: [
        CommonModule,
        
        AdminRoutingModule,

        DirectivesModule,
    ],
    providers: [
        StorageService,
        FirestoreService,
        FirebaseService,
    ],
    bootstrap: [AdminComponent]
})
export class AdminModule { }
