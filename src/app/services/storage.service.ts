import { Injectable } from '@angular/core';

// import { environment } from '@environment';

import * as firebase from 'firebase/app';

@Injectable({
    providedIn: 'root',
})
export class StorageService {

    constructor() {
    }
    
    public uploadFile(file: Blob, filename: string): Promise<void> {
        // Create a root reference
        let storageRef = firebase.storage().ref();

        // Create a reference to 'mountains.jpg'
        var mountainsRef = storageRef.child(filename);

        // // While the file names are the same, the references point to different files
        // mountainsRef.name === mountainImagesRef.name            // true
        // mountainsRef.fullPath === mountainImagesRef.fullPath    // false

        // var file = ... // use the Blob or File API
        return mountainsRef.put(file).then(snapshot => {
            console.log('Uploaded a blob or file!');
            console.log(snapshot);
        });
    }
}
