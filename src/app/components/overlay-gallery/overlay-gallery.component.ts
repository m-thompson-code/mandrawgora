import { Component, OnInit, Input, ViewChild, ElementRef, OnDestroy, Output, EventEmitter, NgZone, AfterViewInit } from '@angular/core';

import { OverlayGalleryService } from '@app/services/overlay-gallery.service';

import { GalleryComponent } from '@app/components/gallery/gallery.component';

// import { environment } from '@environment';

@Component({
    selector: 'moo-overlay-gallery',
    templateUrl: './overlay-gallery.template.html',
    styleUrls: ['./overlay-gallery.style.scss']
})
export class OverlayGalleryComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild('gallery', {static: false}) public galleryRef!: GalleryComponent;

    public show?: boolean;

    constructor(private ngZone: NgZone, public overlayGalleryService: OverlayGalleryService) {

    }

    public ngOnInit(): void {
       this.activate();
    }

    public ngAfterViewInit(): void {
    }

    public activate(): void {
        this.show = true;

        const offsetY = window.pageYOffset;
        document.body.style.top = `${-offsetY}px`;
        document.body.classList.add('js-lock-position');
    }
    
    public deactivate(): void {
        this.show = false;

        setTimeout(() => {
            const offsetY = Math.abs(parseInt(document.body.style.top || "0", 10));
            document.body.classList.remove('js-lock-position');
            document.body.style.removeProperty('top');
            window.scrollTo(0, offsetY || 0);
    
            setTimeout(() => {
                this.overlayGalleryService.active = false;
            }, 0);
        }, 200);
    }

    public ngOnDestroy(): void {
        
    }
}
