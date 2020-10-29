import { AfterViewInit, Component, OnDestroy, Renderer2 } from '@angular/core';
import { NavigationEnd, Router, RouterEvent } from '@angular/router';

import { MatSnackBar } from '@angular/material/snack-bar';

import { Subscription } from 'rxjs';

import { environment } from '@environment';

import { AnalyticsService } from '@app/services/analytics.service';
import { FirebaseService } from '@app/services/firebase.service';
import { LoaderService } from '@app/services/loader.service';
import { OverlayGalleryService } from '@app/services/overlay-gallery.service';
import { AuthService } from '@app/services/auth.service';
import { ResponsiveService } from './services/responsive.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.template.html',
    styleUrls: ['./app.style.scss']
})
export class AppComponent implements AfterViewInit, OnDestroy {
    public initalized: boolean = false;

    private _routerEventsSub?: Subscription;
    private _detachListeners?: () => void;

    // Inject FirebaseService here so firebase initalizes properly
    constructor(private router: Router, private renderer: Renderer2, private firebaseService: FirebaseService, 
        private analyticsService: AnalyticsService, private _snackBar: MatSnackBar, 
        public loaderService: LoaderService, public overlayGalleryService: OverlayGalleryService, 
        private authService: AuthService, private responsiveService: ResponsiveService) {
    }

    public ngOnInit(): void {
        // Check to make sure all firebase services are defined
        if (!this.firebaseService.firebaseIsValid()) {
            this._snackBar.open('Unexpected invalid firebase initalization', undefined, {
                duration: 5000,
                panelClass: 'snackbar-error',
            });
        }
    }

    public ngAfterViewInit(): void {
        const updateResponsiveService = () => {
            this.responsiveService.responsiveMetadata = this.responsiveService.getResponsiveType();
        }
        
        this.initalized = false;

        void this._initalize().then(() => {
            this.initalized = true;
        });

        // Handle getting screen height css variables
        const appHeight = () => {
            try {
                const doc = document.documentElement;

                const windowHeight = window.innerHeight;

                doc.style.setProperty('--app-height-100', `${windowHeight}px`);
                doc.style.setProperty('--app-height-95', `${windowHeight * .95}px`);
                doc.style.setProperty('--app-height-50', `${windowHeight * .5}px`);
            } catch(error) {
                if (environment.env !== 'prod') {
                    console.error(error);
                    debugger;
                }
            }
        }

        const _onResize = () => {
            appHeight();
            updateResponsiveService();
        }

        const _off__resize = this.renderer.listen('window', 'resize', _onResize);
        const _off__orientationchange = this.renderer.listen('window', 'orientationchange', _onResize);
        
        this._detachListeners = () => {
            _off__resize();
            _off__orientationchange();
        };

        appHeight();
        
        appHeight();

        // Listten to navigation for analytics
        this._routerEventsSub = this.router.events.subscribe(routerEvent => {
			this._checkRouterEvent(routerEvent as RouterEvent);
        });
    }

    private _initalize(): Promise<void> {
        const promises: Promise<any>[] = [];

        // Check if any current user is signed in
        promises.push(this.authService.handleAuth());

        return Promise.all(promises).then(() => {
            // pass
        }).catch(error => {
            console.error(error);

            this._snackBar.open(error.message || 'Unexpected issue found initalizing application', undefined, {
                duration: 5000,
                panelClass: 'snackbar-error',
            });
        })
    }

	private _checkRouterEvent(routerEvent: RouterEvent): void {
		// Tracking page views
		if (routerEvent instanceof NavigationEnd) {
			try {
                this.analyticsService.addPageView({
                    url: routerEvent.urlAfterRedirects,
                });
			} catch(error) {
				if (environment.env !== 'prod') {
                    console.error(error);
                    debugger;
				}
			}
        }
    }

    public ngOnDestroy(): void {
        this.authService?.firebaseAuthUnSub && this.authService.firebaseAuthUnSub();

        this._routerEventsSub?.unsubscribe();

        if (this._detachListeners) {
			this._detachListeners();
		}
    }
}
