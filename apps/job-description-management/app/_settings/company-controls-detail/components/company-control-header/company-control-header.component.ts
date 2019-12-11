import { Component, Input, OnChanges, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

import { ControlType } from 'libs/models';

@Component({
  selector: 'pf-company-control-header',
  templateUrl: './company-control-header.component.html',
  styleUrls: ['./company-control-header.component.scss']
})
export class CompanyControlHeaderComponent implements OnChanges {

    @Input() controlType: ControlType;
    @Input() readOnly: boolean;
    @Input() editable: boolean;
    @Input() errorMessage: string;

    @Output() editorTypeChanged = new EventEmitter();
    @Output() canEditTemplateDataChanged = new EventEmitter();

    public companyControlHeaderForm: FormGroup;
    public canEditTemplateData = false;
    public submitted = false;

    colors: Array<{ text: string, value: string }> = [
      { text: 'AntiqueWhite', value: '#FAEBD7' },
      { text: 'Black', value: '#000000' },
      { text: 'Blue', value: '#0000FF' },
      { text: 'Cyan', value: '#00FFFF' },
      { text: 'Fuchsia', value: '#FF00FF' },
      { text: 'Gray', value: '#808080' },
      { text: 'Green', value: '#008000' },
      { text: 'Lime', value: '#00FF00' },
      { text: 'Navy', value: '#000080' },
      { text: 'Yellow', value: '#FFFF00' },
      { text: 'Red', value: '#FF0000' },
      { text: 'Purple', value: '#800080' }
  ];

  editorTypes: Array<{ text: string, value: string }> = [
      { text: 'Single', value: 'Single' },
      { text: 'List', value: 'List' },
      { text: 'Smart List', value: 'SmartList' }
  ];

  get name() { return this.companyControlHeaderForm.controls['Name']; }
  get type() { return this.companyControlHeaderForm.controls['Type']; }
  get color() { return this.companyControlHeaderForm.controls['Color']; }
  get readonly() { return this.companyControlHeaderForm.controls['ReadOnly']; }
  get editorType() { return this.companyControlHeaderForm.controls['EditorType']; }
  get vertical() { return this.companyControlHeaderForm.controls['Vertical']; }
  get locked() { return this.companyControlHeaderForm.controls['Locked']; }
  get controlVersion() { return this.companyControlHeaderForm.controls['ControlVersion']; }
  get isLatest() { return this.companyControlHeaderForm.controls['IsLatest']; }
  get formValue() { return this.companyControlHeaderForm.getRawValue(); }
  get headerForm() { return this.companyControlHeaderForm; }

  // "When a form has the status "disabled", it is considered exempt from all validation checks.
  // It cannot be both valid and disabled at the same time, so form.valid will always be false if the form is disabled."
  // https://github.com/angular/angular/issues/18678
  get isValid() { return !this.companyControlHeaderForm.invalid; }

  constructor(private formBuilder: FormBuilder) {
        this.buildForm();
  }

  ngOnChanges(changes) {
      if (changes.readOnly && changes.readOnly.currentValue) {
          this.companyControlHeaderForm.disable();
      }
      if (changes.controlType && changes.controlType.currentValue) {
          const value =  changes.controlType.currentValue;
          if (value) {
              this.companyControlHeaderForm.patchValue({
                  Name: value.Name,
                  Type: value.Type,
                  Color: value.Color,
                  ReadOnly: value.ReadOnly,
                  EditorType: value.EditorType,
                  Vertical: value.Vertical,
                  Locked: value.Locked,
                  ControlVersion: value.ControlVersion,
                  IsLatest: value.IsLatest
              }, {emitEvent: false});

              if (this.readOnly) {
                  this.companyControlHeaderForm.disable();
              }
          }
      }
      if (changes.editable) {
          if (changes.editable.currentValue === false) {
              this.companyControlHeaderForm.disable();
          }
      }
  }

  buildForm() {
      this.companyControlHeaderForm = this.formBuilder.group({
              'Name': new FormControl('', [Validators.required,
                          Validators.maxLength(100),
                          Validators.minLength(1)]),
              'Type': new FormControl(''),
              'Color': new FormControl('', Validators.required),
              'ReadOnly':  new FormControl(false),
              'EditorType': new FormControl('', Validators.required),
              'Vertical': new FormControl(false),
              'Locked': new FormControl(false),
              'ControlVersion': new FormControl(1),
              'IsLatest': new FormControl(true),
        });
  }

  handleEditorTypeChange(editorType: string) {
    if (editorType === 'Single') {
        this.vertical.enable();
    } else {
        this.vertical.reset();
    }

    if (editorType === 'List') {
        this.locked.enable();
    } else {
        this.locked.reset();
    }
    this.editorTypeChanged.emit(editorType);
  }

  handleReadOnly() {
      this.canEditTemplateData = !this.canEditTemplateData;
      this.canEditTemplateDataChanged.emit(this.canEditTemplateData);
  }

  markFormGroupTouched(formGroup: FormGroup) {
      (<any>Object).values(formGroup.controls).forEach(control => {
          control.markAsTouched();

          if (control.controls) {
              control.controls.forEach(c => this.markFormGroupTouched(c));
          }
      });
  }

}
