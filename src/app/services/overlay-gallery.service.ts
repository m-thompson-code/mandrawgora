import { Injectable } from '@angular/core';

// import { environment } from '@environment';

@Injectable({
    providedIn: 'root',
})
export class OverlayGalleryService {
    public active?: boolean;
    
    constructor() {
    }
}
