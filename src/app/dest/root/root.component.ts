import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { environment } from '@environment';

import { LoaderService } from '@app/services/loader.service';
import { HomeService } from '@app/services/home.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
    selector: 'root',
    templateUrl: './root.template.html',
    styleUrls: ['./root.style.scss']
})
export class RootComponent implements AfterViewInit, OnDestroy {
    constructor(private router: Router, private loaderService: LoaderService, private homeService: HomeService, 
        private _snackBar: MatSnackBar) {
    }

    public ngOnInit(): void {
    }

    public ngAfterViewInit(): void {
        void this._initalize().catch(error => {
            console.error(error);

            this._snackBar.open(error.message || 'Unexpected error. Please try again later', undefined, {
                duration: 5000,
                panelClass: 'snackbar-error',
            });
        });
    }

    private _initalize(): Promise<void> {
        this.loaderService.setShowLoader(true);

        return this.homeService.getSections().then(() => {
            if (this.homeService.sections[0]?.slug) {
                this.router.navigate(['/section/', this.homeService.sections[0].slug], {
                    skipLocationChange: true,
                    replaceUrl: true,
                });
            } else {
                this.router.navigate(['404']), {
                    skipLocationChange: true,
                    replaceUrl: true,
                };
            }
        });
    }

    public ngOnDestroy(): void {
        this.loaderService.setShowLoader(false);
    }
}
