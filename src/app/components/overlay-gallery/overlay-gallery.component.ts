import { Component, OnInit, Input, ViewChild, ElementRef, OnDestroy, Output, EventEmitter, NgZone, AfterViewInit } from '@angular/core';
import { OverlayGalleryService } from '@app/services/overlay-gallery.service';

// import { environment } from '@environment';

export interface SlideImage {
    src?: string | ArrayBuffer | null | undefined;
    url?: string | ArrayBuffer | null | undefined;
}

@Component({
    selector: 'moo-overlay-gallery',
    templateUrl: './overlay-gallery.template.html',
    styleUrls: ['./overlay-gallery.style.scss']
})
export class OverlayGalleryComponent implements OnInit, AfterViewInit, OnDestroy {
    public show?: boolean;

    constructor(private ngZone: NgZone, private overlayGalleryService: OverlayGalleryService) {

    }

    public ngOnInit(): void {
       
    }

    public ngAfterViewInit(): void {
        this.activate();
    }

    public activate(): void {
        this.show = true;
        document.body.style.overflow = 'hidden';
    }
    
    public deactivate(): void {
        this.show = false;
        document.body.style.overflow = '';

        setTimeout(() => {
            this.overlayGalleryService.active = false;
        }, 0);
    }

    public ngOnDestroy(): void {
        
    }
}
