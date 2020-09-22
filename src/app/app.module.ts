import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatRippleModule } from '@angular/material/core';

import { AnalyticsService } from '@app/services/analytics.service';
import { StorageService } from './services/storage.service';
import { FirestoreService } from './services/firestore.service';
import { FirebaseService } from './services/firebase.service';
import { LoaderService } from './services/loader.service';

import { DirectivesModule } from '@app/directives';

import { MatProgressBarModule } from '@angular/material/progress-bar';

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,

        MatRippleModule,

        MatProgressBarModule,

        DirectivesModule,

    ],
    providers: [
        AnalyticsService,
        StorageService,
        FirestoreService,
        FirebaseService,
        LoaderService,
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
