import { Component, OnInit, Input, ElementRef, ViewChild, AfterViewInit } from '@angular/core';

import { environment } from '@environment';
import { ResponsiveService } from '@app/services/responsive.service';

export interface RenderColor {
    color: string;
    timestamp: number;
    xPercent: number;
    y: number;
    velocity: number;
}

const UPDATE_RATE = 1000/60;

@Component({
    selector: 'moo-birthday-canvas',
    templateUrl: './birthday-canvas.template.html',
    styleUrls: ['./birthday-canvas.style.scss']
})
export class BirthdayCanvasComponent implements OnInit, AfterViewInit {
    @ViewChild('canvas', {static: false}) private canvas!: ElementRef<HTMLCanvasElement>;
    @Input() public divContainer!: HTMLDivElement;

    private _colors: RenderColor[] = [];

    private _drawInterval?: number;

    constructor(private responsiveService: ResponsiveService) {
    }

    public ngOnInit(): void {
    }

    public ngAfterViewInit(): void {
        if (!this.divContainer) {
            if (environment.env !== 'prod') {
                debugger;
            }
        }

        this.draw();

        this._drawInterval = window.setInterval(() => {
            this.animate();
        }, UPDATE_RATE);
    }

    public pushEmoji(index: number): void {
        
    }

    public animate(): void {
        const height = this.divContainer.offsetHeight;
        // const width = this.divContainer.offsetWidth;

        const now = Date.now();

        const newColors = [];

        for (const color of this._colors) {

            let dist = color.velocity / UPDATE_RATE;

            if (this.responsiveService.responsiveMetadata.deviceType === 'mobile') {
                dist = dist * .75;
            }

            const timestampDelta = now - color.timestamp;

            const yDelta = timestampDelta * dist;

            color.y += yDelta;
            color.timestamp = now;

            if (color.y > height) {
                continue;
            }

            newColors.push(color);
        }

        // this._colors = RenderColor
    }

    public draw(): void {
        const _drawLoop = () => {
            const height = this.divContainer.offsetHeight;
            const width = this.divContainer.offsetWidth;

            const _c = this.canvas.nativeElement;

            const ctx = _c.getContext('2d');

            if (!ctx) {
                debugger;
                return;
            }

            _c.height = height;
            _c.width = width;

            ctx.clearRect(0, 0, width, height);// clear canvas
            ctx.lineWidth = 3;

            const _width = 20;

            const _rh = Math.floor(Math.random() * _width * 2) - _width;
            const _rw = Math.floor(Math.random() * _width * 2) - _width;

            ctx.strokeStyle = "#FF0000";
            ctx.beginPath();
            ctx.moveTo(50 - _rh, 50 - _rw);
            ctx.lineTo(50, 50);
            ctx.stroke();

            ctx.strokeStyle = "#FFFFFF";
            ctx.beginPath();
            ctx.moveTo(50, 50);
            ctx.lineTo(50 + _rh, 50 + _rw);
            ctx.stroke();

            // ctx.clearRect(0, 0, width, height);// clear canvas
            // ctx.lineWidth = 5;

            // for (const color of this._colors) {
            //     if (color.y < -50) {
            //         continue;
            //     }

            //     let alpha = (height - color.y) / height;

            //     if (alpha > 1) {
            //         alpha = 1;
            //     } else if (alpha < 0) {
            //         alpha = 0;
            //     }

            //     ctx.globalAlpha = alpha;

            //     const x = color.xPercent;

            //     ctx.strokeRect(20, 20, 80, 100);
            // }

            window.requestAnimationFrame(_drawLoop);
        }

        window.requestAnimationFrame(_drawLoop);
    }

    public ngOnDestroy(): void {
        clearInterval(this._drawInterval);
    }
}
