import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UploaderComponent } from './uploader.component';

import { DirectivesModule } from '@app/directives';

import { ImageModule } from '@app/components/image';

@NgModule({
    declarations: [UploaderComponent],
    imports: [
        CommonModule,

        DirectivesModule,

        ImageModule,
    ],
    exports: [UploaderComponent]
})
export class UploaderModule { }
