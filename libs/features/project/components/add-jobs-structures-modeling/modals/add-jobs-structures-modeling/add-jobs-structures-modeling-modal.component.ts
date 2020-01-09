import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PfValidators } from 'libs/forms/validators';

@Component({
  selector: 'pf-add-jobs-structures-modeling-modal',
  templateUrl: './add-jobs-structures-modeling-modal.component.html',
  styleUrls: ['./add-jobs-structures-modeling-modal.component.scss']
})
export class AddJobsStructuresModelingModalComponent implements OnInit {
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
