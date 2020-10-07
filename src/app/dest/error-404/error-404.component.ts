import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { LoaderService } from '@app/services/loader.service';

import { environment } from '@environment';

@Component({
    selector: 'error-404',
    templateUrl: './error-404.template.html',
    styleUrls: ['./error-404.style.scss']
})
export class Error404Component implements AfterViewInit {
    constructor(private loaderService: LoaderService) {
    }

    public ngAfterViewInit(): void {
        this.loaderService.setShowLoader(false);
    }
}
