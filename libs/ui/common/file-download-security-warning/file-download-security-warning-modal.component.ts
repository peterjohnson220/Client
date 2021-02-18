import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'pf-file-download-security-warning-modal',
  templateUrl: './file-download-security-warning-modal.component.html',
  styleUrls: [ './file-download-security-warning-modal.component.scss' ]
})
export class FileDownloadSecurityWarningModalComponent {
  @ViewChild('fileDownloadSecurityWarningModal', { static: true }) public fileDownloadSecurityWarningModal: any;
  @Output() securityWarningConfirmed = new EventEmitter<boolean>();
  @Output() securityWarningCancelled = new EventEmitter<boolean>();

  modalRef: NgbModalRef;

  constructor(private modalService: NgbModal) { }

  open() {
    this.modalRef = this.modalService.open(this.fileDownloadSecurityWarningModal, { backdrop: 'static' });
  }

  handleSecurityWarningConfirmed(): void {
    this.securityWarningConfirmed.emit(true);
    this.modalRef.close();
  }

  handleSecurityWarningCancelled(): void {
    this.securityWarningCancelled.emit();
    this.modalRef.close();
  }
}
