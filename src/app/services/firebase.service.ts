import { Injectable } from '@angular/core';

import firebase from 'firebase/app';

import 'firebase/analytics';
import 'firebase/auth';
// import 'firebase/database';
import 'firebase/firestore';
import 'firebase/storage';
// import 'firebase/messaging';
// import 'firebase/functions';

import { environment } from '@environment';

@Injectable({
    providedIn: 'root',
})
export class FirebaseService {

    constructor() {
        // Initialize Firebase web SDK
        firebase.initializeApp(environment.firebaseConfig);

        firebase.analytics();
    }

    public firebaseIsValid(): boolean {
        if (!firebase.auth || !firebase.firestore || !firebase.storage || !firebase.analytics) {
            return false;
        }
        
        return true;
    }
}
