import { Injectable } from '@angular/core';
import { environment } from '@environment';

// import { environment } from '@environment';

import * as firebase from 'firebase/app';

export interface FileMetadata {
    url: string;
    filename: string;
    section?: string;
    timestamp: number;
}

@Injectable({
    providedIn: 'root',
})
export class FirestoreService {

    constructor() {
    }
    
    public saveFile(url: string, filename: string, section?: string): Promise<void> {
        const timestamp = Date.now();

        const fileMetadata: FileMetadata = {
            url: url,
            filename: filename,
            timestamp: timestamp,
        };

        if (section) {
            fileMetadata.section = section;
        }

        return firebase.firestore().collection('files').add(fileMetadata).then(() => {
            // pass
        }).catch(error => {
            console.error(error);
            if (environment.env !== 'prod') {
                debugger;
            }

            return error;
        });
    }

    public getFiles(orderBy: 'timestamp' | 'filename', section?: string): Promise<FileMetadata[]> {
        const files: FileMetadata[] = [];

        const colRef = firebase.firestore().collection('files');

        const query = colRef;

        if (orderBy === 'timestamp') {
            query.orderBy('timestamp', 'desc');
        } else if (orderBy === 'filename') {
            query.orderBy('timestamp', 'asc');
        } else {
            console.warn("Unexpected orderBy", orderBy);
            if (environment.env !== 'prod') {
                debugger;
            }
        }

        if (section) {
            query.where('section', '==', section);
        }

        return query.get().then(colSnapshot => {
            colSnapshot.forEach(_d => {
                const data = _d.data();

                if (!data) {
                    return;
                }

                const _fileMetadata: FileMetadata = {
                    url: data.url,
                    filename: data.filename,
                    timestamp: data.timestamp,
                };

                if (data.section) {
                    _fileMetadata.section = data.section;
                }

                files.push(_fileMetadata);
            });

            return files;
        }).catch(error => {
            console.error(error);
            if (environment.env !== 'prod') {
                debugger;
            }

            return error;
        });
    }
}
