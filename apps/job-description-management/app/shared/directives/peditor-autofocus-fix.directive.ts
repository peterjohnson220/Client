import { Directive, Input, OnChanges, SimpleChange, ElementRef } from '@angular/core';

@Directive({
    selector: '[pfEditorModel]'
})
// This is a hack to prevent the issue in p-editor where it gains focus while initializing model data
// https://github.com/primefaces/primeng/issues/5244
// https://github.com/zenoamaro/react-quill/issues/317

export class PeditorAutoFocusFixDirective implements OnChanges {
    @Input('pfEditorModel') content: string;

    ngOnChanges(changes: { [property: string]: SimpleChange }) {
        const change = changes['content'];

        if (change.isFirstChange()) {
            this.element.nativeElement.style.display = 'none';
            setTimeout(() => {
                this.element.nativeElement.style.display = '';
            });
        }
    }

    constructor(private element: ElementRef) {
    }
}
