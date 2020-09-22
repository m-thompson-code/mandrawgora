import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { NavigationEnd, Router, RouterEvent } from '@angular/router';
import { Subscription } from 'rxjs';

import { environment } from '@environment';

import { AnalyticsService } from '@app/services/analytics.service';
import { StorageService } from './services/storage.service';
import { FileMetadata, FirestoreService } from './services/firestore.service';
import { FirebaseService } from './services/firebase.service';
import { LoaderService } from './services/loader.service';
import { OverlayGalleryService } from './services/overlay-gallery.service';

export interface UploadFile {
    file: File;
    filename: string;
    src: string | ArrayBuffer | null;
}

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit, OnDestroy {
    private _routerEventsSub?: Subscription;
    constructor(private router: Router, public firebaseService: FirebaseService, private analyticsService: AnalyticsService, 
        public loaderService: LoaderService, public overlayGalleryService: OverlayGalleryService) {
    }

    public ngAfterViewInit(): void {
        // const updateResponsiveService = () => {
        //     this.responsiveService.responsiveMetadata = this.responsiveService.getResponsiveType();
        // }

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

        const onResize = () => {
            appHeight();
            // updateResponsiveService();
        }

        window.addEventListener('resize', onResize);
        window.addEventListener('orientationchange', onResize);
        
        appHeight();

        this._routerEventsSub = this.router.events.subscribe(routerEvent=> {
			this._checkRouterEvent(routerEvent as RouterEvent);
        });
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
        this._routerEventsSub?.unsubscribe();
    }
}
