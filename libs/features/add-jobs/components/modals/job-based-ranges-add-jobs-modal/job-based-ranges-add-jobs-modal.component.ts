import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { Observable } from 'rxjs';

@Component({
  selector: 'pf-jobs-based-ranges-add-jobs-modal',
  templateUrl: './job-based-ranges-add-jobs-modal.component.html',
  styleUrls: ['./job-based-ranges-add-jobs-modal.component.scss']
})
export class JobBasedRangesAddJobsModalComponent implements OnInit {
  @Output() saved = new EventEmitter();
  @Output() closed = new EventEmitter();
  @Output() opened = new EventEmitter();

  @Input() saving = false;
  @Input() errorSaving = false;
  @Input() modalOpen$: Observable<boolean>;
  @Input() addJobsSaving: boolean;

  addJobsForm: FormGroup;
  attemptedSave = false;

  constructor(
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.buildForm();

  }

  close() {
    this.closed.emit();
  }

  save() {
    this.attemptedSave = true;
  }

  buildForm() {
    this.addJobsForm = this.formBuilder.group({});
  }
}
