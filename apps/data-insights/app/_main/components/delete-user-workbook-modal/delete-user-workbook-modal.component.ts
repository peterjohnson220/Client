import { Component, ViewChild, EventEmitter, Output } from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'pf-delete-user-workbook-modal',
  templateUrl: './delete-user-workbook-modal.component.html'
})
export class DeleteUserWorkbookModalComponent {
  @Output() deleteClicked = new EventEmitter();

  @ViewChild('deleteUserWorkbookModal', { static: true }) public deleteUserWorkbookModal: any;

  constructor(
    private modalService: NgbModal
  ) {}

  open(): void {
    this.modalService.open(this.deleteUserWorkbookModal, {backdrop: 'static', centered: true});
  }

  close(): void {
    this.modalService.dismissAll();
  }

  delete(): void {
    this.deleteClicked.emit();
    this.modalService.dismissAll();
  }

}
