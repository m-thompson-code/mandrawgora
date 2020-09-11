import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterEvent } from '@angular/router';
import { Subscription } from 'rxjs';

import { environment } from '@environment';

import { AnalyticsService } from '@app/services/analytics.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit, OnDestroy {
    private _routerEventsSub?: Subscription;

    constructor(private router: Router, private activatedRoute: ActivatedRoute, private analyticsService: AnalyticsService) {
        
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
			this.checkRouterEvent(routerEvent as RouterEvent);
        });
    }

	private checkRouterEvent(routerEvent: RouterEvent): void {
		// if (routerEvent instanceof NavigationStart) {
		// 	// clearTimeout(this.setRouteLoadingTimeout);
		// 	// this.setRouteLoadingTimeout = window.setTimeout(() => {
		// 	// 	this.routeLoading = true;
		// 	// }, 1000);
		// }

		// if (routerEvent instanceof NavigationEnd ||
		// 	routerEvent instanceof NavigationCancel ||
		// 	routerEvent instanceof NavigationError) {
		// 	// clearTimeout(this.setRouteLoadingTimeout);
		// 	// this.setRouteLoadingTimeout = window.setTimeout(() => {
		// 	// 	this.routeLoading = false;
		// 	// }, 0);

		// 	// // Clear any router preloads that may be going while navigating back to the same page before PreloadResolver resolves
		// 	// this.preloadService.preloadRouterAssets();
		// }

		// Tracking page views
		if (routerEvent instanceof NavigationEnd) {
			try {
                // const extraRouteData = this.getExtraRouteData(this.activatedRoute);

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
    
    // private getExtraRouteData(activatedRoute: ActivatedRoute): any | undefined {// ExtraRouteData | undefined {
    //     const data = activatedRoute.snapshot.data as any;

    //     if (data.extraRouteData) {
    //         return data.extraRouteData;
    //     }
        
    //     if (activatedRoute.firstChild) {
    //         return this.getExtraRouteData(activatedRoute.firstChild);
    //     }

    //     return undefined;
    // }

    public ngOnDestroy(): void {
        this._routerEventsSub?.unsubscribe();
    }
}
