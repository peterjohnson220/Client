import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'pf-workflow-cancel-modal',
  templateUrl: './workflow-cancel-modal.component.html'
})
export class WorkflowCancelModalComponent implements OnInit {

  @ViewChild('cancelWorkflowModal', {static: true}) public cancelWorkflowModal: any;

  @Output() workflowCancelConfirmed = new EventEmitter();

  private modalRef: NgbModalRef;
  private cancelReasonForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private modalService: NgbModal
  ) { }

  open() {
    this.cancelReasonForm.reset();
    this.cancelReasonForm.setValue({ cancelReason: '' });
    this.modalRef = this.modalService.open(this.cancelWorkflowModal, { backdrop: 'static' });
  }

  confirmed() {
    if (this.cancelReasonForm.valid) {
      this.workflowCancelConfirmed.emit( this.cancelReasonForm.controls['cancelReason'].value );
      this.modalRef.close();
    }
  }

  buildForm() {
    this.cancelReasonForm = this.formBuilder.group({
      cancelReason: ['', [Validators.maxLength(255)]]
    });
  }

  ngOnInit() {
    this.buildForm();
  }
}
