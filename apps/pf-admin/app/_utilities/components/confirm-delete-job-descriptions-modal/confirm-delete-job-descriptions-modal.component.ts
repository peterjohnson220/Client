import { Component, ViewChild, Input, Output, EventEmitter } from '@angular/core';

import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { TemplateListItem } from 'libs/models/jdm';

@Component({
    selector: 'pf-confirm-delete-job-descriptions-modal',
    templateUrl: './confirm-delete-job-descriptions-modal.component.html'
})
export class ConfirmDeleteJobDescriptionsModalComponent {
    @ViewChild('confirmDeleteJobDescriptionsModalComponent') public confirmDeleteJobDescriptionsModalComponent: any;

    @Input() deleting: boolean;
    @Input() error = false;
    @Output() deleteConfirmed = new EventEmitter();
    @Output() closed = new EventEmitter();

    private modalRef: NgbModalRef;
    private templateListItem: TemplateListItem;
    private templateNameConfirmValue: string;

    constructor(
        private modalService: NgbModal
    ) { }

    open(templateListItem: TemplateListItem) {
        this.templateListItem = templateListItem;
        this.modalRef = this.modalService.open(this.confirmDeleteJobDescriptionsModalComponent, { backdrop: 'static' });
    }

    close() {
        this.templateNameConfirmValue = '';
        this.closed.emit();
        this.modalRef.close();
    }

    confirmDelete() {
        this.deleteConfirmed.emit(this.templateListItem.TemplateId);
    }
}
