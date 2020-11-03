import { Component, OnDestroy, OnInit, Input, forwardRef, OnChanges, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, Validators, NG_VALUE_ACCESSOR, NG_VALIDATORS, ControlValueAccessor } from '@angular/forms';

import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import { AsyncStateObj } from 'libs/models/state';
import { CompanySettingsEnum } from 'libs/models/company';
import { RangeGroupMetadata, RangeDistributionSettingForm } from 'libs/models/structures';
import { SettingsService } from 'libs/state/app-context/services';
import { RangeDistributionSetting } from 'libs/models/payfactors-api';

import * as fromJobBasedRangeReducer from '../../reducers';
import { ControlPoint } from '../../models';
import { ModelSettingsModalConstants } from '../../constants/model-settings-modal-constants';

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
  activeRangeTypeTab: string;
  controlPointCategory: ControlPoint[];
  controlPointMidpoint: ControlPoint[];
  controlPointRanges: ControlPoint[];
  rangeDistributionSetting: RangeDistributionSetting;
  showMinSpread: boolean;
  showMaxSpread: boolean;
  showMidFormula: boolean;
  minSpreadTooltip: string;
  maxSpreadTooltip: string;
  fieldsDisabledTooltip: string;
  payTypeTooltip: string;
  enablePercentilesAndRangeSpreads: boolean;


  constructor(
    public store: Store<fromJobBasedRangeReducer.State>,
    private settingService: SettingsService
  ) {
    this.enableJobRangeTypes$ = this.settingService.selectCompanySetting<boolean>(
      CompanySettingsEnum.EnableJobRangeStructureRangeTypes
    );
    this.minSpreadTooltip = ModelSettingsModalConstants.MIN_SPREAD_TOOL_TIP;
    this.maxSpreadTooltip = ModelSettingsModalConstants.MAX_SPREAD_TOOL_TIP;
    this.fieldsDisabledTooltip = ModelSettingsModalConstants.FIELDS_DISABLED_TOOL_TIP;
    this.payTypeTooltip = ModelSettingsModalConstants.PAYTYPE_TOOL_TIP;
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
    this.activeRangeTypeTab = this.metadata.RangeDistributionTypes.find(t => t.Id === this.metadata.RangeDistributionTypeId).Type;

    this.rangeDistributionSettingForm = new FormGroup({
      'CompanyStructuresRangeGroupId': new FormControl(this.rangeGroupId),
      'RangeDistributionTypeId': new FormControl({value: this.metadata.RangeDistributionTypeId, disabled: true}, [Validators.required]),
      'PayType': new FormControl(this.metadata.PayType, [Validators.required]),
      'ControlPoint': new FormControl({ value: this.metadata.ControlPoint, disabled: true }, [Validators.required]),
      'Minimum': new FormControl({ value: this.metadata.SpreadMin, disabled: !this.enablePercentilesAndRangeSpreads }, [Validators.required]),
      'Maximum': new FormControl({ value: this.metadata.SpreadMax, disabled: !this.enablePercentilesAndRangeSpreads }, [Validators.required]),
      'FirstTertile': new FormControl({ value: null, disabled: !this.enablePercentilesAndRangeSpreads }),
      'SecondTertile': new FormControl({ value: null, disabled: !this.enablePercentilesAndRangeSpreads }),
      'FirstQuartile': new FormControl({ value: null, disabled: !this.enablePercentilesAndRangeSpreads }),
      'SecondQuartile': new FormControl({ value: null, disabled: !this.enablePercentilesAndRangeSpreads }),
      'FirstQuintile': new FormControl({ value: null, disabled: !this.enablePercentilesAndRangeSpreads }),
      'SecondQuintile': new FormControl({ value: null, disabled: !this.enablePercentilesAndRangeSpreads }),
      'ThirdQuintile': new FormControl({ value: null, disabled: !this.enablePercentilesAndRangeSpreads }),
      'FourthQuintile': new FormControl({ value: null, disabled: !this.enablePercentilesAndRangeSpreads }),
      'MinPercentile': new FormControl({ value: null, disabled: !this.enablePercentilesAndRangeSpreads }),
      'MaxPercentile': new FormControl({ value: null, disabled: !this.enablePercentilesAndRangeSpreads }),
      'ControlPoint_Formula': new FormControl({ value: null })
    });

    if (!!this.metadata.RangeDistributionTypeId) {
      this.setFormValidators(this.metadata.RangeDistributionTypeId);
    }

    if (!!this.metadata.ControlPoint || !!this.metadata.RangeDistributionSetting?.ControlPoint_Formula) {
      this.enablePercentilesAndRangeSpreadFields();
    }
  }

  enablePercentilesAndRangeSpreadFields() {
    this.rangeDistributionSettingForm.controls['Minimum'].enable();
    this.rangeDistributionSettingForm.controls['Maximum'].enable();
    this.rangeDistributionSettingForm.controls['MinPercentile'].enable();
    this.rangeDistributionSettingForm.controls['MaxPercentile'].enable();
    this.rangeDistributionSettingForm.controls['FirstTertile'].enable();
    this.rangeDistributionSettingForm.controls['SecondTertile'].enable();
    this.rangeDistributionSettingForm.controls['FirstQuartile'].enable();
    this.rangeDistributionSettingForm.controls['SecondQuartile'].enable();
    this.rangeDistributionSettingForm.controls['FirstQuintile'].enable();
    this.rangeDistributionSettingForm.controls['SecondQuintile'].enable();
    this.rangeDistributionSettingForm.controls['ThirdQuintile'].enable();
    this.rangeDistributionSettingForm.controls['FourthQuintile'].enable();
    this.rangeDistributionSettingForm.controls['ControlPoint'].enable();
    this.enablePercentilesAndRangeSpreads = true;
  }

  handlePayTypeFilterChange(value: string) {
    this.controlPointCategory = this.controlPoints.filter((ctrlPt, i, arr) => {
      return arr.indexOf(arr.find(t => t.Category === ctrlPt.Category && t.RangeDisplayName === 'MRP' &&
        (t.Display.toLowerCase().startsWith(value.toLowerCase()) || t.Display.toLowerCase().includes(value.toLowerCase())))) === i;
    });
  }

  handlePayTypeSelectionChange(value: ControlPoint) {
    if (!!value) {
      if (!this.showMidFormula) {
        // Set MRP vaue of the selected pay type
        this.rangeDistributionSettingForm.controls['ControlPoint'].setValue(value.FieldName);
      }

      // Update range values of the selected pay type
      this.controlPointRanges = this.controlPoints.filter(c => c.Category === value.Category && c.RangeDisplayName !== 'MRP');
      this.controlPointMidpoint = this.controlPoints.filter(c => c.Category === value.Category);

      // Reset range values and set validators based on range distribution type id
      this.resetFormValidators();
      this.setFormValidators(this.rangeDistributionSettingForm.controls['RangeDistributionTypeId'].value);
      this.enablePercentilesAndRangeSpreadFields();
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
    this.loadMinMaxState();
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

  handleMidToggle() {
    this.showMidFormula = !this.showMidFormula;
    if (this.showMidFormula) {
      this.formControls.ControlPoint.patchValue(null);
      this.setValidation('ControlPoint', 'ControlPoint_Formula');
    } else {
      this.formControls.ControlPoint_Formula.patchValue(null);
      this.setValidation('ControlPoint_Formula', 'ControlPoint');
    }
  }

  loadMinMaxState() {
    const minSpread = !!this.metadata.SpreadMin;
    const maxSpread = !!this.metadata.SpreadMax;
    const minPercentile = !!this.metadata.RangeDistributionSetting?.MinPercentile;
    const maxPercentile = !!this.metadata.RangeDistributionSetting?.MaxPercentile;
    const midPercentile = !!this.metadata.ControlPoint;
    const midFormula = !!this.metadata.RangeDistributionSetting?.ControlPoint_Formula?.FormulaId || this.showMidFormula;

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

    if (midPercentile || (!midPercentile && !midFormula)) {
      this.showMidFormula = false;
      this.setValidation('ControlPoint_Formula', 'ControlPoint');
    } else {
      this.showMidFormula = true;
      this.setValidation('ControlPoint', 'ControlPoint_Formula');
    }
  }

  setValidation(notRequired: string, required: string) {
    this.clearRequiredValidator(notRequired);
    this.setRequired(required);
  }

  resetFormValidators() {
    for (const controlName in this.rangeDistributionSettingForm.controls) {
      if (controlName.includes('Tertile') || controlName.includes('Quartile') || controlName.includes('Quintile')
        || controlName === 'Minimum' || controlName === 'Maximum' || controlName === 'MinPercentile' || controlName === 'MaxPercentile') {
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
    this.enablePercentilesAndRangeSpreads = (!!this.metadata.ControlPoint || !!this.metadata.RangeDistributionSetting?.ControlPoint_Formula);

    this.subscriptions.push(
      // any time the inner form changes update the parent of any change
      this.rangeDistributionSettingForm.valueChanges.subscribe(value => {
        this.onChange(value);
        this.onTouched();
      })
    );

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!!changes && !!changes.controlPointsAsyncObj) {
      const cp = changes.controlPointsAsyncObj.currentValue;
      let selectedCategory: string = null;

      this.controlPointsAsyncObj = cp;
      this.controlPoints = cp.obj;

      const currentControlPoint = this.metadata.ControlPoint === null ? this.metadata.PayType + 'MRP' : this.metadata.ControlPoint;

      if (currentControlPoint !== null) {
        selectedCategory = this.controlPoints.find(c => c.FieldName === currentControlPoint).Category;
      }
      selectedCategory = selectedCategory ?? 'Base';

      this.controlPointCategory = this.controlPoints.filter((ctrlPt, i, arr) => {
        return arr.indexOf(arr.find(t => t.Category === ctrlPt.Category && t.RangeDisplayName === 'MRP')) === i;
      });

      this.controlPointRanges = this.controlPoints.filter((ctrlPt, i, arr) => {
        return arr.indexOf(arr.find(t => t.Category === selectedCategory &&
          t.RangeDisplayName === ctrlPt.RangeDisplayName && t.RangeDisplayName !== 'MRP')) === i;
      });

      this.controlPointMidpoint = this.controlPoints.filter((ctrlPt, i, arr) => {
        return arr.indexOf(arr.find(t => t.Category === selectedCategory &&
          t.RangeDisplayName === ctrlPt.RangeDisplayName)) === i;
      });
    }

    if (!!changes && !!changes.metadata) {
      this.rangeDistributionSetting = changes.metadata.currentValue.RangeDistributionSetting;
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  mapToRangeDistributionSettingForm(value: RangeDistributionSetting): RangeDistributionSettingForm {
    return {
      PayType: this.metadata.PayType,
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
      MaxPercentile: value.MaxPercentile,
      ControlPoint_Formula: value.ControlPoint_Formula
    };
  }

  onChange: any = () => {};
  onTouched: any = () => {};

  writeValue(value) {
    if (value) {
      this.value = this.mapToRangeDistributionSettingForm(value);
    }
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
