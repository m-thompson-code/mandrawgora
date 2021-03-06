import { Component, OnInit, Input, ViewChild, ElementRef, OnDestroy, Output, EventEmitter, NgZone, AfterViewInit, Renderer2 } from '@angular/core';

import { environment } from '@environment';

@Component({
    selector: 'moo-square-image',
    templateUrl: './square-image.template.html',
    styleUrls: ['./square-image.style.scss']
})
export class SquareImageComponent implements OnInit, AfterViewInit, OnDestroy {
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

    private _detachListeners?: () => void;

    constructor(private ngZone: NgZone, private renderer: Renderer2) {
    }

    public ngOnInit(): void {
    }

    public handleSrc(src: string | ArrayBuffer | null | undefined): void {
        this.imageWidth = 0;
        this.imageHeight = 0;

        this._detachListeners && this._detachListeners();

        const _load_off = this.renderer.listen(this.image.nativeElement, 'load', this.onload.bind(this));
        const _error_off = this.renderer.listen(this.image.nativeElement, 'error', this.onerror.bind(this));
        
        this._detachListeners = () => {
            _load_off();
            _error_off();
        };

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
            this.imageWidth = this.image.nativeElement.naturalWidth;
            this.imageHeight = this.image.nativeElement.naturalHeight;
        });
    }

    public onerror(error: any): void {
        this.ngZone.run(() => {
            console.error(error);
        });
    }

    public ngAfterViewInit(): void {
        if (!this.src) {
            if (environment.env === 'staging') {
                debugger;
            }
        }

        if (!this.image) {
            if (environment.env === 'staging') {
                debugger;
            }
        }
    }

    public ngOnDestroy(): void {
        this._detachListeners && this._detachListeners();
    }
}
