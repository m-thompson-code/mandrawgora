import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';

import { StorageService } from '../../services/storage.service';
import { FirestoreService } from '../../services/firestore.service';
import { FirebaseService } from '../../services/firebase.service';

import { DirectivesModule } from '@app/directives';

@NgModule({
    declarations: [
        HomeComponent
    ],
    imports: [
        CommonModule,
        
        HomeRoutingModule,

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
