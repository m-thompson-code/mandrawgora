import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OverlayGalleryComponent } from './overlay-gallery.component';

import { DirectivesModule } from '@app/directives';

import { GalleryModule } from '@app/components/gallery';

import { MatRippleModule } from '@angular/material/core';

@NgModule({
    declarations: [OverlayGalleryComponent],
    imports: [
        CommonModule,

        DirectivesModule,

        GalleryModule,

        MatRippleModule,
    ],
    exports: [OverlayGalleryComponent]
})
export class OverlayGalleryModule { }
