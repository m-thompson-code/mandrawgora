import { PopStateEvent } from '@angular/common';
import { Injectable } from '@angular/core';

import { environment } from '@environment';

// source: https://github.com/angular/angular/issues/13586#issuecomment-690193874

@Injectable({
    providedIn: 'root',
})
export class NavigationService {
    private lastPoppedState?: any;
    private _onpopstate?: (popstateEvent: PopStateEvent) => void;

    constructor() {
        this._onpopstate = (popstateEvent) => {
            console.log(popstateEvent.state);
            this.lastPoppedState = popstateEvent.state;
        };
    }

    public setup(): void {
        if (!this._onpopstate) {
            
            if (environment.env !== 'prod') {
                debugger;
            }

            return;
        }
        window.addEventListener('popstate', this._onpopstate);
    }

    public destroy(): void {
        if (this._onpopstate) {
            window.removeEventListener('popstate', this._onpopstate);
        }
    }

    public pushLastHistoryState(): void {
        window.history.pushState(this.lastPoppedState, '');
    }
}
