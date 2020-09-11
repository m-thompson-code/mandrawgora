import { Injectable } from '@angular/core';

// import { environment } from '@environment';

import * as firebase from 'firebase/app';

@Injectable({
    providedIn: 'root',
})
export class AnalyticsService {

    constructor() {
    }
    
    public addPageView(routeData: {url: string}): void {
        try {
            const url = routeData.url || "mandrawgora_unknown_url";

            console.log(url);
    
            firebase.analytics().logEvent('page_view', {
                'page_path': url,
                // 'page_name': pageName,
            });
        }catch(error) {
            console.error(error);
        }
    }
}
