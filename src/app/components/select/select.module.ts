import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SelectComponent } from './select.component';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

@NgModule({
    declarations: [SelectComponent],
    imports: [
        CommonModule,

        MatFormFieldModule,
        MatSelectModule,
    ],
    exports: [SelectComponent]
})
export class SelectModule { }
