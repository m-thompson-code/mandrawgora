// source: https://angular.io/guide/router#cancel-and-save
// source: Search 'src/app/can-deactivate-guard.service.ts' at https://angular.io/guide/router#cancel-and-save;

import { Injectable }    from '@angular/core';
import { CanDeactivate } from '@angular/router';

import { OverlayGalleryService } from '@app/services/overlay-gallery.service';
 
export interface CanComponentDeactivate {
    canDeactivate: () => Promise<boolean>;
}
 
@Injectable({
    providedIn: 'root',
})
export class CanDeactivateGuard implements CanDeactivate<CanComponentDeactivate> {
    constructor(private overlayGalleryService: OverlayGalleryService) {

    }
  	public canDeactivate(component?: CanComponentDeactivate): Promise<boolean> {
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
