import { Injectable, NgZone } from '@angular/core';

import firebase from 'firebase/app';

import { environment } from '@environment';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    public firebaseAuthUnSub?: firebase.Unsubscribe;
    public user?: firebase.User | null;
    public currentUserIsAdmin: boolean = false;

    constructor(private ngZone: NgZone) {
    }
    
    public handleAuth(): Promise<firebase.User | null> {
        this.firebaseAuthUnSub && this.firebaseAuthUnSub();

        return new Promise(resolve => {
            this.firebaseAuthUnSub = firebase.auth().onAuthStateChanged(user => {
                this.ngZone.run(() => {
                    this.user = user;

                    if (user) {
                        if (environment.adminEmails.length) {
                            if (user.email && environment.adminEmails.includes(user.email)) {
                                this.currentUserIsAdmin = true;
                            } else {
                                this.currentUserIsAdmin = false;
                            }
                        } else {
                            // If environment has no admin emails, assume anyone can be an admin (for demo)
                            this.currentUserIsAdmin = true;
                        }
                    } else {
                        this.currentUserIsAdmin = false;
                    }

                    resolve(user);
                });
            });
        });
    }

    public signInWithEmailAndPassword(email: string, password: string): Promise<void> {
        return firebase.auth().signInWithEmailAndPassword(email, password).then(auth => {
            if (environment.env === 'dev') {
                console.log(' ~ AuthService: signInWithEmailAndPassword', auth);
            }
        });
    }

    public signInAnonymously(): Promise<void> {
        return firebase.auth().signInAnonymously().then(auth => {
            if (environment.env === 'dev') {
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
