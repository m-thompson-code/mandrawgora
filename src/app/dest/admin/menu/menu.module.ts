import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MenuRoutingModule } from './menu-routing.module';
import { MenuComponent } from './menu.component';

import { MatRippleModule } from '@angular/material/core';

@NgModule({
    declarations: [
        MenuComponent
    ],
    imports: [
        CommonModule,
        
        MenuRoutingModule,

        MatRippleModule,
    ],
    providers: [
    ],
    bootstrap: [MenuComponent]
})
export class MenuModule { }
