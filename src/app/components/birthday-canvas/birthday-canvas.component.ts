import { Component, OnInit, Input, ElementRef, ViewChild, AfterViewInit } from '@angular/core';

import { environment } from '@environment';
import { ResponsiveService } from '@app/services/responsive.service';

export interface RenderColor {
    color: string;
    timestamp: number;
    xStartPercent: number;
    xEndPercent: number;
    x: number;
    y: number;
    velocity: number;
    startVelocity: number;
    landingTime: number;
    ticks: number;
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
        this.pushColor(1);
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

    public pushColor(index: number): void {
        const height = this.divContainer.offsetHeight;

        this._colors = [];

        const g = .5;

        const initalV = Math.sqrt(2 * g * height);

        const landingTime = initalV * 2 / g;

        this._colors.push({
            color: 'red',
            timestamp: Date.now(),
            xStartPercent: 0,
            xEndPercent: 1,
            x: 0,
            y: 0,
            velocity: initalV,
            startVelocity: initalV,
            landingTime: landingTime,
            ticks: 0,
        });
    }

    public animate(): void {
        const height = this.divContainer.offsetHeight;
        const width = this.divContainer.offsetWidth;

        const now = Date.now();

        const newColors = [];

        for (const color of this._colors) {
            color.ticks += 1;

            color.velocity -= .5;

            color.x = color.xEndPercent * width * color.ticks / color.landingTime;
            color.y += color.velocity;

            if (color.y < -50) {
                continue;
            }

            newColors.push(color);
        }

        this._colors = newColors;
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

            const lineWidth = 20;

            for (const color of this._colors) {
                if (color.y < -lineWidth) {
                    continue;
                }

                const _rh = Math.floor(Math.random() * lineWidth * 2) - lineWidth;
                const _rw = Math.floor(Math.random() * lineWidth * 2) - lineWidth;

                ctx.strokeStyle = "#FF0000";
                ctx.beginPath();
                ctx.moveTo(color.x - _rh, height - (color.y - _rw));
                ctx.lineTo(color.x, height - color.y);
                ctx.stroke();

                ctx.strokeStyle = "#FFFFFF";
                ctx.beginPath();
                ctx.moveTo(color.x, height - color.y);
                ctx.lineTo(color.x + _rh, height - (color.y + _rw));
                ctx.stroke();
            }

            window.requestAnimationFrame(_drawLoop);
        }

        window.requestAnimationFrame(_drawLoop);
    }

    public ngOnDestroy(): void {
        clearInterval(this._drawInterval);
    }
}
