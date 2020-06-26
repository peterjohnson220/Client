import { Component, ViewChild, Input, Output, EventEmitter } from '@angular/core';

import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { TemplateControl } from 'libs/models';

@Component({
    selector: 'pf-confirm-control-delete-modal',
    templateUrl: './confirm-control-delete-modal.component.html'
})
export class ConfirmControlDeleteModalComponent {
    @ViewChild('confirmControlDeleteModal', {static: true}) public confirmControlDeleteModal: any;
    @Input() templateControl: TemplateControl;
    @Output() deleteControlConfirmed = new EventEmitter();

    private modalRef: NgbModalRef;

    constructor(
        private modalService: NgbModal
    ) { }

    open() {
        this.modalRef = this.modalService.open(this.confirmControlDeleteModal, { backdrop: 'static' });
    }

    deleteConfirmed() {
        this.deleteControlConfirmed.emit(this.templateControl);
        this.modalRef.close();
    }
}
