import { BrowserModule, HammerGestureConfig, HAMMER_GESTURE_CONFIG, HammerModule } from '@angular/platform-browser';
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
import { OverlayGalleryService } from './services/overlay-gallery.service';

import { DirectivesModule } from '@app/directives';

import { MatProgressBarModule } from '@angular/material/progress-bar';

import { OverlayGalleryModule } from '@app/components/overlay-gallery';

import * as hammer from 'hammerjs';

export class MyHammerConfig extends HammerGestureConfig {
    overrides = <any> {
        pinch: { enable: false },
        rotate: { enable: false },
        pan: {
            direction: hammer.DIRECTION_HORIZONTAL,
            enable: true,
        },
    }
}

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        HammerModule,
        
        MatRippleModule,

        MatProgressBarModule,

        DirectivesModule,

        OverlayGalleryModule,
    ],
    providers: [
        AnalyticsService,
        StorageService,
        FirestoreService,
        FirebaseService,
        LoaderService,

        OverlayGalleryService,

        {
            provide: HAMMER_GESTURE_CONFIG,
            useClass: MyHammerConfig
        },
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
