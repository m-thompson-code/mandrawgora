import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AnalyticsService } from '@app/services/analytics.service';
import { StorageService } from './services/storage.service';
import { FirestoreService } from './services/firestore.service';
import { FirebaseService } from './services/firebase.service';

import { DirectivesModule } from '@app/directives';

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,

        DirectivesModule,

    ],
    providers: [
        AnalyticsService,
        StorageService,
        FirestoreService,
        FirebaseService,
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
