import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';

import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { InputModule } from '@app/components/input';

@NgModule({
    declarations: [
        AdminComponent
    ],
    imports: [
        CommonModule,

        MatButtonModule,
        MatSnackBarModule,
        
        InputModule,
        
        AdminRoutingModule,
    ],
    providers: [
    ],
    bootstrap: [AdminComponent]
})
export class AdminModule { }
