import { Injectable } from '@angular/core';

import { environment } from '@environment';

import firebase from 'firebase/app';
import { Observable, Subject } from 'rxjs';

export interface FileUploadResult {
    snapshot: firebase.storage.UploadTaskSnapshot;
    url: string;
    filename: string;
}

@Injectable({
    providedIn: 'root',
})
export class StorageService {

    constructor() {
    }
    
    public uploadFile(file: Blob, filename: string): {progressObservable: Observable<number>, fileUploadResult: Promise<FileUploadResult>} {
        // Create a root reference
        let storageRef = firebase.storage().ref();

        // Create a reference to 'mountains.jpg'
        var childRef = storageRef.child(filename);

        const uploadTask = childRef.put(file);

        const _s: Subject<number> = new Subject<number>();
        const _o: Observable<number> = _s.asObservable();

        uploadTask.on('state_changed', snapshot => {
            // Observe state change events such as progress, pause, and resume
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            const progress = snapshot.bytesTransferred / snapshot.totalBytes;
            _s.next(progress);
        }, error => {
            // TODO: Handle unsuccessful uploads
            console.error(error);

            if (environment.env !== 'prod') {
                debugger;
            }

        }, () => {
            _s.next(1);
        });

        const _p = uploadTask.then(snapshot => {
            return {
                snapshot: snapshot,
                url: `https://storage.googleapis.com/mandrawgora-170d4.appspot.com/${filename}`,
                filename: filename,
            };
        }).catch(error => {
            console.error(error);

            if (environment.env !== 'prod') {
                debugger;
            }

            return error;
        });

        return {
            fileUploadResult: _p,
            progressObservable: _o,
        };
    }

    public deleteFile(filename: string): Promise<void> {
        // Create a root reference
        let storageRef = firebase.storage().ref();

        // Create a reference to 'mountains.jpg'
        var childRef = storageRef.child(filename);

        return childRef.delete().then(_d => {
            // pass
        }).catch(error => {
            if (error.code === 'storage/object-not-found') {
                // pass
                return;
            }

            throw error;
        });
    }
}
