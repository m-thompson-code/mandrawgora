import { Injectable } from '@angular/core';

export interface ResponsiveMetadata {
    deviceType: 'desktop_4k' | 'desktop' | 'tablet' | 'mobile';
    orientation: 'landscape' | 'portrait';
}

@Injectable({
    providedIn: 'root',
})
export class ResponsiveService {
    // This is managed on AppComponent
    public responsiveMetadata: ResponsiveMetadata;

    constructor() {
        this.responsiveMetadata = this.getResponsiveType();
    }

    /*

    These values come from variables.scss
    They should updated (manuelly for now) to match whwnever these values are updated

    $desktop_4k_scale: 1.3;
    $desktop_4k_width: 2540px;

    $desktop_scale: 1;
    $desktop_width: 1920px;// 1280px;

    // Roughly a little bigger than iPad Pro height (1366px)
    $landscape_width: 1400px;

    $tablet_scale: .7;
    $tablet_width: 1100px;// 992px updated to 1100 to meet iPad pro

    $mobile_scale: .5;
    $mobile_width: 600px;


    // Desktop  
    (max-width: $desktop_width)

    // Tablet (Portrait)
    (max-width: $tablet_width)
    (orientation: portrait)

    // Mobile (Portrait)
    (max-width: $mobile_width)
    (orientation: portrait)

    // Landscape
    (max-width: $landscape_width)
    (orientation: landscape)

    // Tablet (Landscape)
    (max-height: $tablet_width)

    // Mobile (Landscape)
    (max-height: $mobile_width)
    */

    public getResponsiveType(): ResponsiveMetadata {
        const desktopWidth = '1920px';
        const tabletWidth = '1100px';
        const mobileWidth = '600px';
        const landscapeWidth = '1400px';

        const isLandscape = window.matchMedia(`(orientation: landscape)`).matches && window.matchMedia(`(max-width: ${landscapeWidth})`).matches;

        if (isLandscape) {
            const isLandscapeMobile = window.matchMedia(`(max-height: ${mobileWidth})`).matches;

            if (isLandscapeMobile) {
                return {
                    deviceType: 'mobile',
                    orientation: 'landscape',
                };
            }

            const isLandscapeTablet = window.matchMedia(`(max-height: ${tabletWidth})`).matches;

            if (isLandscapeTablet) {
                return {
                    deviceType: 'tablet',
                    orientation: 'landscape',
                };
            }
        } else {

            const isPortraitMobile = window.matchMedia(`(max-width: ${mobileWidth})`).matches;

            if (isPortraitMobile) {
                return {
                    deviceType: 'mobile',
                    orientation: 'portrait',
                };
            }

            const isPortraitTablet = window.matchMedia(`(max-width: ${tabletWidth})`).matches;

            if (isPortraitTablet) {
                return {
                    deviceType: 'tablet',
                    orientation: 'portrait',
                };
            }

            const isDesktop = window.matchMedia(`(max-width: ${desktopWidth})`).matches;

            if (isDesktop) {
                return {
                    deviceType: 'desktop',
                    orientation: 'landscape',
                };
            }
        }

        return {
            deviceType: 'desktop_4k',
            orientation: 'landscape',
        };
    }
}
