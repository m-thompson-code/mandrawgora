import { Injectable } from '@angular/core';

import { environment } from '@environment';

import * as firebase from 'firebase/app';

export interface FileUploadResult {
    snapshot: firebase.storage.UploadTaskSnapshot;
    url: string;
}

@Injectable({
    providedIn: 'root',
})
export class StorageService {

    constructor() {
    }
    
    public uploadFile(file: Blob, filename: string): Promise<FileUploadResult> {
        // Create a root reference
        let storageRef = firebase.storage().ref();

        // Create a reference to 'mountains.jpg'
        var childRef = storageRef.child(filename);

        // // While the file names are the same, the references point to different files
        // childRef.name === mountainImagesRef.name            // true
        // childRef.fullPath === mountainImagesRef.fullPath    // false

        // var file = ... // use the Blob or File API
        return childRef.put(file).then(snapshot => {
            console.log('Uploaded a blob or file!');
            console.log(snapshot);

            return {
                snapshot: snapshot,
                url: `https://storage.googleapis.com/mandrawgora-170d4.appspot.com/${filename}`,
            };
        }).catch(error => {
            console.error(error);
            if (environment.env !== 'prod') {
                debugger;
            }

            return error;
        });
    }
}
