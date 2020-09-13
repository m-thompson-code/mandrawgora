import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterEvent } from '@angular/router';
import { Subscription } from 'rxjs';

import { environment } from '@environment';

import { AnalyticsService } from '@app/services/analytics.service';
import { StorageService } from './services/storage.service';

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

    public dragover?: boolean;

    public uploadFiles: UploadFile[] = [];

    constructor(private router: Router, private analyticsService: AnalyticsService, private storageService: StorageService) {
        
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

    public handleFileInputChange(event: any): void {
        console.log(event);

        const _t = event?.target as HTMLInputElement;

        if (!_t || !_t.files || !_t.files.length) {
            console.error("Unexpected missing files from event");
            return;
        }

        const files = _t.files;

        this._handleFileList(files);
    }

    public handleFileInputDrop(event: any): void {
        console.log(event);

        event?.stopPropagation();
        event?.preventDefault();

        const _d = event?.dataTransfer as DataTransfer;

        if (!_d || !_d.files || !_d.files.length) {
            console.error("Unexpected missing files from event");
            return;
        }
        
        const files = _d.files;

        this._handleFileList(files);

        this.dragover = false;
    }

    public handleDragover(event: any): void {
        console.log(event);

        event?.stopPropagation();
        event?.preventDefault();

        if (!event || !event.dataTransfer) {
            return;
        }
        
        // Style the drag-and-drop as a "copy file" operation.
        event.dataTransfer.dropEffect = 'copy';

        this.dragover = true;
    }
    
    public handleDragend(event: any): void {
        console.log(event);

        event?.stopPropagation();
        event?.preventDefault();

        this.dragover = false;
    }

    private _handleFileList(fileList: FileList): void {
        if (!fileList) {
            console.error("Unexpected missing files from Filelist");
            return;
        }

        for (let i = 0; i < fileList.length; i++) {
            const file = fileList[i];

            const reader = new FileReader();

            console.log(file);

            const _file: UploadFile = {
                file: file,
                filename: file.name,
                src: null,
            };

            this.uploadFiles.push(_file);

            reader.onload = function (e) {
                // get loaded data and render thumbnail.
                _file.src = e?.target?.result || null;
            };
        
            // read the image file as a data URL.
            reader.readAsDataURL(file);
        }
    }

    public ngOnDestroy(): void {
        this._routerEventsSub?.unsubscribe();
    }
}
