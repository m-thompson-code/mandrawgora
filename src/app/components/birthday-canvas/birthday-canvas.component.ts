import { Component, OnInit, Input, ElementRef, ViewChild, AfterViewInit } from '@angular/core';

import { environment } from '@environment';
import { ResponsiveService } from '@app/services/responsive.service';

export interface RenderColor {
    color: string;
    timestamp: number;
    xStartPercent: number;
    xEndPercent: number;
    yMaxPercent: number;
    x: number;
    y: number;
    velocity: number;
    startVelocity: number;
    gravity: number;
    estEndTicks: number;
    ticks: number;
    scale: number;
    width: number;
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

        setTimeout(() => {
            this.pushColors();
        }, 1000);
    }

    public pushColors(): void {
        for (let i = 0; i < 400; i++) {
            setTimeout(() => {
                this.pushColor();
            }, i * 2 + i * i / 400);
        }
    }

    public pushColor(): void {
        const height = this.divContainer.offsetHeight;

        const g = .3 + Math.random() / 2;

        const yMaxPercent = Math.random() / 2 + .5;

        const initalV = Math.sqrt(2 * g * (height + 50) * yMaxPercent);

        const estEndTicks = initalV * 2 / g;

        const xStartPercent = Math.random() * .15 + .45;
        const xEndPercent = Math.random();

        let color = Math.random() < .6 ? '#71c4c8' : '#c9997f';

        const scale = .5 + Math.random() * 1.25;

        color = this.colorLuminance(color, scale - 1);

        const width = 2 + Math.random() * 6;

        this._colors.push({
            color: color,
            timestamp: Date.now(),
            xStartPercent: xStartPercent,
            xEndPercent: xEndPercent,
            yMaxPercent: yMaxPercent,
            x: 0,
            y: -50,
            velocity: initalV,
            startVelocity: initalV,
            estEndTicks: estEndTicks,
            gravity: g,
            ticks: 0,
            width: width,
            scale: scale,
        });
    }

    public animate(): void {
        const height = this.divContainer.offsetHeight;
        const width = this.divContainer.offsetWidth;

        const now = Date.now();

        const newColors = [];

        for (const color of this._colors) {
            color.velocity -= color.gravity;

            color.y += color.velocity;

            // Delete partical if below screen
            if (color.y < -50) {
                continue;
            }

            color.ticks += 1;

            color.x = color.xStartPercent * width + (color.xEndPercent - color.xStartPercent) * width * color.ticks / color.estEndTicks;

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


            for (const color of this._colors) {
                const lineWidth = color.width * color.scale;
                ctx.lineWidth = 3 * color.scale;

                if (color.y < -lineWidth) {
                    continue;
                }

                const _rh = Math.floor(Math.random() * lineWidth * 2) - lineWidth;
                const _rw = Math.floor(Math.random() * lineWidth * 2) - lineWidth;

                ctx.strokeStyle = color.color;
                ctx.beginPath();
                ctx.moveTo(color.x - _rh, height - (color.y - _rw));
                ctx.lineTo(color.x, height - color.y);
                ctx.stroke();

                ctx.beginPath();
                ctx.moveTo(color.x, height - color.y);
                ctx.lineTo(color.x + _rh, height - (color.y + _rw));
                ctx.stroke();
            }

            window.requestAnimationFrame(_drawLoop);
        }

        window.requestAnimationFrame(_drawLoop);
    }

    /**
     * 
     * @param hex - a hex color value such as “#abc” or “#123456” (the hash is optional)
     * @param lum - the luminosity factor, i.e. -0.1 is 10% darker, 0.2 is 20% lighter, etc.
     */
    public colorLuminance(hex: string, lum: number): string {

        // validate hex string
        hex = String(hex).replace(/[^0-9a-f]/gi, '');

        if (hex.length < 6) {
            hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
        }

        lum = lum || 0;
    
        // convert to decimal and change luminosity
        let rgb = "#", c, i;

        for (i = 0; i < 3; i++) {
            c = parseInt(hex.substr(i*2,2), 16);
            c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
            rgb += ("00"+c).substr(c.length);
        }
    
        return rgb;
    }

    public ngOnDestroy(): void {
        clearInterval(this._drawInterval);
    }
}
