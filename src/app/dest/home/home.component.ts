import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import * as moment from 'moment';

import { Environment, environment } from '@environment';

import { FileMetadata, FirestoreService, Section } from '@app/services/firestore.service';
import { LoaderService } from '@app/services/loader.service';
import { GalleryComponent } from '@app/components/gallery/gallery.component';
import { OverlayGalleryService } from '@app/services/overlay-gallery.service';
import { HomeService } from '@app/services/home.service';
import { BirthdayCanvasComponent } from '@app/components/birthday-canvas/birthday-canvas.component';
import { AuthService } from '@app/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
    selector: 'home',
    templateUrl: './home.template.html',
    styleUrls: ['./home.style.scss']
})
export class HomeComponent implements AfterViewInit, OnDestroy {
    @ViewChild('gallery', {static: false}) public galleryRef!: GalleryComponent;
    @ViewChild('birthdayCanvas', {static: false}) public birthdayCanvasRef!: BirthdayCanvasComponent;

    public files?: FileMetadata[] = [];

    public sections: Section[] = [];
    public selectedSection?: Section;

    public showTopNavSections: boolean = false;

    public revealImageCount: number = 0;
    public revealSectionCount: number = 0;

    public _revealImageInterval?: number;
    public _revealSectionInterval?: number;

    private _queryCount: number = 0;

    public _paramSubscription?: Subscription;

    private _sectionSlug?: string;

    public showBirthday: boolean = false;
    public showAdminNav: boolean = true;

    public initalized: boolean = false;

    public environment?: Environment;

    constructor(private router: Router, private activatedRoute: ActivatedRoute, public authService: AuthService, 
        private firestoreService: FirestoreService, public loaderService: LoaderService, 
        private overlayGalleryService: OverlayGalleryService, private homeService: HomeService, 
        private _snackBar: MatSnackBar) {
    }

    public ngOnInit(): void {
        this.environment = environment;
        
        (window as any).__birthday = () => {
            this.showBirthday = true;
        }

        const _m = moment();

        if (_m.month() === 9 && _m.date() === 29) {
            this.showBirthday = true;
        }

        this.initalized = false;
    }

    public ngAfterViewInit(): void {
        void this._initalize().then(() => {
            this._paramSubscription = this.activatedRoute.params.subscribe(params => {
                this._sectionSlug = params['section'] || this.sections[0]?.slug;

                let found = false;
                for (const section of this.sections) {
                    if (section.slug === this._sectionSlug) {
                        this.setSelectedSection(section);
                        found = true;
                        break;
                    }
                }
    
                if (!found) {
                    this.router.navigate(['404'], {
                        skipLocationChange: true,
                        replaceUrl: true,
                    });
                }
            });
        }).catch(error => {
            console.error(error);

            this._snackBar.open(error.message || 'Unexpected error. Please try again later', undefined, {
                duration: 5000,
                panelClass: 'snackbar-error',
            });
        });
    }

    private _initalize(): Promise<void> {
        this.initalized = false;

        this.loaderService.setShowLoader(true);

        this._queryCount += 1;
        const _queryCount = this._queryCount;

        return this._getSections().then(() => {
            // pass
        });
    }

    private _loadFiles(): Promise<void> {
        this.initalized = false;
        this.loaderService.setShowLoader(true);

        this._queryCount += 1;
        const _queryCount = this._queryCount;

        if (this.selectedSection) {
            return this._getFiles(this._queryCount, this.selectedSection).then(() => {
                if (_queryCount === this._queryCount) {
                    this.loaderService.setShowLoader(false);
                    this.initalized = true;
                }
            });
        }

        return Promise.resolve().then(() => {
            if (_queryCount === this._queryCount) {
                this.loaderService.setShowLoader(false);
                this.initalized = true;
            }
        });
    }

    private _getSections(): Promise<void> {
        this.sections = [];

        const promises: Promise<any>[] = [];

        if (!this.homeService.sections?.length) {
            promises.push(this.homeService.getSections());
        }

        return Promise.all(promises).then(() => {
            this.sections = this.homeService.sections;

            this.revealSectionCount = 0;

            clearInterval(this._revealSectionInterval);

            this._revealSectionInterval = window.setInterval(() => {
                if (!this.files) {
                    return;
                }

                this.revealSectionCount += 1;
                
                if (this.revealSectionCount >= this.sections.length) {
                    clearInterval(this._revealSectionInterval);
                }
            }, 200);
        });
    }

    private _getFiles(queryID: number, section: Section): Promise<void> {
        return this.firestoreService.getFiles('order', section).then(files => {
            if (queryID === this._queryCount) {
                this.files = files;

                this.revealImageCount = 0;

                clearInterval(this._revealImageInterval);

                this._revealImageInterval = window.setInterval(() => {
                    if (!this.files) {
                        return;
                    }
        
                    this.revealImageCount += 1;
                    
                    if (this.revealImageCount >= this.files.length) {
                        clearInterval(this._revealImageInterval);
                    }
                }, 200);
            }
        });
    }

    public setSelectedSection(section: Section): void {
        const _old = this.selectedSection;

        this.selectedSection = section;

        if (_old !== section) {
            this._loadFiles();
        }
    }

    public setShowSections(show: boolean): void {
        this.showTopNavSections = show;
    }

    public activateOverlay(index: number): void {
        if (!this.files) {
            return;
        }

        this.overlayGalleryService.activate(index, this.files);
    }

    public birthdayFunc(): void {
        this.birthdayCanvasRef?.pushColors();
    }

    public ngOnDestroy(): void {
        this.loaderService.setShowLoader(false);
        clearInterval(this._revealImageInterval);
        clearInterval(this._revealSectionInterval);
        this._paramSubscription?.unsubscribe();
    }
}
