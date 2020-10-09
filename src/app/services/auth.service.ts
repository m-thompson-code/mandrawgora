import { Injectable, NgZone } from '@angular/core';

import * as firebase from 'firebase/app';

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
        
                    // if (environment.env !== 'prod') {
                        console.log(' ~ AuthService: user', user);
                    // }

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
        }).catch(error => {
            // Handle Errors here.
            let errorCode = error.code;
            let errorMessage = error.message;
            // ...

            console.error(errorCode, errorMessage);
            console.error(error);
            
            throw error;
        });
    }

    public sendPasswordResetEmail(email: string): Promise<void> {
        return firebase.auth().sendPasswordResetEmail(email);
    }

    public signOut(): Promise<void> {
        return firebase.auth().signOut().then(() => {
            // pass
        }).catch(error => {
            console.error(error);

            if (environment.env !== 'prod') {
                debugger;
            }
        });
    }
}
