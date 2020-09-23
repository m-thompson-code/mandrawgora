import { Component, OnInit, Input, ViewChild, ElementRef, OnDestroy, Output, EventEmitter, NgZone, AfterViewInit } from '@angular/core';

import { environment } from '@environment';

@Component({
    selector: 'moo-image',
    templateUrl: './image.template.html',
    styleUrls: ['./image.style.scss']
})
export class ImageComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild('image', {static: true}) private image!: ElementRef<HTMLImageElement>;

    private _src: string | ArrayBuffer | null | undefined = '';

    // Used for the template since binding a set property is bad performance
    public src_template: string | ArrayBuffer | null | undefined = '';

    @Input()
    public set src(src: string | ArrayBuffer | null | undefined) {
        const _src: string | ArrayBuffer | null | undefined = src || '';

        if (_src) {
            // TODO: listen to image
            this.handleSrc(_src);
        }

        this._src = _src || '';
    };

    public get src(): string | ArrayBuffer | null | undefined {
        return this._src;
    };

    private _getDimensionsInterval?: number;

    public imageWidth: number = 0;
    public imageHeight: number = 0;

    @Input() containerElement?: HTMLElement;

    constructor(private ngZone: NgZone) {
    }

    public ngOnInit(): void {
    }

    public handleSrc(src: string | ArrayBuffer | null | undefined): void {
        this.imageWidth = 0;
        this.imageHeight = 0;

        this.image.nativeElement.removeEventListener('load', this.onload.bind(this));
		this.image.nativeElement.removeEventListener('error', this.onerror.bind(this));
		
		this.image.nativeElement.addEventListener('load', this.onload.bind(this));
        this.image.nativeElement.addEventListener('error', this.onerror.bind(this));

        clearInterval(this._getDimensionsInterval);
        this._getDimensionsInterval = window.setInterval(() => {
            if (this.image.nativeElement.naturalWidth && this.image.nativeElement.naturalHeight) {
                clearInterval(this._getDimensionsInterval);
                this.imageWidth = this.image.nativeElement.naturalWidth;
                this.imageHeight = this.image.nativeElement.naturalHeight;
            }
        }, 100);
        
        this.src_template = src;
    }

    public onload(event: any): void {
        this.ngZone.run(() => {
            console.log(event);

            this.imageWidth = this.image.nativeElement.naturalWidth;
            this.imageHeight = this.image.nativeElement.naturalHeight;
        });
    }

    public onerror(event: any): void {
        this.ngZone.run(() => {
            console.log(event);
        });
    }

    public ngAfterViewInit(): void {
        if (!this.src) {
            if (environment.env !== 'prod') {
                debugger;
            }
        }

        if (!this.image) {
            if (environment.env !== 'prod') {
                debugger;
            }
        }
    }

    public ngOnDestroy(): void {
        
    }
}
