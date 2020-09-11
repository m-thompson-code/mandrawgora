import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import * as firebase from 'firebase/app';

import 'firebase/analytics';
import 'firebase/auth';
// import 'firebase/database';
import 'firebase/firestore';
import 'firebase/storage';
// import 'firebase/messaging';
// import 'firebase/functions';

// Initialize Firebase web SDK
firebase.initializeApp({
    apiKey: "AIzaSyB_akcmIP1-ptE2hYLS-eXJ8iWt5numEBU",
    authDomain: "mandrawgora-170d4.firebaseapp.com",
    databaseURL: "https://mandrawgora-170d4.firebaseio.com",
    projectId: "mandrawgora-170d4",
    storageBucket: "mandrawgora-170d4.appspot.com",
    messagingSenderId: "290519090015",
    appId: "1:290519090015:web:f2ed34cde7533c4b3b2cea",
    measurementId: "G-E3VJRTVBRB"
});

firebase.analytics();

import { AnalyticsService } from '@app/services/analytics.service';

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,

    ],
    providers: [
        AnalyticsService,
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
