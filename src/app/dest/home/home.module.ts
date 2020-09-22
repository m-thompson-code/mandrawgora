import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';

import { MatRippleModule } from '@angular/material/core';

import { StorageService } from '@app/services/storage.service';
import { FirestoreService } from '@app/services/firestore.service';
import { FirebaseService } from '@app/services/firebase.service';

import { DirectivesModule } from '@app/directives';

@NgModule({
    declarations: [
        HomeComponent
    ],
    imports: [
        CommonModule,
        
        HomeRoutingModule,

        MatRippleModule,

        DirectivesModule,
    ],
    providers: [
        StorageService,
        FirestoreService,
        FirebaseService,
    ],
    bootstrap: [HomeComponent]
})
export class HomeModule { }
