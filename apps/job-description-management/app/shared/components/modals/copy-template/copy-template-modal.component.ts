import { Component, ViewChild, Output, OnInit, EventEmitter } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { JobDescriptionTemplateApiService } from 'libs/data/payfactors-api/jdm/index';

@Component({
  selector: 'pf-copy-template-modal',
  templateUrl: './copy-template-modal.component.html'
})

export class CopyTemplateModalComponent implements OnInit {
  @ViewChild('copyTemplateModal', { static: true }) public copyTemplateModal: any;
  @Output() copyTemplateComplete = new EventEmitter();

  modalRef: NgbModalRef;
  templateNameForm: FormGroup;
  submitted = false;
  modalContext: any;
  invalidTemplateName = false;
  templateName = '';

  constructor(
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private jobDescriptionTemplateApiService: JobDescriptionTemplateApiService
  ) { }

  open(context: any) {
    this.submitted = false;
    this.templateNameForm.reset();
    this.templateName = '';
    this.invalidTemplateName = false;
    this.modalRef = this.modalService.open(this.copyTemplateModal, { backdrop: 'static' });
    this.modalContext = context;
  }

  submit() {

    this.submitted = true;

    if (this.templateNameForm.valid) {
      this.jobDescriptionTemplateApiService.exists(this.templateName).subscribe((exists: boolean) => {
        this.invalidTemplateName = exists;
        if (!this.invalidTemplateName) {
          this.copyTemplateComplete.emit({ context: this.modalContext, templateName: this.templateName });
          this.modalRef.close();
        }
      });
    }

  }

  handleValueChanged(newValue: string) {
    if (newValue !== this.templateName) {
      this.invalidTemplateName = false;
    }
  }

  buildForm() {
    this.templateNameForm = this.formBuilder.group({
      templateName: ['', [Validators.required, Validators.maxLength(50), Validators.minLength(1)]]
    });
  }

  ngOnInit() {
    this.buildForm();
  }
}
