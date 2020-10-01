import { Component, OnInit, Input, OnDestroy, OnChanges, SimpleChanges, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';

import { Subscription } from 'rxjs';

import { Permissions } from 'libs/constants';
import { JobDescriptionSummary } from 'libs/models';
import { PfValidators } from '../../validators';

@Component({
  selector: 'pf-job-description-summary-editor',
  templateUrl: './job-description-summary-editor.component.html',
  styleUrls: ['./job-description-summary-editor.component.scss']
})
export class JobDescriptionSummaryEditorComponent implements OnInit, OnDestroy, OnChanges {

  @Input() title = 'Job Description';
  @Input() actionIconSize = 'lg';
  @Input() errorMessageClass = 'invalid-feedback';
  @Input() layout: 'card' | 'simple' = 'simple';
  @Input() rows = 9;
  @Input() jobDescriptionSummary: JobDescriptionSummary;
  @Input() isJdmEnabled = true;

  @Output() jobDescriptionChanged: EventEmitter<string> = new EventEmitter<string>();

  @ViewChild('jobDescriptionTextArea') jobDescriptionTextArea: ElementRef;

  readonly JOB_SUMMARY_MIN_LENGTH = 10;

  jobDescriptionForm: FormGroup;

  formChangesSubscription: Subscription;

  permissions = Permissions;

  // convenience getter for easy access to form fields
  get f() { return this.jobDescriptionForm.controls; }

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.jobDescriptionForm = this.formBuilder.group({
      JobDescription: ['', [PfValidators.minLengthNotRequired(this.JOB_SUMMARY_MIN_LENGTH)]],
    });

    this.formChangesSubscription = this.jobDescriptionForm.get('JobDescription').valueChanges.subscribe(value => {
      this.jobDescriptionChanged.emit(value);
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['jobDescriptionSummary'] && this.jobDescriptionForm) {
      this.jobDescriptionForm.reset();
      if (changes['jobDescriptionSummary'].currentValue) {
        this.jobDescriptionForm.patchValue({ JobDescription: changes['jobDescriptionSummary'].currentValue.JobSummary });
      }
    }
  }

  ngOnDestroy() {
    this.formChangesSubscription.unsubscribe();
  }

  exportJobDescription(docType: string) {
    const htmlDocument: any = document;

    htmlDocument.exportForm.elements['export-uid'].value = Date.now();
    htmlDocument.exportForm.elements['export-type'].value = docType;
    htmlDocument.exportForm.submit();
  }

  isValid(): boolean {
    return this.jobDescriptionForm.valid;
  }

  reset() {
    this.jobDescriptionForm.patchValue({ JobDescription: '' });
  }

}
