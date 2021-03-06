import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';

import { MatRippleModule } from '@angular/material/core';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { DirectivesModule } from '@app/directives';

import { GalleryModule } from '@app/components/gallery';

import { BirthdayCanvasModule } from '@app/components/birthday-canvas';

@NgModule({
    declarations: [
        HomeComponent
    ],
    imports: [
        CommonModule,
        
        HomeRoutingModule,

        MatRippleModule,
        MatSnackBarModule,

        DirectivesModule,

        GalleryModule,

        BirthdayCanvasModule,
    ],
    providers: [
    ],
    bootstrap: [HomeComponent]
})
export class HomeModule { }
