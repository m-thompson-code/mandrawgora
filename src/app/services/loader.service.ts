import { Injectable } from '@angular/core';

// import { environment } from '@environment';

@Injectable({
    providedIn: 'root',
})
export class LoaderService {
    public showLoader: boolean = true;
    private _timeout?: number;
    constructor() {
    }

    public setShowLoader(show: boolean): void {
        clearTimeout(this._timeout);

        let timer = 0;

        if (show) {
            timer = 300;
        }
        
        this._timeout = window.setTimeout(() => {
            this.showLoader = show;
        }, timer);
    }
}
