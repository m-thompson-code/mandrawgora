import { Component, OnInit, Input, ViewChild, ElementRef, OnDestroy, Output, EventEmitter, NgZone, AfterViewInit } from '@angular/core';

// import { environment } from '@environment';

export interface UploadFile {
    file: File;
    filename: string;
}

@Component({
    selector: 'moo-uploader',
    templateUrl: './uploader.template.html',
    styleUrls: ['./uploader.style.scss']
})
export class UploaderComponent {
    @ViewChild('input', {static: true}) private _input!: ElementRef<HTMLInputElement>;

    public dragover?: boolean;

    @Output() public filesUploaded: EventEmitter<UploadFile[]> = new EventEmitter();

    constructor(private ngZone: NgZone) {

    }
    
    public handleFileInputChange(event: any): void {
        const _t = event?.target as HTMLInputElement;

        if (!_t || !_t.files || !_t.files.length) {
            console.error("Unexpected missing files from event");
            return;
        }

        const files = _t.files;

        this._handleFileList(files);
    }

    public handleFileInputDrop(event: any): void {
        event?.stopPropagation();
        event?.preventDefault();

        const _d = event?.dataTransfer as DataTransfer;

        if (!_d || !_d.files || !_d.files.length) {
            console.error("Unexpected missing files from event");
            return;
        }
        
        const files = _d.files;

        this._handleFileList(files);

        this.dragover = false;
    }

    public handleDragover(event: any): void {
        event?.stopPropagation();
        event?.preventDefault();

        if (!event || !event.dataTransfer) {
            return;
        }
        
        // Style the drag-and-drop as a "copy file" operation.
        event.dataTransfer.dropEffect = 'copy';

        this.dragover = true;
    }
    
    public handleDragend(event: any): void {
        event?.stopPropagation();
        event?.preventDefault();

        this.dragover = false;
    }

    private _handleFileList(fileList: FileList): void {
        if (!fileList) {
            console.error("Unexpected missing files from Filelist");
            return;
        }

        const uploadFiles: UploadFile[] = [];

        for (let i = 0; i < fileList.length; i++) {
            const file = fileList[i];

            const filename = (file.name || '').toLowerCase();

            const _file: UploadFile = {
                file: file,
                filename: filename,
                // previewSrc: null,
            };

            uploadFiles.push(_file);
        }

        this.filesUploaded.emit(uploadFiles);

        // Clear input value to allow for same file upload
        this._input.nativeElement.value = '';
    }
}
