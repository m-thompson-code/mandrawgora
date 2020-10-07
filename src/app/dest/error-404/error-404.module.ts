import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Error404RoutingModule } from './error-404-routing.module';
import { Error404Component } from './error-404.component';

@NgModule({
    declarations: [
        Error404Component
    ],
    imports: [
        CommonModule,
        
        Error404RoutingModule,
    ],
    providers: [
    ],
    bootstrap: [Error404Component]
})
export class Error404Module { }
