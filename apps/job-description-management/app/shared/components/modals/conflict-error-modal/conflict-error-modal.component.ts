import { Component, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'pf-conflict-error-modal',
  templateUrl: './conflict-error-modal.component.html'
})
export class ConflictErrorModalComponent {
  @ViewChild('conflictErrorModal', {static: true}) public conflictErrorModal: any;
  @Input() errorMessage = 'There was an error.';
  @Input() goBackLink = '';
  @Output() onClose = new EventEmitter();
  private modalRef: NgbModalRef;

  constructor(
    private modalService: NgbModal,
    private location: Location,
    private router: Router
  ) {
  }

  open() {
    this.modalRef = this.modalService.open(this.conflictErrorModal, {backdrop: 'static'});
  }

  refresh() {
    window.location.reload();
  }

  goBack() {
    this.modalRef.close();
    this.onClose.emit();

    if (!this.goBackLink) {
      this.location.back();
    } else {
      this.router.navigate([this.goBackLink]);
    }
  }
}
