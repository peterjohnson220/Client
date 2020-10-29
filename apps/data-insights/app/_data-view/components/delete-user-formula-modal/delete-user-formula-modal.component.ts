import { Component, ViewChild, EventEmitter, Output, Input } from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { Field } from 'libs/features/formula-editor';

@Component({
  selector: 'pf-delete-user-formula-modal',
  templateUrl: './delete-user-formula-modal.component.html'
})
export class DeleteUserFormulaModalComponent {
  @Input() viewCount: number;
  @Input() field: Field;
  @Input() loading: boolean;
  @Output() deleteClicked = new EventEmitter<Field>();

  @ViewChild('deleteUserFormulaModal', { static: true }) public deleteUserFormulaModal: any;

  constructor(
    private modalService: NgbModal
  ) {}

  open(): void {
    this.modalService.open(this.deleteUserFormulaModal, {backdrop: 'static', centered: true});
  }

  close(): void {
    this.modalService.dismissAll();
  }

  delete(): void {
    this.deleteClicked.emit(this.field);
    this.modalService.dismissAll();
  }

}
