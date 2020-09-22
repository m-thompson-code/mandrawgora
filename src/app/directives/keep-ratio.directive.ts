import { Directive, ElementRef, HostListener, AfterViewInit, Input, OnInit, EventEmitter, Output } from '@angular/core';

// import { debounce } from '@app/decorators/debounce';

@Directive({
    selector: '[mooKeepRatio]',
})
export class KeepRatioDirective implements OnInit, AfterViewInit {
    private _ratioHeight: number;

    @Input()
    public set ratioHeight(ratioHeight: number) {
        this._ratioHeight = ratioHeight;

        if (this.element.nativeElement) {
            this._recalcKeepRatio();
        }
    };

    public get ratioHeight(): number {
        return this._ratioHeight;
    };

    private _ratioWidth: number;
    @Input()
    public set ratioWidth(ratioWidth: number) {
        this._ratioWidth = ratioWidth;

        if (this.element.nativeElement) {
            this._recalcKeepRatio();
        }
    };

    public get ratioWidth(): number {
        return this._ratioWidth;
    };

    private _basedOnHeight: boolean;
    @Input()
    public set basedOnHeight(basedOnHeight: boolean) {
        this._basedOnHeight = basedOnHeight;

        if (this.element.nativeElement) {
            this._recalcKeepRatio();
        }
    };

    public get basedOnHeight(): boolean {
        return this._basedOnHeight;
    };

    private _basedOnWidth: boolean;
    @Input()
    public set basedOnWidth(basedOnWidth: boolean) {
        this._basedOnWidth = basedOnWidth;

        if (this.element.nativeElement) {
            this._recalcKeepRatio();
        }
    };

    public get basedOnWidth(): boolean {
        return this._basedOnWidth;
    };

    @Output() public keepRatioResized: EventEmitter<void> = new EventEmitter();

    private _debounceTimeout?: number;

    private _initalized: boolean;

    private _h?: number;
    private _w?: number;

    constructor(private element: ElementRef) {
        this._basedOnHeight = false;
        this._basedOnWidth = false;

        this._ratioHeight = 0;
        this._ratioWidth = 0;

        this._initalized = false;
    }

    public ngOnInit(): void {
        // if (!this.ratioHeight) {
        //     const message = "Unexpected missing ratioHeight";
        //     console.error(message);
        //     throw {
        //         message: message,
        //     };
        // }

        // if (!this.ratioWidth) {
        //     const message = "Unexpected missing ratioWidth";
        //     console.error(message);
        //     throw {
        //         message: message,
        //     };
        // }
    }

    @HostListener('window:resize') public onResize(): void {
        this._debouncedMaintainRatio(this.element.nativeElement);
    }
    
    @HostListener('window:orientationchange') public onOrientationChange(): void {
        this._debouncedMaintainRatio(this.element.nativeElement);
    }

    public ngAfterViewInit(): void {
        this._maintainRatio(this.element.nativeElement);

        // Safari/desktop doesn't handle this well on AfterViewInit, so we'll debouncing it and trying again
        // Safari issue on delivery/product: bottle and design will likely have the wrong width (fixes when you resize window)
        // IE 11 also doesn't maintain its ratio just right either, increasing debounce to 300ms
        window.setTimeout(() => {
            this._maintainRatio(this.element.nativeElement);
        }, 300);

        this._initalized = true;
    }

    // Maintains ratio based on height
    private _maintainRatio(element: HTMLElement): void {
        // Avoid erroring and keep normal workflow if we're missing anything
        if (!element || !this.ratioWidth || !this.ratioHeight) {
            return;
        }

        // const rect =  element.getBoundingClientRect();

        // Avoiding getBoundingClientRect since we use animations a lot, which might be messing up calculations (Safari issue on delivery/product)
        // Safari issue on delivery/product: bottle and design will likely have the wrong width (fixes when you resize window)
        // source: https://stackoverflow.com/questions/43537559/javascript-getboundingclientrect-vs-offsetheight-while-calculate-element-heigh
        // const rect_height = element.offsetHeight || rect.height;
        // const rect_width = element.offsetWidth || rect.width;

        // const rect_height = element.offsetHeight || rect.height;
        // const rect_width = element.offsetWidth || rect.width;

        let _h = this._h;
        let _w = this._w;

        if (this.basedOnWidth) {
            element.style.width = ``;

            // const rect_height = element.offsetHeight || rect.height;
            const rect_width = element.offsetWidth || element.getBoundingClientRect()?.width || 0;

            const width: number = rect_width || 0;
            const height: number = this.ratioHeight * width / this.ratioWidth;

            // Results are suspect, it's more likely that the values aren't ready yet
            if (!width || !height || width < 5 || height < 5) {
                return;
            }

            _w = width;
            _h = height;

            element.style.height = `${height}px`;
        } else {
            element.style.height = ``;

            const rect_height = element.offsetHeight || element.getBoundingClientRect()?.height;
            // const rect_width = element.offsetWidth || rect.width;

            const height: number = rect_height || 0;
            const width: number = this.ratioWidth * height / this.ratioHeight;

            // Results are suspect, it's more likely that the values aren't ready yet
            if (!width || !height || width < 5 || height < 5) {
                return;
            }

            _w = width;
            _h = height;

            element.style.width = `${width}px`;
        }

        if (this._w === _w || this._h !== _h) {
            this.keepRatioResized.emit();
        }

        this._w = _w;
        this._h = _h;
    }

    // @debounce(100)
    // @debounce decorator is only allowing the latest call to _debouncedMaintainRatio of any instance of this Class
    // This isn't ideal since there may be multiple elements using the KeepRatioDirective at the same time
    // To work around this, we are handing the debounce on our own
    private _debouncedMaintainRatio(element: HTMLElement): void {
        clearTimeout(this._debounceTimeout);
        this._debounceTimeout = window.setTimeout(() => {
            this._maintainRatio(element);
        }, 100);
    }

    private _recalcKeepRatio(): void {
        if (!this._initalized) {
            return;
        }
        
        clearTimeout(this._debounceTimeout);
        this._debounceTimeout = window.setTimeout(() => {
            this._maintainRatio(this.element.nativeElement);
        }, 0);

        // Safari/desktop doesn't handle this well on AfterViewInit, so we'll debouncing it and trying again
        // Safari issue on delivery/product: bottle and design will likely have the wrong width (fixes when you resize window)
        // IE 11 also doesn't maintain its ratio just right either, increasing debounce to 300ms
        window.setTimeout(() => {
            this._maintainRatio(this.element.nativeElement);
        }, 300);
    }
}
