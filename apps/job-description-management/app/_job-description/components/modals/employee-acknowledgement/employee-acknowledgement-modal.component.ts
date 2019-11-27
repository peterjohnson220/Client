import { Component, ViewChild, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { CustomValidators } from '../../../../shared/validators/custom-validators.validator';

@Component({
  selector: 'pf-employee-acknowledgement-modal',
  templateUrl: './employee-acknowledgement-modal.component.html',
  styleUrls: ['./employee-acknowledgement-modal.component.scss']
})
export class EmployeeAcknowledgementModalComponent implements OnInit {
  @ViewChild('employeeAcknowledgementModal', {static: true}) public employeeAcknowledgementModal: any;
  @Output() acknowledged = new EventEmitter();
  @Input() acknowledging: boolean;

  modalRef: NgbModalRef;
  signatureForm: FormGroup;
  attemptedAcknowledge: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private modalService: NgbModal
  ) { }

  open() {
    this.attemptedAcknowledge = false;
    this.signatureForm.reset();
    this.signatureForm.setValue({ signature: '' });
    this.modalRef = this.modalService.open(this.employeeAcknowledgementModal, { backdrop: 'static' });
  }

  close() {
    this.modalRef.close();
  }
  acknowledge() {
    this.attemptedAcknowledge = true;
    if (this.signatureForm.valid) {
      this.acknowledged.emit(this.signatureForm.controls['signature'].value);
    }
  }

  buildForm() {
    this.signatureForm = this.formBuilder.group({
      signature: ['', [CustomValidators.required, Validators.maxLength(100)]]
    });
  }

  ngOnInit() {
    this.buildForm();
  }
}
