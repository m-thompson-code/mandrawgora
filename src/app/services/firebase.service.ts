import { Injectable } from '@angular/core';
import { environment } from '@environment';

// import { environment } from '@environment';

import firebase from 'firebase/app';

import 'firebase/analytics';
import 'firebase/auth';
// import 'firebase/database';
import 'firebase/firestore';
import 'firebase/storage';
// import 'firebase/messaging';
// import 'firebase/functions';

@Injectable({
    providedIn: 'root',
})
export class FirebaseService {

    constructor() {
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
    }

    public firebaseIsValid(): boolean {
        if (!firebase.auth || !firebase.firestore || !firebase.storage || !firebase.analytics) {
            return false;
        }
        
        return true;
    }
}
