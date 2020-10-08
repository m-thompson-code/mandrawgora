import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BirthdayCanvasComponent } from './birthday-canvas.component';

@NgModule({
    declarations: [BirthdayCanvasComponent],
    imports: [
        CommonModule,
    ],
    exports: [BirthdayCanvasComponent]
})
export class BirthdayCanvasModule { }
