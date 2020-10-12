import { Component } from '@angular/core';

import { MatSnackBar } from '@angular/material/snack-bar';

import { AuthService } from '@app/services/auth.service';
import { LoaderService } from '@app/services/loader.service';

@Component({
    selector: 'moo-admin',
    templateUrl: './admin.template.html',
    styleUrls: ['./admin.style.scss']
})
export class AdminComponent {
    public email: string = '';
    public emailError: string = '';
    public password: string = '';
    public passwordError: string = '';

    constructor(public authService: AuthService, public loaderService: LoaderService, 
        private _snackBar: MatSnackBar) {
    }

    public ngOnInit(): void {
        if (this.authService?.user?.email !== 'm.thompson.code@gmail.com' && this.authService?.user?.email !== 'mandrawgoragmail.com') {
            this.loaderService.setShowLoader(false);
        }
    }

    public login(): Promise<void> {
        this.emailError = '';
        this.passwordError = '';

        if (!this.email) {
            this.emailError = 'Missing email';
            this._snackBar.open(this.emailError, undefined, {
                duration: 5000,
                panelClass: 'snackbar-error',
            });

            return Promise.resolve();
        }

        if (!this.password) {
            this.passwordError = 'Missing password';
            this._snackBar.open(this.passwordError, undefined, {
                duration: 5000,
                panelClass: 'snackbar-error',
            });

            return Promise.resolve();
        }

        this.loaderService.setShowLoader(true);

        return this.authService.signInWithEmailAndPassword(this.email, this.password).then(() => {
            this._snackBar.open(`Welcome ${this.email}`, undefined, {
                duration: 2000,
                panelClass: 'snackbar-success',
            });
        }).catch(error => {
            console.error(error);

            this.emailError = error?.message || 'Unexpected error';
            this._snackBar.open(this.emailError, undefined, {
                duration: 5000,
                panelClass: 'snackbar-error',
            });
        }).then(() => {
            this.loaderService.setShowLoader(false);
        });
    }

    public forgot(): Promise<void> {
        if (!this.email) {
            this.emailError = 'Missing email';
            this._snackBar.open(this.emailError, undefined, {
                duration: 5000,
                panelClass: 'snackbar-error',
            });

            return Promise.resolve();
        }

        this.loaderService.setShowLoader(true);

        return this.authService.sendPasswordResetEmail(this.email).then(() => {
            this._snackBar.open(`Password reset sent to ${this.email}`, undefined, {
                duration: 2000,
                panelClass: 'snackbar-success',
            });
        }).catch(error => {
            console.error(error);

            this.emailError = error?.message || 'Unexpected error';
            this._snackBar.open(this.emailError, undefined, {
                duration: 5000,
                panelClass: 'snackbar-error',
            });
        }).then(() => {
            this.loaderService.setShowLoader(false);
        });
    }
}
