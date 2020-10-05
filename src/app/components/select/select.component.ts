import { Component, OnInit, Input, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';

// import { environment } from '@environment';

import { ResponsiveService } from '@app/services/responsive.service';

@Component({
    selector: 'moo-select',
    templateUrl: './select.template.html',
    styleUrls: ['./select.style.scss']
})
export class SelectComponent<T extends {text: string}> {
    @Input() public error?: string;
    @Input() public label?: string;
    @Input() public value?: T;
    @Input() public options?: T[];

    @Output() public valueChanged: EventEmitter<T> = new EventEmitter();

    constructor(private responsiveService: ResponsiveService) {
    }

    public handleSelectionChange(event: MatSelectChange): void {
        this.valueChanged.emit(event.value);
    }
}
