import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RootRoutingModule } from './root-routing.module';
import { RootComponent } from './root.component';

import { MatSnackBarModule } from '@angular/material/snack-bar';


@NgModule({
    declarations: [
        RootComponent
    ],
    imports: [
        CommonModule,
        
        RootRoutingModule,

        MatSnackBarModule,
    ],
    providers: [
    ],
    bootstrap: [RootComponent]
})
export class RootModule { }
