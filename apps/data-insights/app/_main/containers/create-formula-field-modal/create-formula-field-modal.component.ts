import { Component, ViewChild, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { PfValidators } from 'libs/forms/validators';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'pf-create-formula-field-modal',
  templateUrl: './create-formula-field-modal.component.html',
  styleUrls: ['./create-formula-field-modal.component.scss']
})
export class CreateFormulaFieldModalComponent implements OnInit {
  @ViewChild('createFormulaFieldModal', { static: true }) public createFormulaFieldModal: any;
  saving: boolean;
  createFormulaFieldForm: FormGroup;
  fieldName: string;
  maxFieldNameLength = 500;

  constructor(
    private modalService: NgbModal,
    private formBuilder: FormBuilder
  ) {
    this.initFormData();
  }

  ngOnInit(): void {
    this.createForm();
  }

  open(): void {
    this.modalService.open(this.createFormulaFieldModal, { backdrop: 'static', centered: true, size: 'lg' });
  }

  close(): void {
    this.modalService.dismissAll();
  }

  handleSaveClicked(): void {
    this.close();
  }

  public get saveDisabled(): boolean {
    if (!this.createFormulaFieldForm) {
      return this.saving;
    }

    return this.saving || !this.createFormulaFieldForm.valid;
  }

  private initFormData(): void {
    this.fieldName = '';
    this.saving = false;
  }

  private createForm(): void {
    this.createFormulaFieldForm = this.formBuilder.group({
      fieldName: [this.fieldName, [PfValidators.required, Validators.maxLength(this.maxFieldNameLength)]]
    });
  }
}

