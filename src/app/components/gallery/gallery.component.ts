import { Component, OnInit, Input, ViewChild, ElementRef, OnDestroy, Output, EventEmitter, NgZone, AfterViewInit } from '@angular/core';

// import { environment } from '@environment';

export interface SlideImage {
    src?: string | ArrayBuffer | null | undefined;
    url?: string | ArrayBuffer | null | undefined;
}

@Component({
    selector: 'moo-gallery',
    templateUrl: './gallery.template.html',
    styleUrls: ['./gallery.style.scss']
})
export class GalleryComponent implements OnInit, AfterViewInit, OnDestroy {
    @Input() public images: SlideImage[] = [];
    public activeSlides: SlideImage[] = [];

    public currentIndex: number = 0;

    public animate?: boolean;

    public slideDir?: 'left' | 'right';

    constructor(private ngZone: NgZone) {

    }

    public ngOnInit(): void {
        this.currentIndex = 0;

        this.updateCurrentImage();
    }

    public increaseIndex(): void {
        if (this.animate) {
            return;
        }

        this.animate = true;
        this.slideDir = 'right';

        setTimeout(() => {
            this.currentIndex += 1;

            if (this.currentIndex > this.images.length - 1) {
                this.currentIndex = 0;
            }

            this.updateCurrentImage();
        }, 400);
    }
    
    public decreaseIndex(): void {
        if (this.animate) {
            return;
        }
        
        this.animate = true;
        this.slideDir = 'left';

        setTimeout(() => {
            this.currentIndex -= 1;

            if (this.currentIndex < 0) {
                this.currentIndex = this.images.length - 1;
            }
    
            this.updateCurrentImage();
        }, 400);
    }

    public updateCurrentImage(): void {
        this.activeSlides = [
            this.images[this.currentIndex - 1] || this.images[this.images.length - 1],
            this.images[this.currentIndex],
            this.images[this.currentIndex + 1] || this.images[0],
        ];

        this.animate = false;
        this.slideDir = undefined;
    }

    public ngAfterViewInit(): void {
        
    }

    public ngOnDestroy(): void {
        
    }
}
