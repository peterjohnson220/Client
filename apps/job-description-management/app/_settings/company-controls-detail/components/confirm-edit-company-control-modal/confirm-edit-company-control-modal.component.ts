import { Component, ViewChild, Input, Output, EventEmitter } from '@angular/core';

import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'pf-confirm-edit-company-control-modal',
    templateUrl: './confirm-edit-company-control-modal.component.html',
    styleUrls: ['./confirm-edit-company-control-modal.component.scss']
})
export class ConfirmEditCompanyControlModalComponent {
    @ViewChild('confirmEditCompanyControlModal', { static: true }) public confirmEditCompanyControlModal: any;

    @Input() controlName: string;
    @Input() affectedJobs: number;
    @Input() affectedTemplateNames: string[];
    @Output() editCompanyControlConfirmed = new EventEmitter();

    private modalRef: NgbModalRef;

    constructor(
        private modalService: NgbModal
    ) { }

    open() {
        this.modalRef = this.modalService.open(this.confirmEditCompanyControlModal, { backdrop: 'static' });
    }

    editConfirmed() {
        this.editCompanyControlConfirmed.emit(true);
        this.modalRef.close();
    }
}
