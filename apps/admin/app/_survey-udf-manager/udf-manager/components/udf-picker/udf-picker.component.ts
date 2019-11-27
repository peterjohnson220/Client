import { Component, Input, SimpleChanges, OnChanges, Output, EventEmitter, HostListener } from '@angular/core';
import { FormArray, FormBuilder, Validators } from '@angular/forms';

import { PayElement, UdfSetting,  } from 'libs/models/payfactors-api/survey/response/udf-data-response.model';
import { UdfSettingsRequestModel } from 'libs/models/payfactors-api/survey/request/udf-settings-request.model';
import { CompanyBaseInformation } from 'libs/models/company';

@Component({
  selector: 'pf-udf-picker',
  templateUrl: './udf-picker.component.html',
  styleUrls: ['./udf-picker.component.scss']
})
export class UdfPickerComponent implements OnChanges {

  @Input() savedUdfSettings: UdfSetting[];
  @Input() payElements: PayElement[];
  @Input() selectedCompany: CompanyBaseInformation;
  @Input() isLoading: boolean;
  @Input() isLoadingError: boolean;
  @Input() maxUdfs: number;
  @Input() savingUdfsError: boolean;
  @Input() savingUdfsErrorMessage: string;

  @Output() onSave = new EventEmitter<UdfSettingsRequestModel[]>();

  udfForm = this.fb.group({
    udfs: this.fb.array([])
  });

  constructor(public fb: FormBuilder) { }

  get udfs(): FormArray {
    return this.udfForm.get('udfs') as FormArray;
  }

  addUdf(): void {
    if (this.udfs.length < this.maxUdfs) {
      this.udfs.push(
        this.fb.group({
          Value: ['', Validators.required],
          PayElementId: ['', Validators.required],
          SurveyUdf: ['', Validators.required]
        })
      );
    }
  }

  removeUdf(i) {
    this.udfs.removeAt(i);
  }

  onSubmit() {
    this.onSave.emit(this.udfs.value);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.savedUdfSettings) {
      this.udfs.clear();
      if (this.savedUdfSettings.length > 0) {
        this.appendUdfs();
      } else {
        this.addUdf();
      }
    }
  }

  appendUdfs(): void {
    for (const savedUdf of this.savedUdfSettings) {
      this.udfs.push(
        this.fb.group({
          Value: [ { value: savedUdf.Value, disabled: true }, Validators.required ],
          PayElementId: [ { value: savedUdf.PayElementId, disabled: true }, Validators.required ],
          SurveyUdf: [ { value: savedUdf.SurveyUdf, disabled: true }, Validators.required ]
        })
      );
    }
  }

  setSurveyUdfValue(index: number): void {
    this.udfs.controls[index].get('SurveyUdf').setValue('UDF_' + (index + 1));
  }

  @HostListener('window:beforeunload', ['$event'])
  beforeUnloadHandler() {
    // check if we have any enabled controls that also have a pay element or value defined
    return !this.udfs.controls.some(c => !c.disabled && (c.value.PayElementId || c.value.Value));
  }
}
