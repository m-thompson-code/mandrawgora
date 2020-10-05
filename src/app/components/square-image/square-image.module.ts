import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SquareImageComponent } from './square-image.component';

import { DirectivesModule } from '@app/directives';

@NgModule({
    declarations: [SquareImageComponent],
    imports: [
        CommonModule,

        DirectivesModule,
    ],
    exports: [SquareImageComponent]
})
export class ImageModule { }
