import { Component, forwardRef, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { ControlValueAccessor, FormControl, FormGroup, NG_VALIDATORS, NG_VALUE_ACCESSOR, Validators } from '@angular/forms';

import { Store } from '@ngrx/store';
import { Subject, Subscription } from 'rxjs';

import { AdvancedModelSettingForm, RangeGroupMetadata } from 'libs/models/structures';
import { MissingMarketDataTypes } from 'libs/constants/structures/missing-market-data-type';
import { AbstractFeatureFlagService, FeatureFlags, RealTimeFlag } from 'libs/core/services/feature-flags';

import * as fromJobBasedRangeReducer from '../../reducers';
import { AdvancedModelingHelper } from '../../helpers/advanced-modeling.helper';
import * as fromSharedJobBasedRangeReducer from '../../../shared/reducers';
import * as fromSharedActions from '../../actions/shared.actions';


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
export class AdvancedModelSettingComponent implements OnInit, OnChanges, OnDestroy, ControlValueAccessor {
  @Input() attemptedSubmit: true;
  @Input() metadata: RangeGroupMetadata;
  @Input() rangeGroupId: number;

  advancedModelSettingForm: FormGroup;
  subscriptions: Subscription[] = [];
  disableSettingBasedOnPublishedStructure = true;
  disableSettingBasedOnHierarchy = true;
  structureHasSettings: Subscription;
  structuresAdvancedModelingRegressionCalculationFeatureFlag:
    RealTimeFlag = { key: FeatureFlags.StructuresAdvancedModelingRegressionCalculation, value: false };
  unsubscribe$ = new Subject<void>();

  private formPreventMidsFromIncreasingMoreThanPercentEnabled = 'PreventMidsFromIncreasingMoreThanPercent.Enabled';
  private formPreventMidsFromIncreasingMoreThanPercentPercentage = 'PreventMidsFromIncreasingMoreThanPercent.Percentage';
  private formMissingMarketDataTypeType = 'MissingMarketDataType.Type';
  private formMissingMarketDataTypeIncreaseMidpointByPercentage = 'MissingMarketDataType.IncreaseMidpointByPercentage';
  private formMissingMarketDataTypeDecreasePercentFromNextLevelPercentage = 'MissingMarketDataType.DecreasePercentFromNextLevelPercentage';
  private formMissingMarketDataTypeIncreasePercentFromPreviousLevelPercentage = 'MissingMarketDataType.IncreasePercentFromPreviousLevelPercentage';


  constructor(public store: Store<fromJobBasedRangeReducer.State>,
              private featureFlagService: AbstractFeatureFlagService) {
    this.structureHasSettings = this.store.select(fromSharedJobBasedRangeReducer.getStructureHasSettings).subscribe(hs => {
      if (hs.obj != null) {
        this.disableSettingBasedOnPublishedStructure = hs.obj.HasPublishedForType < 1;
        this.disableSettingBasedOnHierarchy = !hs.obj.HasHierarchyJobs;
      }
    });
    this.featureFlagService.bindEnabled(this.structuresAdvancedModelingRegressionCalculationFeatureFlag, this.unsubscribe$);
  }

  buildForm() {
    if (this.metadata.RangeAdvancedSetting !== null) {
      const increaseMidpointByPercentage =
        this.metadata.RangeAdvancedSetting.MissingMarketDataType.Type === MissingMarketDataTypes.IncreaseMidpointByPercent
          ? this.metadata.RangeAdvancedSetting.MissingMarketDataType.IncreaseMidpointByPercentage
          : null;

      const decreasePercentFromNextLevelPercentage =
        this.metadata.RangeAdvancedSetting.MissingMarketDataType.Type === MissingMarketDataTypes.DecreasePercentFromNextLevel
          ? this.metadata.RangeAdvancedSetting.MissingMarketDataType.DecreasePercentFromNextLevelPercentage
          : null;

      const increasePercentFromPreviousLevelPercentage =
        this.metadata.RangeAdvancedSetting.MissingMarketDataType.Type === MissingMarketDataTypes.IncreasePercentFromPreviousLevel
          ? this.metadata.RangeAdvancedSetting.MissingMarketDataType.IncreasePercentFromPreviousLevelPercentage
          : null;

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
          'Type': new FormControl(this.metadata.RangeAdvancedSetting.MissingMarketDataType.Type),
          'IncreaseMidpointByPercentage': new FormControl(increaseMidpointByPercentage),
          'DecreasePercentFromNextLevelPercentage': new FormControl(decreasePercentFromNextLevelPercentage),
          'IncreasePercentFromPreviousLevelPercentage': new FormControl(increasePercentFromPreviousLevelPercentage),
        })
      });
    } else {
      this.advancedModelSettingForm = new FormGroup({
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
          'IncreaseMidpointByPercentage': new FormControl(null),
          'DecreasePercentFromNextLevelPercentage': new FormControl(null),
          'IncreasePercentFromPreviousLevelPercentage': new FormControl(null)
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

  get preventMidsFromIncreasingMoreThanPercentEnabled() {
    return this.advancedModelSettingForm.get(this.formPreventMidsFromIncreasingMoreThanPercentEnabled);
  }

  get preventMidsFromIncreasingMoreThanPercentPercentage() {
    return this.advancedModelSettingForm.get(this.formPreventMidsFromIncreasingMoreThanPercentPercentage);
  }

  get missingMarketDataTypeType() {
    return this.advancedModelSettingForm.get(this.formMissingMarketDataTypeType);
  }

  get missingMarketDataTypeIncreaseMidpointByPercentage() {
    return this.advancedModelSettingForm.get(this.formMissingMarketDataTypeIncreaseMidpointByPercentage);
  }

  get missingMarketDataTypeDecreasePercentFromNextLevelPercentage() {
    return this.advancedModelSettingForm.get(this.formMissingMarketDataTypeDecreasePercentFromNextLevelPercentage);
  }

  get missingMarketDataTypeIncreasePercentFromPreviousLevelPercentage() {
    return this.advancedModelSettingForm.get(this.formMissingMarketDataTypeIncreasePercentFromPreviousLevelPercentage);
  }

  get missingMarketDataTypesIncreaseMidpointByPercent() {
    return MissingMarketDataTypes.IncreaseMidpointByPercent;
  }

  get missingMarketDataTypesDecreasePercentFromNextLevel() {
    return MissingMarketDataTypes.DecreasePercentFromNextLevel;
  }

  get missingMarketDataTypesIncreasePercentFromPreviousLevel() {
    return MissingMarketDataTypes.IncreasePercentFromPreviousLevel;
  }

  handlePreventMidsFromIncreasingMoreThanPercentChanged(event: any) {
    if (event.target.checked) {
      this.setValidators(this.formPreventMidsFromIncreasingMoreThanPercentPercentage, 0.01, 100);
    } else {
      this.clearValidators(this.formPreventMidsFromIncreasingMoreThanPercentPercentage);
    }
  }

  handleRadioButtonChanged(event: any) {
    this.clearValidators(this.formMissingMarketDataTypeIncreaseMidpointByPercentage);
    this.clearValidators(this.formMissingMarketDataTypeDecreasePercentFromNextLevelPercentage);
    this.clearValidators(this.formMissingMarketDataTypeIncreasePercentFromPreviousLevelPercentage);

    if (event.target.id === 'IncreaseMidpointByPercent') {
      this.setValidators(this.formMissingMarketDataTypeIncreaseMidpointByPercentage, 0, 100);
    } else if (event.target.id === 'DecreasePercentFromNextLevel') {
      this.setValidators(this.formMissingMarketDataTypeDecreasePercentFromNextLevelPercentage, 0, 100);
    } else if (event.target.id === 'IncreasePercentFromPreviousLevel') {
      this.setValidators(this.formMissingMarketDataTypeIncreasePercentFromPreviousLevelPercentage, 0, 100);
    }
  }

  getToolTipContent() {
    return 'You must have job hierarchy set up to use this option.  To set up a job hierarchy, go to Company Administration and select Create Job Hierarchy';
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

    this.clearValidators(this.formMissingMarketDataTypeIncreaseMidpointByPercentage);
    this.clearValidators(this.formMissingMarketDataTypeDecreasePercentFromNextLevelPercentage);
    this.clearValidators(this.formMissingMarketDataTypeIncreasePercentFromPreviousLevelPercentage);

    if (+this.missingMarketDataTypeType.value === MissingMarketDataTypes.IncreaseMidpointByPercent) {
      this.setValidators(this.formMissingMarketDataTypeIncreaseMidpointByPercentage, 0, 100);
    } else if (+this.missingMarketDataTypeType.value === MissingMarketDataTypes.DecreasePercentFromNextLevel) {
      this.setValidators(this.formMissingMarketDataTypeDecreasePercentFromNextLevelPercentage, 0, 100);
    } else if (+this.missingMarketDataTypeType.value === MissingMarketDataTypes.IncreasePercentFromPreviousLevel) {
      this.setValidators(this.formMissingMarketDataTypeIncreasePercentFromPreviousLevelPercentage, 0, 100);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!!changes && !!changes.rangeGroupId) {
      this.store.dispatch(new fromSharedActions.GetStructureHasSettings({
        RangeGroupId: this.rangeGroupId,
        PaymarketId: this.metadata.PaymarketId,
        DistributionTypeId: this.metadata.RangeDistributionTypeId,
        PayType: this.metadata.PayType
      }));
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
    this.structureHasSettings.unsubscribe();
    this.unsubscribe$.next();
  }
}
