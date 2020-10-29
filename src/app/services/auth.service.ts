import { Injectable, NgZone } from '@angular/core';

import firebase from 'firebase/app';

import { environment } from '@environment';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    public firebaseAuthUnSub?: firebase.Unsubscribe;
    public user?: firebase.User | null;

    constructor(private ngZone: NgZone) {
    }
    
    public handleAuth(): Promise<firebase.User | null> {
        this.firebaseAuthUnSub && this.firebaseAuthUnSub();

        return new Promise(resolve => {
            this.firebaseAuthUnSub = firebase.auth().onAuthStateChanged(user => {
                this.ngZone.run(() => {
                    this.user = user;

                    resolve(user);
                });
            });
        });
    }

    public signInWithEmailAndPassword(email: string, password: string): Promise<void> {
        return firebase.auth().signInWithEmailAndPassword(email, password).then(auth => {
            if (environment.env !== 'prod') {
                console.log(' ~ AuthService: signInWithEmailAndPassword', auth);
            }
        });
    }

    public sendPasswordResetEmail(email: string): Promise<void> {
        return firebase.auth().sendPasswordResetEmail(email);
    }

    public signOut(): Promise<void> {
        return firebase.auth().signOut().then(() => {
            // pass
        });
    }
}
