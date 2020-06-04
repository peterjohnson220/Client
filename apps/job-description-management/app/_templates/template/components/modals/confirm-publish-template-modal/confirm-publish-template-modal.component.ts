import { Component, ViewChild, Input, Output, EventEmitter } from '@angular/core';

import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'pf-confirm-publish-template-modal',
    templateUrl: './confirm-publish-template-modal.component.html'
})
export class ConfirmPublishTemplateModalComponent {

    @ViewChild('confirmPublishTemplateModal', {static: true}) public confirmPublishTemplateModal: any;

    @Input() templateName: string;
    @Input() templateAssignmentSummary: any;
    @Output() publishTemplateConfirmed = new EventEmitter();

    private modalRef: NgbModalRef;

    constructor(
        private modalService: NgbModal
    ) { }

    open() {
        this.modalRef = this.modalService.open(this.confirmPublishTemplateModal, { backdrop: 'static' });
    }

    close() {
      this.modalRef.close();
    }

    publishConfirmed() {
        this.publishTemplateConfirmed.emit(true);
        this.modalRef.close();
    }
}
