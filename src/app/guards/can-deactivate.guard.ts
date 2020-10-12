// source: https://angular.io/guide/router#cancel-and-save
// source: Search 'src/app/can-deactivate-guard.service.ts' at https://angular.io/guide/router#cancel-and-save;

import { Injectable }    from '@angular/core';
import { CanDeactivate } from '@angular/router';

import { NavigationService } from '@app/services/navigation.service';
import { OverlayGalleryService } from '@app/services/overlay-gallery.service';
 
export interface CanComponentDeactivate {
    canDeactivate: () => Promise<boolean>;
}
 
@Injectable({
    providedIn: 'root',
})
export class CanDeactivateGuard implements CanDeactivate<CanComponentDeactivate> {
    constructor(private overlayGalleryService: OverlayGalleryService, private navigationService: NavigationService) {

    }

  	public canDeactivate(component?: CanComponentDeactivate): Promise<boolean> {
        return this._canDeactivate(component).then(_canDeactivate => {
            if (!_canDeactivate) {
                // Fix history state
                this.navigationService.pushLastHistoryState();
            }

            return _canDeactivate;
        })
    }

  	public _canDeactivate(component?: CanComponentDeactivate): Promise<boolean> {
        console.log(component);
        if (this.overlayGalleryService.active) {
            this.overlayGalleryService.deactivate();
            return Promise.resolve(false);
        }

        if (!component || !component.canDeactivate) {
            return Promise.resolve(true);
        }

        return component.canDeactivate();
    }
}
