import { Component, OnInit, Input, ViewChild, ElementRef, Output, EventEmitter, Renderer2, OnDestroy } from '@angular/core';

// import { environment } from '@environment';

import { ResponsiveService } from '@app/services/responsive.service';

@Component({
    selector: 'moo-input',
    templateUrl: './input.template.html',
    styleUrls: ['./input.style.scss']
})
export class InputComponent implements OnInit, OnDestroy {
    @ViewChild('input', {static: true}) private _input!: ElementRef<HTMLInputElement>;
    public focused: boolean = false;

    @Input() public error?: string;
    @Input() public inputType?: 'text' | 'email' | 'password';

    @Input() public label?: string;
    @Input() public value?: string;

    @Output() public valueChanged: EventEmitter<string> = new EventEmitter();
    @Output() public focus: EventEmitter<InputComponent> = new EventEmitter();
    @Output() public blur: EventEmitter<InputComponent> = new EventEmitter();

    @Output() public enterPressed: EventEmitter<KeyboardEvent> = new EventEmitter();

    private _detachListeners?: () => void;

    constructor(private responsiveService: ResponsiveService, private renderer: Renderer2) {
    }

    public ngOnInit(): void {
        // source: https://www.w3schools.com/howto/howto_js_trigger_button_enter.asp
        this._detachListeners = this.renderer.listen(this._input.nativeElement, "keyup", (event: KeyboardEvent) => {
            // Number 13 is the "Enter" key on the keyboard
            if (event.key == 'Enter' || event.keyCode == 13 || event.which == 13) {
                // Cancel the default action, if needed
                event.preventDefault();
                event.stopPropagation();

                const responsiveData = this.responsiveService.getResponsiveType();

                // source: https://stackoverflow.com/questions/11381673/detecting-a-mobile-browser
                const touchDevice = ('ontouchstart' in document.documentElement);

                if (touchDevice && (responsiveData.deviceType === 'tablet' || responsiveData.deviceType === 'mobile')) {
                    this.blurInput();
                } else {
                    this.enterPressed.emit(event);
                }
            }
        });
    }


    public focusInput(): void {
        this._input.nativeElement.focus();
    }

    public blurInput(): void {
        this._input.nativeElement.blur();
    }

    public handleFocus(): void {
        this.focused = true;
        this.focus.emit(this);

        // const responsiveData = this.responsiveService.getResponsiveType();

        // source: https://stackoverflow.com/questions/11381673/detecting-a-mobile-browser
        const touchDevice = ('ontouchstart' in document.documentElement);

        if (touchDevice) {
            document.body.classList.add('touch-device');
        }

        // if (responsiveData.deviceType === 'mobile' || responsiveData.deviceType === 'tablet') {
            document.body.classList.add('input-is-focused');
        // }
    }

    public handleBlur(): void {
        this.focused = false;
        this.blur.emit(this);

        // const responsiveData = this.responsiveService.getResponsiveType();

        // if (responsiveData.deviceType === 'mobile' || responsiveData.deviceType === 'tablet') {
            document.body.classList.remove('input-is-focused');
        // }

        const responsiveData = this.responsiveService.getResponsiveType();

        setTimeout(() => {
            if (responsiveData.orientation === 'portrait' && (responsiveData.deviceType === 'tablet' || responsiveData.deviceType === 'mobile')) {
                if (!document.body.classList.contains('input-is-focused')) {
                    // this.modalService.openMobileModal();
                    // TODO: is this needed?
                }
            }
        }, 0);
    }

    public handleInput(inputEvent: Event): void {
        if (!inputEvent || !inputEvent.target) {
            this.valueChanged.emit("");
            return;
        }

        // We have to cast since EventTarget.value isn't a property but it will likely be when this event is coming from HTMLInputElement
        const _target = inputEvent.target as HTMLInputElement;

        this.valueChanged.emit(_target.value || '');
    }

    public ngOnDestroy(): void {
        this._detachListeners && this._detachListeners();
    }
}
