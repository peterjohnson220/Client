import { Component, ViewChild, Input, Output, EventEmitter } from '@angular/core';

import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'pf-delete-control-option-modal',
    templateUrl: './delete-company-control-option-modal.component.html'
})
export class DeleteCompanyControlOptionModalComponent {
    @ViewChild('deleteControlOptionModal', { static: true }) public deleteControlOptionModal: any;

    @Input() affectedJobs: string[];

    private modalRef: NgbModalRef;

    constructor(
        private modalService: NgbModal
    ) { }

    open() {
        this.modalRef = this.modalService.open(this.deleteControlOptionModal, { backdrop: 'static' });
    }
}
