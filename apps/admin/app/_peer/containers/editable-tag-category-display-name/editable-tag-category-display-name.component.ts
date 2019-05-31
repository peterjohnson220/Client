import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';

import { Observable, Subscription } from 'rxjs';

import { PfValidators } from 'libs/forms/validators';

@Component({
  selector: 'pf-editable-tag-category-display-name',
  templateUrl: './editable-tag-category-display-name.component.html',
  styleUrls: ['./editable-tag-category-display-name.component.scss']
})
// TODO: WRITE UNIT TESTS
export class EditableTagCategoryDisplayNameComponent implements OnInit, OnDestroy {
  @Input() value: string;
  @Input() saving$: Observable<boolean>;
  @Input() errorSaving$: Observable<boolean>;
  @Output() onSave = new EventEmitter();

  savingSubscription: Subscription;
  editDisplayNameForm: FormGroup;
  isEditing: boolean;
  isSaving: boolean;

  constructor(private fb: FormBuilder) {
    this.createForm();
  }

  get tempValueControl() { return this.editDisplayNameForm.get('tempValue'); }

  get isDirty(): boolean { return this.value !== this.tempValueControl.value; }

  get buttonsEnabled(): boolean {
    return this.isDirty && !this.isSaving && this.tempValueControl.valid;
  }

  createForm(): void {
    this.editDisplayNameForm = this.fb.group({
      'tempValue': [this.value, [PfValidators.required, PfValidators.minLengthTrimWhitespace(3)]]
    });
  }

  save(): void {
    if (!this.buttonsEnabled) {
      return;
    }

    this.onSave.emit(this.tempValueControl.value);
  }

  cancel(): void {
    if (this.isSaving) {
      return;
    }

    this.reset();
  }

  reset(): void {
    this.isEditing = false;
    this.tempValueControl.setValue(this.value);
  }

  toggleEdit(): void {
    this.isEditing = true;
    this.tempValueControl.setValue(this.value);
  }

  // Events
  ngOnInit(): void {
    this.savingSubscription = this.saving$.subscribe(saving => {
      this.isSaving = saving;
      if (!saving && this.isEditing) {
        this.reset();
      }
    });
  }

  ngOnDestroy(): void {
    this.savingSubscription.unsubscribe();
  }
}
