// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { Environment } from './environment-interface';

export const environment: Environment = {
    env: 'dev',
    firebaseConfig: {
        apiKey: "AIzaSyAgOqk6DfGDBgiQVtKOBmLmvDogO6FFjyY",
        authDomain: "mandrawgora-demo.firebaseapp.com",
        databaseURL: "https://mandrawgora-demo.firebaseio.com",
        projectId: "mandrawgora-demo",
        storageBucket: "mandrawgora-demo.appspot.com",
        messagingSenderId: "533644078315",
        appId: "1:533644078315:web:559272e8a3c85a3b9e22ae",
        measurementId: "G-Y2DCMD9GRM",
    },
    adminEmails: [],
    header: "Art Gallery Demo",
    copyright: "Mark Thompson m.thompson.code@gmail.com",
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
