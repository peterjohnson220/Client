import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { select, Store } from '@ngrx/store';

import { PfValidators } from 'libs/forms';

import * as fromSharedStructuresReducer from '../../reducers';
import { AbstractModelSettingsModalComponent } from '../model-settings-modal';
import { JobBasedModelSettingsContentComponent } from './job-based-model-settings-content';

@Component({
  selector: 'pf-job-based-model-settings-modal',
  templateUrl: './job-based-model-settings-modal.component.html'
})
export class JobBasedModelSettingsModalComponent extends AbstractModelSettingsModalComponent implements OnInit, OnDestroy {
  @ViewChild(JobBasedModelSettingsContentComponent, { static: false }) protected modelContentComponent: JobBasedModelSettingsContentComponent;

  constructor(
    public sharedStore: Store<fromSharedStructuresReducer.State>,
    protected formBuilder: FormBuilder
  ) {
    super(sharedStore);
    this.modalOpen$ = this.sharedStore.pipe(select(fromSharedStructuresReducer.getJobModelSettingsModalOpen));
    this.buildForm();
  }

  ngOnInit(): void {
    super.ngOnInit();
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
  }

  protected buildForm() {
    this.modelSettingsForm = new FormGroup({
      'StructureName': new FormControl(null, [Validators.required, Validators.maxLength(50)]),
      'ModelName': new FormControl(null, [PfValidators.required, PfValidators.maxLengthTrimWhitespace(50)]),
      'PayMarket': new FormControl(null, [Validators.required]),
      'Rate': new FormControl(null, [Validators.required]),
      'Currency': new FormControl(null, [Validators.required]),
      'RangeDistributionSetting': new FormControl(),
      'RangeAdvancedSetting': new FormControl()
    });
  }

  protected updateForm(): void {
    if (!this.metaData || !this.modelSettingsForm) {
      return;
    }
    this.modelSettingsForm.patchValue({
      StructureName: this.metaData.StructureName,
      ModelName: !this.metaData.IsCurrent || this.isNewModel ? this.metaData.ModelName : '',
      PayMarket: this.metaData.Paymarket,
      Rate: this.metaData.Rate || 'Annual',
      Currency: this.metaData.Currency || 'USD',
      RangeDistributionSetting: this.metaData.RangeDistributionSetting,
      RangeAdvancedSetting: this.metaData.RangeAdvancedSetting
    });
  }

  protected resetForm(): void {
    this.modelSettingsForm.reset({
      StructureName: this.metaData.StructureName,
      ModelName: !this.metaData.IsCurrent || this.isNewModel ? this.metaData.ModelName : '',
      PayMarket: this.metaData.Paymarket,
      Rate: this.metaData.Rate || 'Annual',
      Currency: this.metaData.Currency || 'USD',
      RangeDistributionSetting: this.metaData.RangeDistributionSetting,
      RangeAdvancedSetting: this.metaData.RangeAdvancedSetting
    });
    this.modelSettingsForm.markAsUntouched();
    this.modelSettingsForm.markAsPristine();
  }
}
