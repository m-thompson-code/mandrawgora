import { BrowserModule, HammerGestureConfig, HAMMER_GESTURE_CONFIG, HammerModule } from '@angular/platform-browser';
import { Injectable, NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatRippleModule } from '@angular/material/core';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { AnalyticsService } from '@app/services/analytics.service';
import { StorageService } from '@app/services/storage.service';
import { AuthService } from '@app/services/auth.service';
import { FirestoreService } from '@app/services/firestore.service';
import { FirebaseService } from '@app/services/firebase.service';
import { LoaderService } from '@app/services/loader.service';
import { OverlayGalleryService } from '@app/services/overlay-gallery.service';
import { ResponsiveService } from '@app/services/responsive.service';
import { HelperService } from '@app/services/helper.service';
import { HomeService } from '@app/services/home.service';
import { NavigationService } from '@app/services/navigation.service';

import { DirectivesModule } from '@app/directives';

import { CanDeactivateGuard } from '@app/guards/can-deactivate.guard';

import { OverlayGalleryModule } from '@app/components/overlay-gallery';

import * as hammer from 'hammerjs';

@Injectable()
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
        MatSnackBarModule,
        MatProgressBarModule,

        DirectivesModule,

        OverlayGalleryModule,
    ],
    providers: [
        AnalyticsService,
        StorageService,
        AuthService,
        FirestoreService,
        FirebaseService,
        LoaderService,

        OverlayGalleryService,
        ResponsiveService,
        HelperService,
        HomeService,

        NavigationService,
        CanDeactivateGuard,

        {
            provide: HAMMER_GESTURE_CONFIG,
            useClass: MyHammerConfig
        },
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
