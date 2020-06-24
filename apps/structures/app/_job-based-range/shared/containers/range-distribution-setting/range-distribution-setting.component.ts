import { Component, OnDestroy, OnInit, Input, forwardRef, OnChanges, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, Validators, NG_VALUE_ACCESSOR, NG_VALIDATORS, ControlValueAccessor } from '@angular/forms';

import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import { AsyncStateObj } from 'libs/models/state';
import { CompanySettingsEnum } from 'libs/models';
import { SettingsService } from 'libs/state/app-context/services';
import { RangeDistributionSetting } from 'libs/models/payfactors-api';

import * as fromJobBasedRangeReducer from '../../reducers';
import { ControlPoint, RangeGroupMetadata, RangeDistributionSettingForm } from '../../models';

@Component({
  selector: 'pf-range-distribution-setting',
  templateUrl: './range-distribution-setting.component.html',
  styleUrls: ['./range-distribution-setting.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RangeDistributionSettingComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => RangeDistributionSettingComponent),
      multi: true
    }
  ]
})
export class RangeDistributionSettingComponent implements ControlValueAccessor, OnChanges, OnInit, OnDestroy {
  @Input() attemptedSubmit: boolean;
  @Input() metadata: RangeGroupMetadata;
  @Input() controlPointsAsyncObj: AsyncStateObj<ControlPoint[]>;
  @Input() rangeGroupId: number;

  enableJobRangeTypes$: Observable<boolean>;
  subscriptions: Subscription[] = [];
  controlPoints: ControlPoint[];
  rangeDistributionSettingForm: FormGroup;
  enableJobRangeTypes: boolean;
  activeRangeTypeTab: string;
  controlPointCategory: ControlPoint[];
  controlPointRanges: ControlPoint[];
  rangeDistributionSetting: RangeDistributionSetting;
  showMinSpread: boolean;
  showMaxSpread: boolean;


  constructor(
    public store: Store<fromJobBasedRangeReducer.State>,
    private settingService: SettingsService
  ) {
    this.enableJobRangeTypes$ = this.settingService.selectCompanySetting<boolean>(
      CompanySettingsEnum.EnableJobRangeStructureRangeTypes
    );
  }

  get value(): RangeDistributionSettingForm {
    return this.rangeDistributionSettingForm.getRawValue();
  }

  set value(value: RangeDistributionSettingForm) {
    this.rangeDistributionSettingForm.patchValue(value);
    this.onChange(value);
    this.onTouched();
  }

  get formControls() {
    return this.rangeDistributionSettingForm.controls;
  }

  buildForm() {
    this.rangeDistributionSettingForm = new FormGroup({
      'CompanyStructuresRangeGroupId': new FormControl(this.rangeGroupId),
      'RangeDistributionTypeId': new FormControl({
        value: this.metadata.RangeDistributionTypeId,
        disabled: true // we always want to disable
        }, [Validators.required]
      ),
      'ControlPoint': new FormControl({value: this.metadata.ControlPoint, disabled: true}, [Validators.required]),
      'RangeBasedOn': new FormControl(this.metadata.ControlPoint, [Validators.required]),
      'Minimum': new FormControl(this.metadata.SpreadMin, [Validators.required]),
      'Maximum': new FormControl(this.metadata.SpreadMax, [Validators.required]),
      'FirstTertile': new FormControl(null),
      'SecondTertile': new FormControl(null),
      'FirstQuartile': new FormControl(null),
      'SecondQuartile': new FormControl(null),
      'FirstQuintile': new FormControl(null),
      'SecondQuintile': new FormControl(null),
      'ThirdQuintile': new FormControl(null),
      'FourthQuintile': new FormControl(null),
      'MinPercentile': new FormControl(null),
      'MaxPercentile': new FormControl(null),
    });

    this.activeRangeTypeTab = this.metadata.RangeDistributionTypes.find(t => t.Id === this.metadata.RangeDistributionTypeId).Type;

    this.subscriptions.push(
      // any time the inner form changes update the parent of any change
      this.rangeDistributionSettingForm.valueChanges.subscribe(value => {
        this.onChange(value);
        this.onTouched();
      })
    );

    if (!!this.metadata.RangeDistributionTypeId) {
      this.setFormValidators(this.metadata.RangeDistributionTypeId);
    }

    // load show min /max here
    this.loadMinMaxState();
  }

  handleRangeBasedOnFilterChange(value: string) {
    this.controlPointCategory = this.controlPoints.filter((ctrlPt, i, arr) => {
      return arr.indexOf(arr.find(t => t.Category === ctrlPt.Category && t.RangeDisplayName === 'MRP' &&
        (t.Display.toLowerCase().startsWith(value.toLowerCase()) || t.Display.toLowerCase().includes(value.toLowerCase())))) === i;
    });
  }

  handleRangeBasedOnSelectionChange(value: ControlPoint) {
    if (!!value) {
      // Set MRP vaue of the selected pay type
      this.rangeDistributionSettingForm.controls['ControlPoint'].setValue(value.FieldName);

      // Update range values of the selected pay type
      this.controlPointRanges = this.controlPoints.filter(c => c.Category === value.Category && c.RangeDisplayName !== 'MRP');

      // Reset range values and set validators based on range distribution type id
      this.resetFormValidators();
      this.setFormValidators(this.rangeDistributionSettingForm.controls['RangeDistributionTypeId'].value);
    }
  }

  handleControlPointFilterChange(value: string) {
    this.controlPoints = this.controlPointsAsyncObj.obj.filter(cp => cp.Display.toLowerCase().startsWith(value.toLowerCase()));
  }

  handleControlPointSelectionChange() {
    this.controlPoints = this.controlPointsAsyncObj.obj;
  }

  handleRangeTypeChange(event) {
    this.activeRangeTypeTab = event.Type;
    this.resetFormValidators();
    this.setFormValidators(event.Id);
  }

  setFormValidators(id) {
    switch (id) {
      case 2: {
         this.setRequiredValidator('Tertile');
         break;
      }
      case 3: {
        this.setRequiredValidator('Quartile');
         break;
      }
      case 4: {
        this.setRequiredValidator('Quintile');
         break;
      }
   }
  }

  handleMinMaxPercentileToggle(min: boolean) {
    if (min) {
      this.showMinSpread = !this.showMinSpread;
      if (this.showMinSpread) {
        this.formControls.MinPercentile.patchValue(null);
        this.setValidation('MinPercentile', 'Minimum');
      } else {
        this.formControls.Minimum.patchValue(null);
        this.setValidation('Minimum', 'MinPercentile');
      }
    } else {
      this.showMaxSpread = !this.showMaxSpread;
      if (this.showMaxSpread) {
        this.formControls.MaxPercentile.patchValue(null);
        this.setValidation('MaxPercentile', 'Maximum');
      } else {
        this.formControls.Maximum.patchValue(null);
        this.setValidation('Maximum', 'MaxPercentile');
      }

    }
  }

  loadMinMaxState() {
    const minSpread = !!this.metadata.SpreadMin;
    const maxSpread = !!this.metadata.SpreadMax;
    const minPercentile = !!this.metadata.RangeDistributionSetting?.MinPercentile;
    const maxPercentile = !!this.metadata.RangeDistributionSetting?.MaxPercentile;

    // default to using spread
    if (minSpread || (!minSpread && !minPercentile)) {
      this.showMinSpread = true;
      this.setValidation('MinPercentile', 'Minimum');
    } else {
      this.showMinSpread = false;
      this.setValidation('Minimum', 'MinPercentile');
    }

    if (maxSpread || (!maxSpread && !maxPercentile)) {
      this.showMaxSpread = true;
      this.setValidation('MaxPercentile', 'Maximum');
    } else {
      this.showMaxSpread = false;
      this.setValidation('Maximum', 'MaxPercentile');
    }
  }

  setValidation(notRequired: string, required: string) {
    this.clearRequiredValidator(notRequired);
    this.setRequired(required);
  }

  resetFormValidators() {
    for (const controlName in this.rangeDistributionSettingForm.controls) {
      if (controlName.includes('Tertile') || controlName.includes('Quartile') || controlName.includes('Quintile')) {
        this.rangeDistributionSettingForm.get(controlName).reset();
        this.rangeDistributionSettingForm.get(controlName).clearValidators();
        this.rangeDistributionSettingForm.get(controlName).updateValueAndValidity();
      }
    }
  }

  setRequired(controlName: string) {
    this.rangeDistributionSettingForm.get(controlName).setValidators([Validators.required]);
    this.rangeDistributionSettingForm.get(controlName).updateValueAndValidity();
  }

  setRequiredValidator(baseRangeType: string) {
    for (const controlName in this.rangeDistributionSettingForm.controls) {
      if (controlName.includes(baseRangeType)) {
       this.setRequired(controlName);
      }
    }
  }

  clearRequiredValidator(controlName: string) {
    this.rangeDistributionSettingForm.get(controlName).reset();
    this.rangeDistributionSettingForm.get(controlName).clearValidators();
    this.rangeDistributionSettingForm.get(controlName).updateValueAndValidity();
  }

  // Lifecycle
  ngOnInit(): void {
    this.buildForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!!changes && !!changes.controlPointsAsyncObj) {
      const cp = changes.controlPointsAsyncObj.currentValue;
      let selectedCategory: string = null;

      this.controlPointsAsyncObj = cp;
      this.controlPoints = cp.obj;

      if (this.metadata.ControlPoint !== null) {
        selectedCategory = this.controlPoints.find(c => c.FieldName === this.metadata.ControlPoint).Category;
      }
      selectedCategory = selectedCategory ?? 'Base';

      this.controlPointCategory = this.controlPoints.filter((ctrlPt, i, arr) => {
        return arr.indexOf(arr.find(t => t.Category === ctrlPt.Category && t.RangeDisplayName === 'MRP')) === i;
      });

      this.controlPointRanges = this.controlPoints.filter((ctrlPt, i, arr) => {
        return arr.indexOf(arr.find(t => t.Category === selectedCategory &&
            t.RangeDisplayName === ctrlPt.RangeDisplayName && t.RangeDisplayName !== 'MRP')) === i;
      });
    }

    if (!!changes && !!changes.metadata) {
      this.rangeDistributionSetting = changes.metadata.currentValue.RangeDistributionSetting;
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  onChange: any = () => {};
  onTouched: any = () => {};

  writeValue(value) {
    if (value) {
      this.value = this.mapToRangeDistributionSettingForm(value);
    }
  }

  mapToRangeDistributionSettingForm(value: RangeDistributionSetting): RangeDistributionSettingForm {
    return {
      RangeBasedOn: this.metadata.ControlPoint,
      ControlPoint: this.metadata.ControlPoint,
      Minimum: this.metadata.SpreadMin,
      Maximum: this.metadata.SpreadMax,
      FirstTertile: value.FirstTertile,
      SecondTertile: value.SecondTertile,
      RangeDistributionTypeId: value.RangeDistributionTypeId,
      CompanyStructuresRangeGroupId: this.rangeGroupId,
      FirstQuartile: value.FirstQuartile,
      SecondQuartile: value.SecondQuartile,
      FirstQuintile: value.FirstQuintile,
      SecondQuintile: value.SecondQuintile,
      ThirdQuintile: value.ThirdQuintile,
      FourthQuintile: value.FourthQuintile,
      MinPercentile: value.MinPercentile,
      MaxPercentile: value.MaxPercentile
    };
  }

  // communicate the inner form validation to the parent form
  validate(_: FormControl) {
    return this.rangeDistributionSettingForm.valid ? null : { RangeDistributionSetting: { valid: false } };
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn) {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
  }

}
