import { Component, ViewChild, Input, Output, EventEmitter } from '@angular/core';

import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { TemplateSection } from 'libs/models';

@Component({
    selector: 'pf-confirm-section-delete-modal',
    templateUrl: './confirm-section-delete-modal.component.html'
})
export class ConfirmSectionDeleteModalComponent {
    @ViewChild('confirmSectionDeleteModal', {static: true}) public confirmSectionDeleteModal: any;

    @Input() templateSection: TemplateSection;
    @Output() deleteSectionConfirmed = new EventEmitter();

    private modalRef: NgbModalRef;

    constructor(
        private modalService: NgbModal
    ) { }

    open() {
        this.modalRef = this.modalService.open(this.confirmSectionDeleteModal, { backdrop: 'static' });
    }

    deleteConfirmed() {
        this.deleteSectionConfirmed.emit(this.templateSection);
        this.modalRef.close();
    }
}
