import { Component, ViewChild, Output, OnInit, EventEmitter } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { JobDescriptionTemplateApiService } from 'libs/data/payfactors-api/jdm';

@Component({
  selector: 'pf-new-template-modal',
  templateUrl: './new-template-modal.component.html'
})

export class NewTemplateModalComponent implements OnInit {
  @ViewChild('newTemplateModal', { static: true }) public newTemplateModal: any;
  @Output() createTemplateComplete = new EventEmitter();

  templateNameForm: FormGroup;
  modalRef: NgbModalRef;
  submitted = false;
  invalidTemplateName = false;
  templateName = '';

  constructor(
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private jobDescriptionTemplateApiService: JobDescriptionTemplateApiService
  ) { }

  open() {
    this.submitted = false;
    this.templateNameForm.reset();
    this.templateName = '';
    this.invalidTemplateName = false;
    this.modalRef = this.modalService.open(this.newTemplateModal, { backdrop: 'static' });
  }

  submit() {
    this.submitted = true;

    if (this.templateNameForm.valid) {
      this.jobDescriptionTemplateApiService.exists(this.templateName).subscribe((exists: boolean) => {
        this.invalidTemplateName = exists;

        if (!this.invalidTemplateName) {
          this.createTemplateComplete.emit(this.templateName);
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
