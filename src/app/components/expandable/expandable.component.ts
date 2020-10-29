import { Component, OnInit, Input, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { environment } from '@environment';

// import { environment } from '@environment';

@Component({
    selector: 'moo-expandable',
    templateUrl: './expandable.template.html',
    styleUrls: ['./expandable.style.scss']
})
export class ExpandableComponent implements AfterViewInit {
    private initalized: boolean;
    @ViewChild('content', {static: true}) private content!: ElementRef<HTMLDivElement>;

    private _expanded: boolean;

    // Set expanded to true/false to toggle expandable
    @Input()
    public set expanded(expanded: boolean) {
        const _expanded: boolean = expanded || false;

        if (_expanded) {
            const height = this._getContentHeight();

            this._setMaxHeight(`${height}px`);

            this._doRemoveMaxHeightTimeout();
        } else {
            if (!this.initalized) {
                this._setMaxHeight('0');
                return;
            }

            clearTimeout(this._removeMaxHeightTimeout);

            const height = this._getContentHeight();

            this._setMaxHeight(`${height}px`);

            setTimeout(() => {
                this._setMaxHeight('0');
            }, 200);
        }

        this._expanded = _expanded;
    };
    public get expanded(): boolean {
        return this._expanded;
    };

    private _removeMaxHeightTimeout?: number;

    public maxHeight: string;

    constructor() {
        this.initalized = false;

        this._expanded = false;

        this.maxHeight = '0';
    }

    public ngAfterViewInit(): void {
        if (!this.content) {
            if (environment.env === 'dev') {
                debugger;
            }
        }
        
        this.initalized = true;
        // debugger;
    }

    private _getContentHeight(): number {
        const _d = this.content?.nativeElement;

        if (!_d) {
            return 0;
        }

        const rect = _d.getBoundingClientRect();

        const height = rect.height;

        return height;
    }

    /**
     * Accepts anything that would acceptable for a css value for max-height (ei: '0', 'none', '40px', '10%', '10vw')
     * @param cssValue css value for max-height
     */
    private _setMaxHeight(cssValue: string): void {
        this.maxHeight = cssValue;
    }

    private _doRemoveMaxHeightTimeout(): void {
        clearTimeout(this._removeMaxHeightTimeout);

        this._removeMaxHeightTimeout = window.setTimeout(() => {
            this._setMaxHeight('none');
        }, 200);// To match with css transition timing
    }

    public ngOnDestroy(): void {
        clearTimeout(this._removeMaxHeightTimeout);
    }
}
