import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';

import { MatRippleModule } from '@angular/material/core';

import { DirectivesModule } from '@app/directives';

import { GalleryModule } from '@app/components/gallery';

@NgModule({
    declarations: [
        HomeComponent
    ],
    imports: [
        CommonModule,
        
        HomeRoutingModule,

        MatRippleModule,

        DirectivesModule,

        GalleryModule,
    ],
    providers: [
    ],
    bootstrap: [HomeComponent]
})
export class HomeModule { }
