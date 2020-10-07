import { Injectable } from '@angular/core';
import { environment } from '@environment';

// import { environment } from '@environment';

import * as firebase from 'firebase/app';

export interface Section {
    text: string;
    slug: string;
    order: number;
}

export interface FileMetadata {
    url: string;
    filename: string;
    sectionSlug?: string;
    timestamp: number;
    firestoreID: string;
    order: number;
}

@Injectable({
    providedIn: 'root',
})
export class FirestoreService {

    constructor() {
    }
    
    public addFile(url: string, filename: string, order: number, section?: Section): Promise<FileMetadata> {
        const timestamp = Date.now();

        const docRef = firebase.firestore().collection('files').doc();

        const firestoreID = docRef.id;

        const fileMetadata: FileMetadata = {
            url: url,
            filename: filename,
            timestamp: timestamp,
            firestoreID: firestoreID,
            order: order || 0,
        };

        if (section) {
            fileMetadata.sectionSlug = section.slug;
        }

        return docRef.set(fileMetadata).then(() => {
            return fileMetadata;
        }).catch(error => {
            console.error(error);
            if (environment.env !== 'prod') {
                debugger;
            }

            return error;
        });
    }

    public updateFile(fileMetadata: FileMetadata, section?: Section): Promise<FileMetadata> {
        const docRef = firebase.firestore().collection('files').doc(fileMetadata.firestoreID);

        const firestoreID = docRef.id;

        const _fileMetadata: FileMetadata = {
            url: fileMetadata.url,
            filename: fileMetadata.filename,
            timestamp: fileMetadata.timestamp || Date.now(),
            firestoreID: firestoreID,
            order: fileMetadata.order || 0,
        };

        if (section) {
            _fileMetadata.sectionSlug = section.slug;
        }

        return docRef.set(_fileMetadata).then(() => {
            return _fileMetadata;
        }).catch(error => {
            console.error(error);
            if (environment.env !== 'prod') {
                debugger;
            }

            return error;
        });
    }

    public deleteFile(firestoreID: string): Promise<void> {
        return firebase.firestore().collection('files').doc(firestoreID).delete().then(() => {
            // pass
        }).catch(error => {
            console.error(error);
            if (environment.env !== 'prod') {
                debugger;
            }

            return error;
        });
    }

    public getFiles(orderBy: 'order' | 'timestamp' | 'filename', section?: Section): Promise<FileMetadata[]> {
        let query: firebase.firestore.CollectionReference<firebase.firestore.DocumentData> | firebase.firestore.Query<firebase.firestore.DocumentData> = firebase.firestore().collection('files');

        if (section) {
            query = query.where('sectionSlug', '==', section.slug);
        }

        if (orderBy === 'timestamp') {
            query = query.orderBy('timestamp', 'desc');
        } else if (orderBy === 'filename') {
            query = query.orderBy('timestamp', 'asc');
        } else if (orderBy === 'order') {
            query = query.orderBy('order', 'desc');
        } else {
            console.warn("Unexpected orderBy", orderBy);
            if (environment.env !== 'prod') {
                debugger;
            }
        }

        console.log(firebase);

        return query.get().then(colSnapshot => {
            const files: FileMetadata[] = [];

            colSnapshot.forEach(_d => {
                const data = _d.data();
                console.log(data);

                if (!data) {
                    return;
                }

                const _fileMetadata: FileMetadata = {
                    url: data.url,
                    filename: data.filename,
                    timestamp: data.timestamp,
                    order: data.order,
                    firestoreID: _d.id,
                };

                if (data.sectionSlug) {
                    _fileMetadata.sectionSlug = data.sectionSlug;
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

    public getSections(): Promise<Section[]> {
        const docRef = firebase.firestore().collection('sections').doc('sections-data');

        const sections: Section[] = [];

        return docRef.get().then(_d => {
            if (!_d || !_d.exists) {
                return [];
            }

            const _datas = _d.data();

            if (!_datas || !_datas.sections || !Array.isArray(_datas.sections)) {
                return [];
            }

            for (const _data of _datas.sections) {
                const text = ('' + _data.text) || '';
                const slug = ('' + _data.slug) || '';
                const order = +_data.order || 0;

                sections.push({
                    text: text,
                    slug: slug,
                    order: order,
                });

                sections.sort((a, b) => {
                    return (b.order || 0) - (a.order || 0);
                });
            }

            return sections;
        });
    }

    public getBatch(): firebase.firestore.WriteBatch {
        const batch = firebase.firestore().batch();

        return batch;
    }

    public batchSetSections(batch: firebase.firestore.WriteBatch, sections: Section[]): void {
        const _sections: Section[] = [];
        
        for (let i = 0; i < sections.length; i++) {
            const section = sections[i];

            const text = ('' + section.text) || '';
            const slug = ('' + section.slug) || '';
            const order = sections.length - i;

            _sections.push({
                text: text,
                slug: slug,
                order: order,
            });
        }

        const docRef = firebase.firestore().collection('sections').doc('sections-data');

        batch.set(docRef, {
            updatedAt: Date.now(),
            sections: _sections,
        });
    }

    public batchSetFile(batch: firebase.firestore.WriteBatch, file: FileMetadata, section?: Section): void {
        const docRef = firebase.firestore().collection('files').doc(file.firestoreID);

        const firestoreID = docRef.id;

        const _file: FileMetadata = {
            url: file.url,
            filename: file.filename,
            timestamp: file.timestamp || Date.now(),
            firestoreID: firestoreID,
            order: file.order || 0,
        };

        if (section) {
            _file.sectionSlug = section.slug;
        }

        batch.set(docRef, _file);
    }

    public batchDeleteFile(batch: firebase.firestore.WriteBatch, file: FileMetadata): void {
        const docRef = firebase.firestore().collection('files').doc(file.firestoreID);

        batch.delete(docRef);
    }

    public setSections(sections: Section[]): Promise<void> {
        const _sections: Section[] = [];

        for (let i = 0; i < sections.length; i++) {
            const section = sections[i];

            const text = ('' + section.text) || '';
            const slug = ('' + section.slug) || '';
            const order = sections.length - i;

            _sections.push({
                text: text,
                slug: slug,
                order: order,
            });
        }

        const docRef = firebase.firestore().collection('sections').doc('sections-data');
        // console.log(_sections);
        return docRef.set({
            updatedAt: Date.now(),
            sections: _sections,
        });
    }
}
