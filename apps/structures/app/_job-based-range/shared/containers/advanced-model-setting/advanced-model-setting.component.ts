import { Component, forwardRef, Input, OnDestroy, OnInit } from '@angular/core';
import { ControlValueAccessor, FormControl, FormGroup, NG_VALIDATORS, NG_VALUE_ACCESSOR, Validators } from '@angular/forms';

import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

import { AdvancedModelSettingForm, RangeGroupMetadata } from 'libs/models/structures';
import { MissingMarketDataTypes } from 'libs/constants/structures/missing-market-data-type';

import * as fromJobBasedRangeReducer from '../../reducers';
import { AdvancedModelingHelper } from '../../helpers/advanced-modeling.helper';
import * as fromSharedJobBasedRangeReducer from '../../../shared/reducers';


@Component({
  selector: 'pf-advanced-model-setting',
  templateUrl: './advanced-model-setting.component.html',
  styleUrls: ['./advanced-model-setting.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AdvancedModelSettingComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => AdvancedModelSettingComponent),
      multi: true
    }
  ]
})
export class AdvancedModelSettingComponent implements OnInit, OnDestroy, ControlValueAccessor {
  @Input() attemptedSubmit: true;
  @Input() metadata: RangeGroupMetadata;

  advancedModelSettingForm: FormGroup;
  subscriptions: Subscription[] = [];
  disableAdvancedSetting: boolean;
  hasPublishedSub: Subscription;

  private formPreventMidsFromIncreasingMoreThanPercent = 'PreventMidsFromIncreasingMoreThanPercent';
  private formPreventMidsFromIncreasingMoreThanPercentEnabled = 'PreventMidsFromIncreasingMoreThanPercent.Enabled';
  private formPreventMidsFromIncreasingMoreThanPercentPercentage = 'PreventMidsFromIncreasingMoreThanPercent.Percentage';
  private formMissingMarketDataTypeType = 'MissingMarketDataType.Type';
  private formMissingMarketDataTypePercentage = 'MissingMarketDataType.Percentage';

  constructor(public store: Store<fromJobBasedRangeReducer.State>) {
    this.hasPublishedSub = this.store.select(fromSharedJobBasedRangeReducer.getStructureHasPublished).subscribe( hp => {
      if (hp.obj > 0) {
        this.disableAdvancedSetting = false;
      } else if(hp.loading !== true) {
        this.disableAdvancedSetting = true;
      }
    });
  }

  buildForm() {
    if (this.metadata.RangeAdvancedSetting !== null) {
      this.advancedModelSettingForm = new FormGroup({
        'PreventMidsBelowCurrent': new FormControl(this.metadata.RangeAdvancedSetting.PreventMidsBelowCurrent),
        'PreventMidsFromIncreasingMoreThanPercent': new FormGroup({
          'Enabled': new FormControl(this.metadata.RangeAdvancedSetting.PreventMidsFromIncreasingMoreThanPercent.Enabled),
          'Percentage': new FormControl(this.metadata.RangeAdvancedSetting.PreventMidsFromIncreasingMoreThanPercent.Percentage)
        }),
        'PreventMidsFromIncreasingWithinPercentOfNextLevel': new FormGroup({
          'Enabled': new FormControl(this.metadata.RangeAdvancedSetting.PreventMidsFromIncreasingWithinPercentOfNextLevel.Enabled),
          'Percentage': new FormControl(this.metadata.RangeAdvancedSetting.PreventMidsFromIncreasingWithinPercentOfNextLevel.Percentage)
        }),
        'MissingMarketDataType': new FormGroup({
          'Type': new FormControl(String(this.metadata.RangeAdvancedSetting.MissingMarketDataType.Type)),
          'Percentage': new FormControl(this.metadata.RangeAdvancedSetting.MissingMarketDataType.Percentage)
        })
      });
    } else {
      this.advancedModelSettingForm  = new FormGroup({
        'PreventMidsBelowCurrent': new FormControl(false),
        'PreventMidsFromIncreasingMoreThanPercent': new FormGroup({
          'Enabled': new FormControl(false),
          'Percentage': new FormControl(null)
        }),
        'PreventMidsFromIncreasingWithinPercentOfNextLevel': new FormGroup({
          'Enabled': new FormControl(false),
          'Percentage': new FormControl(null)
        }),
        'MissingMarketDataType': new FormGroup({
          'Type': new FormControl(MissingMarketDataTypes.LeaveValuesBlank),
          'Percentage': new FormControl(null)
        })
      });
    }
  }

  get value(): AdvancedModelSettingForm {
    return this.advancedModelSettingForm.getRawValue();
  }

  set value(value: AdvancedModelSettingForm) {
    this.advancedModelSettingForm.patchValue(value);
    this.onChange(value);
    this.onTouched();
  }

  getMissingMarketDataTypeValue(value: string): number {
    return AdvancedModelingHelper.setMissingMarketDataTypeValue(value);
  }

  disableFormControls() {
    this.advancedModelSettingForm.get(this.formPreventMidsFromIncreasingMoreThanPercent).disable();
  }

  get preventMidsFromIncreasingMoreThanPercentEnabled() {
    return this.advancedModelSettingForm.get(this.formPreventMidsFromIncreasingMoreThanPercentEnabled);
  }

  get preventMidsFromIncreasingMoreThanPercentPercentage() {
    return this.advancedModelSettingForm.get(this.formPreventMidsFromIncreasingMoreThanPercentPercentage);
  }

  get missingMarketDataTypeType() {
    return this.advancedModelSettingForm.get(this.formMissingMarketDataTypeType);
  }

  get missingMarketDataTypePercentage() {
    return this.advancedModelSettingForm.get(this.formMissingMarketDataTypePercentage);
  }

  get missingMarketDataTypesIncreaseCurrentByPercent() {
    return MissingMarketDataTypes.IncreaseCurrentByPercent;
  }

  handlePreventMidsFromIncreasingMoreThanPercentChanged(event: any) {
    if (event.target.checked) {
      this.setValidators(this.formPreventMidsFromIncreasingMoreThanPercentPercentage, 0.01, 100);
    } else {
      this.clearValidators(this.formPreventMidsFromIncreasingMoreThanPercentPercentage);
    }
  }

  handleRadioButtonChanged(event: any) {
    if (event.target.id === 'IncreaseCurrentByPercent') {
      this.setValidators(this.formMissingMarketDataTypePercentage, 0, 100);
    } else {
      this.clearValidators(this.formMissingMarketDataTypePercentage);
    }
  }

  mapToAdvancedSettingForm(value: AdvancedModelSettingForm): AdvancedModelSettingForm {
    return {
      Rounding: value.Rounding,
      PreventMidsBelowCurrent: value.PreventMidsBelowCurrent,
      PreventMidsFromIncreasingMoreThanPercent: value.PreventMidsFromIncreasingMoreThanPercent,
      PreventMidsFromIncreasingWithinPercentOfNextLevel: value.PreventMidsFromIncreasingWithinPercentOfNextLevel,
      MissingMarketDataType: value.MissingMarketDataType
    };
  }

  onChange: any = () => {};
  onTouched: any = () => {};

  writeValue(value) {
    if (value) {
      this.value = this.mapToAdvancedSettingForm(value);
    }
  }

  // communicate the inner form validation to the parent form
  validate(_: FormControl) {
    return this.advancedModelSettingForm.valid ? null : { RangeDistributionSetting: { valid: false } };
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn) {
    this.onTouched = fn;
  }

  private setValidators(controlName: string, min: number, max: number) {
    this.advancedModelSettingForm.get(controlName).enable();
    this.advancedModelSettingForm.get(controlName).setValidators([Validators.required, Validators.min(min), Validators.max(max)]);
    this.advancedModelSettingForm.get(controlName).updateValueAndValidity();
  }

  private clearValidators(controlName: string) {
    this.advancedModelSettingForm.get(controlName).disable();
    this.advancedModelSettingForm.get(controlName).clearValidators();
    this.advancedModelSettingForm.get(controlName).updateValueAndValidity();
  }

  // Lifecycle
  ngOnInit(): void {
    this.buildForm();

    this.subscriptions.push(
      // any time the inner form changes update the parent of any change
      this.advancedModelSettingForm.valueChanges.subscribe(value => {
        this.onChange(value);
        this.onTouched();
      })
    );

    if (this.preventMidsFromIncreasingMoreThanPercentEnabled.value) {
      this.setValidators(this.formPreventMidsFromIncreasingMoreThanPercentPercentage, 0.01, 100);
    } else {
      this.clearValidators(this.formPreventMidsFromIncreasingMoreThanPercentPercentage);
    }

    if (+this.missingMarketDataTypeType.value === MissingMarketDataTypes.IncreaseCurrentByPercent) {
      this.setValidators(this.formMissingMarketDataTypePercentage, 0, 100);
    } else {
      this.clearValidators(this.formMissingMarketDataTypePercentage);
    }

    if (this.disableAdvancedSetting) {
      this.disableFormControls();
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
    this.hasPublishedSub.unsubscribe();
  }
}
