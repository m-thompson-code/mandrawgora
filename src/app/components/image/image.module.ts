import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ImageComponent } from './image.component';

import { DirectivesModule } from '@app/directives';

@NgModule({
    declarations: [ImageComponent],
    imports: [
        CommonModule,

        DirectivesModule,
    ],
    exports: [ImageComponent]
})
export class ImageModule { }
