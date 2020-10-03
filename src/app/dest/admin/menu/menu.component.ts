import { AfterViewInit, Component, OnDestroy, ViewChild, Input } from '@angular/core';
import { NavigationEnd, Router, RouterEvent } from '@angular/router';
import { Subscription } from 'rxjs';

import { environment } from '@environment';

@Component({
    selector: 'menu',
    templateUrl: './menu.template.html',
    styleUrls: ['./menu.style.scss']
})
export class MenuComponent {

    constructor(private router: Router) {
    }
}
