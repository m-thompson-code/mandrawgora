import { Injectable } from '@angular/core';

// import { environment } from '@environment';

import { SlideImage } from '@app/components/gallery/gallery.component';


@Injectable({
    providedIn: 'root',
})
export class OverlayGalleryService {
    public images?: SlideImage[];

    public active?: boolean;

    public initalIndex: number = 0;
    
    constructor() {
    }

    public activate(activateIndex: number, images: SlideImage[]): void {
        this.images = images;
        this.initalIndex = activateIndex;

        setTimeout(() => {
            this.active = true;
        }, 0);
    }
    
    public deactivate(): void {
        // Setting active to false is handled by overlay component
        this.images = [];
        this.initalIndex = 0;
    }
}
