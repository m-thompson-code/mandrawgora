import { Injectable } from '@angular/core';
import { FirestoreService, Section } from './firestore.service';

// import { environment } from '@environment';

@Injectable({
    providedIn: 'root',
})
export class HomeService {
    sections: Section[] = [];
    constructor(private firestoreService: FirestoreService) {
    }

    public getSections(): Promise<Section[]> {
        return this.firestoreService.getSections().then(sections => {
            this.sections = sections;
            return sections;
        });
    }
}
