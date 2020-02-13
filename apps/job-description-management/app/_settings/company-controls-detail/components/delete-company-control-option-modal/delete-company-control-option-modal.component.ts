import { Component, ViewChild } from '@angular/core';

import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'pf-delete-control-option-modal',
    templateUrl: './delete-company-control-option-modal.component.html'
})
export class DeleteCompanyControlOptionModalComponent {
    @ViewChild('deleteControlOptionModal', { static: true }) public deleteControlOptionModal: any;

    public affectedJobs: string[];

    private modalRef: NgbModalRef;

    constructor(
        private modalService: NgbModal
    ) { }

    open(affectedJobs: string[]) {
        this.modalRef = this.modalService.open(this.deleteControlOptionModal, { backdrop: 'static' });
        this.affectedJobs = affectedJobs;
    }
}
