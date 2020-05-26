import { Component, OnInit, OnChanges, Input, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { JobDescriptionTemplateApiService } from 'libs/data/payfactors-api';

import { TemplateNameIsInUse } from '../../validators';

@Component({
  selector: 'pf-template-inline',
  templateUrl: './template-inline.component.html',
  styleUrls: ['./template-inline.component.scss']
})
export class TemplateInlineComponent implements OnInit, OnChanges {

  public editing = false;
  public inlineEditForm: FormGroup;
  public value: string;
  public hoveringEditLink: boolean;
  private preValue = '';

  @Input() inputValue: string;
  @Output() onSave = new EventEmitter();

  get inlineEditControl() { return this.inlineEditForm.controls['inlineEditControl']; }

  constructor(
      private formBuilder: FormBuilder,
      private jobDescriptionTemplateApiService: JobDescriptionTemplateApiService
  ) {}

  edit(value) {
      this.preValue = value;
      this.editing = true;
  }

  onSubmit(value) {
      this.onSave.emit(value);
      this.editing = false;
  }

  cancel(value: any) {
      this.value = this.preValue;
      this.editing = false;
  }

  close() {
      if (this.editing) {
          this.value = this.preValue;
          this.editing = false;
      }
  }

  buildForm() {
      this.inlineEditForm = this.formBuilder.group({
          inlineEditControl: ['', [
              Validators.required,
              Validators.maxLength(50), Validators.minLength(1)
              ],
              TemplateNameIsInUse(this.jobDescriptionTemplateApiService, this.inputValue)
         ]
      });
  }

  ngOnInit() {
      this.value = this.inputValue;
      this.buildForm();

  }

  ngOnChanges(changes: any): void {
    const inputValueChange: string = changes.inputValue.currentValue;
    if (inputValueChange) {
          this.value = this.inputValue;
          this.editing = false;
    }
  }

}
