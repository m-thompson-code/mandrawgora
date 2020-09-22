import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GalleryComponent } from './gallery.component';

import { DirectivesModule } from '@app/directives';

import { ImageModule } from '@app/components/image';

@NgModule({
    declarations: [GalleryComponent],
    imports: [
        CommonModule,

        DirectivesModule,

        ImageModule,
    ],
    exports: [GalleryComponent]
})
export class GalleryModule { }
