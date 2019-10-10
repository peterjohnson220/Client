import { Component, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'pf-save-error-modal',
  templateUrl: './save-error-modal.component.html'
})
export class SaveErrorModalComponent {
  @ViewChild('saveErrorModal', {static: true}) public saveErrorModal: any;
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
    this.modalRef = this.modalService.open(this.saveErrorModal, {backdrop: 'static'});
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
