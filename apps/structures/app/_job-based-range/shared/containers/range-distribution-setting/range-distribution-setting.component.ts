import { Component, forwardRef, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { ControlValueAccessor, FormControl, FormGroup, NG_VALIDATORS, NG_VALUE_ACCESSOR, Validators } from '@angular/forms';

import { Store } from '@ngrx/store';
import { Observable, Subject, Subscription } from 'rxjs';

import { AsyncStateObj } from 'libs/models/state';
import { CompanySettingsEnum } from 'libs/models/company';
import { CalculationTypeDisplay, RangeDistributionSettingForm, RangeGroupMetadata } from 'libs/models/structures';
import { SettingsService } from 'libs/state/app-context/services';
import * as fromFormulaFieldActions from 'libs/features/formula-editor/actions/formula-field.actions';
import { CalculationType } from 'libs/constants/structures/calculation-type';
import { AbstractFeatureFlagService, FeatureFlags, RealTimeFlag } from 'libs/core/services/feature-flags';

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
  minCalculationType: CalculationType;
  maxCalculationType: CalculationType;
  showMidFormula: boolean;
  tertileFirstCalculationType: CalculationType;
  tertileSecondCalculationType: CalculationType;
  quartileFirstCalculationType: CalculationType;
  quartileSecondCalculationType: CalculationType;
  quintileFirstCalculationType: CalculationType;
  quintileSecondCalculationType: CalculationType;
  quintileThirdCalculationType: CalculationType;
  quintileFourthCalculationType: CalculationType;
  minSpreadTooltip: string;
  maxSpreadTooltip: string;
  fieldsDisabledTooltip: string;
  payTypeTooltip: string;
  enablePercentilesAndRangeSpreads: boolean;
  structuresAdvancedModelingFeatureFlag: RealTimeFlag = { key: FeatureFlags.StructuresAdvancedModeling, value: false };
  unsubscribe$ = new Subject<void>();

  calculationTypes: CalculationTypeDisplay[];
  currentCalcTypes: {
    [key: string]: CalculationType;
  };

  public get calculationType(): typeof CalculationType {
    return CalculationType;
  }

  constructor(
    public store: Store<fromJobBasedRangeReducer.State>,
    private settingService: SettingsService,
    private featureFlagService: AbstractFeatureFlagService
  ) {
    this.enableJobRangeTypes$ = this.settingService.selectCompanySetting<boolean>(
      CompanySettingsEnum.EnableJobRangeStructureRangeTypes
    );
    this.minSpreadTooltip = ModelSettingsModalConstants.MIN_SPREAD_TOOL_TIP;
    this.maxSpreadTooltip = ModelSettingsModalConstants.MAX_SPREAD_TOOL_TIP;
    this.fieldsDisabledTooltip = ModelSettingsModalConstants.FIELDS_DISABLED_TOOL_TIP;
    this.payTypeTooltip = ModelSettingsModalConstants.PAYTYPE_TOOL_TIP;
    this.featureFlagService.bindEnabled(this.structuresAdvancedModelingFeatureFlag, this.unsubscribe$);
    this.calculationTypes = [
      { Type: CalculationType.Formula, TypeDisplay: 'Calculate' },
      { Type: CalculationType.Spread, TypeDisplay: 'Enter Range Spread' },
      { Type: CalculationType.Percentile, TypeDisplay: 'Enter Percentile Amount' }
    ];
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

  get currentCalculationTypes() {
    return this.currentCalcTypes;
  }

  buildForm() {
    this.activeRangeTypeTab = this.metadata.RangeDistributionTypes.find(t => t.Id === this.metadata.RangeDistributionTypeId).Type;

    this.rangeDistributionSettingForm = new FormGroup({
      'CompanyStructuresRangeGroupId': new FormControl(this.rangeGroupId),
      'RangeDistributionTypeId': new FormControl({ value: this.metadata.RangeDistributionTypeId, disabled: true }, [Validators.required]),
      'PayType': new FormControl(this.metadata.PayType, [Validators.required]),
      'Mid_Percentile': new FormControl({ value: this.metadata.ControlPoint, disabled: true }),
      'Min_Spread': new FormControl({ value: this.metadata.SpreadMin, disabled: !this.enablePercentilesAndRangeSpreads }, [Validators.required]),
      'Max_Spread': new FormControl({ value: this.metadata.SpreadMax, disabled: !this.enablePercentilesAndRangeSpreads }, [Validators.required]),
      'FirstTertile_Percentile': new FormControl({ value: null, disabled: !this.enablePercentilesAndRangeSpreads }),
      'SecondTertile_Percentile': new FormControl({ value: null, disabled: !this.enablePercentilesAndRangeSpreads }),
      'FirstQuartile_Percentile': new FormControl({ value: null, disabled: !this.enablePercentilesAndRangeSpreads }),
      'SecondQuartile_Percentile': new FormControl({ value: null, disabled: !this.enablePercentilesAndRangeSpreads }),
      'FirstQuintile_Percentile': new FormControl({ value: null, disabled: !this.enablePercentilesAndRangeSpreads }),
      'SecondQuintile_Percentile': new FormControl({ value: null, disabled: !this.enablePercentilesAndRangeSpreads }),
      'ThirdQuintile_Percentile': new FormControl({ value: null, disabled: !this.enablePercentilesAndRangeSpreads }),
      'FourthQuintile_Percentile': new FormControl({ value: null, disabled: !this.enablePercentilesAndRangeSpreads }),
      'Min_Percentile': new FormControl({ value: null, disabled: !this.enablePercentilesAndRangeSpreads }),
      'Max_Percentile': new FormControl({ value: null, disabled: !this.enablePercentilesAndRangeSpreads }),
      'Mid_Formula': new FormControl({ value: null }),
      'MinCalculationType': new FormControl({value:  this.calculationTypes.find(ct => ct.Type === CalculationType.Spread),
        disabled: !this.enablePercentilesAndRangeSpreads}),
      'MaxCalculationType': new FormControl({value:  this.calculationTypes.find(ct => ct.Type === CalculationType.Spread),
        disabled: !this.enablePercentilesAndRangeSpreads}),
      'Min_Formula': new FormControl({value: null, disabled: !this.enablePercentilesAndRangeSpreads}),
      'Max_Formula': new FormControl({value: null, disabled: !this.enablePercentilesAndRangeSpreads})
    });

    this.currentCalcTypes = {
      'Min': this.minCalculationType,
      'Max': this.maxCalculationType,
      'FirstTertile': this.tertileFirstCalculationType,
      'SecondTertile': this.tertileSecondCalculationType,
      'FirstQuartile': this.quartileFirstCalculationType,
      'SecondQuartile': this.quartileSecondCalculationType,
      'FirstQuintile': this.quintileFirstCalculationType,
      'SecondQuintile': this.quintileSecondCalculationType,
      'ThirdQuintile': this.quintileThirdCalculationType,
      'FourthQuintile': this.quintileFourthCalculationType
    };

    if (!!this.metadata.RangeDistributionTypeId) {
      this.setFormValidators(this.metadata.RangeDistributionTypeId);
    }

    if (!!this.metadata.ControlPoint || !!this.metadata.RangeDistributionSetting?.Mid_Formula) {
      this.enablePercentilesAndRangeSpreadFields();
    }
  }

  enablePercentilesAndRangeSpreadFields() {
    this.rangeDistributionSettingForm.controls['Min_Spread'].enable();
    this.rangeDistributionSettingForm.controls['Max_Spread'].enable();
    this.rangeDistributionSettingForm.controls['Min_Percentile'].enable();
    this.rangeDistributionSettingForm.controls['Max_Percentile'].enable();
    this.rangeDistributionSettingForm.controls['FirstTertile_Percentile'].enable();
    this.rangeDistributionSettingForm.controls['SecondTertile_Percentile'].enable();
    this.rangeDistributionSettingForm.controls['FirstQuartile_Percentile'].enable();
    this.rangeDistributionSettingForm.controls['SecondQuartile_Percentile'].enable();
    this.rangeDistributionSettingForm.controls['FirstQuintile_Percentile'].enable();
    this.rangeDistributionSettingForm.controls['SecondQuintile_Percentile'].enable();
    this.rangeDistributionSettingForm.controls['ThirdQuintile_Percentile'].enable();
    this.rangeDistributionSettingForm.controls['FourthQuintile_Percentile'].enable();
    this.rangeDistributionSettingForm.controls['Mid_Percentile'].enable();
    this.rangeDistributionSettingForm.controls['MinCalculationType'].enable();
    this.rangeDistributionSettingForm.controls['MaxCalculationType'].enable();
    this.rangeDistributionSettingForm.controls['Min_Formula'].enable();
    this.rangeDistributionSettingForm.controls['Max_Formula'].enable();
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
        this.rangeDistributionSettingForm.controls['Mid_Percentile'].setValue(value.FieldName);
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
    this.loadControlState();
  }

  handleRangeFieldToggle($event: any, fieldPrefix: string) {
    this.currentCalcTypes[fieldPrefix] = $event.Type;
    const spreadField = fieldPrefix + '_Spread';
    const percentileField = fieldPrefix + '_Percentile';
    const formulaField = fieldPrefix + '_Formula';


    switch ($event.Type) {
      case CalculationType.Spread.valueOf(): {
        this.formControls[percentileField].patchValue(null);
        this.formControls[formulaField].patchValue(null);
        this.setValidation([percentileField, formulaField], spreadField);
        break;
      }
      case CalculationType.Percentile.valueOf(): {
        this.formControls[spreadField].patchValue(null);
        this.formControls[formulaField].patchValue(null);
        this.setValidation([spreadField, formulaField], percentileField);
        break;
      }
      case CalculationType.Formula.valueOf(): {
        this.formControls[percentileField].patchValue(null);
        this.formControls[spreadField].patchValue(null);
        this.setValidation([spreadField, percentileField], formulaField);
        this.store.dispatch(new fromFormulaFieldActions.ResetFormula({ formulaFieldId: fieldPrefix }));
        break;
      }
    }
  }

  handleMidToggle() {
    this.showMidFormula = !this.showMidFormula;
    if (this.showMidFormula) {
      this.formControls.Mid_Percentile.patchValue(null);
      this.setValidation(['Mid_Percentile'], 'Mid_Formula');
    } else {
      this.formControls.Mid_Formula.patchValue(null);
      this.setValidation(['Mid_Formula'], 'Mid_Percentile');
      this.store.dispatch(new fromFormulaFieldActions.ResetFormula({formulaFieldId: 'Mid'}));
    }
  }

  loadControlState() {
    const minSpread = !!this.metadata.SpreadMin;
    const maxSpread = !!this.metadata.SpreadMax;
    const minPercentile = !!this.metadata.RangeDistributionSetting?.Min_Percentile;
    const minFormula = !!this.metadata.RangeDistributionSetting?.Min_Formula;
    const maxFormula = !!this.metadata.RangeDistributionSetting?.Max_Formula;
    const maxPercentile = !!this.metadata.RangeDistributionSetting?.Max_Percentile;
    const midPercentile = !!this.metadata.ControlPoint;
    const midFormula = !!this.metadata.RangeDistributionSetting?.Mid_Formula?.FormulaId || this.showMidFormula;

    // default to using spread
    if (minSpread || (!minSpread && !minPercentile && !minFormula)) {
      this.currentCalcTypes['Min'] = CalculationType.Spread;
      this.setValidation(['Min_Percentile', 'Min_Formula'], 'Min_Spread');
    } else if (minPercentile) {
      this.currentCalcTypes['Min'] = CalculationType.Percentile;
      this.setValidation(['Min_Spread', 'Min_Formula'], 'Min_Percentile');
    } else {
      this.currentCalcTypes['Min'] = CalculationType.Formula;
      this.setValidation(['Min_Percentile', 'Min_Spread'], 'Min_Formula');
    }

    if (maxSpread || (!maxSpread && !maxPercentile && !maxFormula)) {
      this.currentCalcTypes['Max'] = CalculationType.Spread;
      this.setValidation(['Max_Percentile', 'Max_Formula'], 'Max_Spread');
    } else if (maxPercentile) {
      this.currentCalcTypes['Max'] = CalculationType.Percentile;
      this.setValidation(['Max_Spread', 'Max_Formula'], 'Max_Percentile');
    } else {
      this.currentCalcTypes['Max'] = CalculationType.Formula;
      this.setValidation(['Max_Percentile', 'Max_Spread'], 'Max_Formula');
    }

    if (midPercentile || (!midPercentile && !midFormula)) {
      this.showMidFormula = false;
      this.setValidation(['Mid_Formula'], 'Mid_Percentile');
    } else {
      this.showMidFormula = true;
      this.setValidation(['Mid_Percentile'], 'Mid_Formula');
    }
  }

  setValidation(notRequired: string[], required: string) {
    notRequired.forEach(notRequiredString => this.clearRequiredValidator(notRequiredString));
    this.setRequired(required);
  }

  resetFormValidators() {
    for (const controlName in this.rangeDistributionSettingForm.controls) {
      if (controlName.includes('Tertile') || controlName.includes('Quartile') || controlName.includes('Quintile')
        || controlName === 'Min_Spread' || controlName === 'Max_Spread' || controlName === 'Min_Percentile' || controlName === 'Max_Percentile'
        || controlName === 'Min_Formula' || controlName === 'Max_Formula') {
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
    this.enablePercentilesAndRangeSpreads = (!!this.metadata.ControlPoint || !!this.metadata.RangeDistributionSetting?.Mid_Formula);

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
      let currentControlPoint: string = null;

      this.controlPointsAsyncObj = cp;
      this.parseControlPoints(cp.obj);

      if (this.metadata.ControlPoint === null && this.metadata.PayType === null) {
        currentControlPoint = 'BaseMRP';
      } else if (this.metadata.ControlPoint === null && this.metadata.PayType !== null) {
        currentControlPoint = this.metadata.PayType + 'MRP';
      } else {
        currentControlPoint = this.metadata.ControlPoint;
      }

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
  }

  private parseControlPoints(controlPoints: any): void {
    const arr = new Array();
    controlPoints.forEach(function (cp) {
      const fieldName = cp.Category === 'Bonus Target Amt'
        ? cp.FieldName.replace('BonusTarget', 'BonusTargetAmt')
        : cp.FieldName;
      arr.push({
        Category: cp.Category.split(' ').join(''),
        Display: cp.Display,
        FieldName: fieldName,
        RangeDisplayName: cp.RangeDisplayName,
        PayTypeDisplay: cp.Category
      });
    });
    this.controlPoints = arr;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
    this.unsubscribe$.next();
  }

  mapToRangeDistributionSettingForm(value: RangeDistributionSettingForm): RangeDistributionSettingForm {
    return {
      PayType: this.metadata.PayType,
      Mid_Percentile: this.metadata.ControlPoint,
      Min_Spread: this.metadata.SpreadMin,
      Max_Spread: this.metadata.SpreadMax,
      FirstTertile_Percentile: value.FirstTertile_Percentile,
      SecondTertile_Percentile: value.SecondTertile_Percentile,
      RangeDistributionTypeId: value.RangeDistributionTypeId,
      CompanyId: value.CompanyId,
      CompanyStructuresRangeGroupId: this.rangeGroupId,
      FirstQuartile_Percentile: value.FirstQuartile_Percentile,
      SecondQuartile_Percentile: value.SecondQuartile_Percentile,
      FirstQuintile_Percentile: value.FirstQuintile_Percentile,
      SecondQuintile_Percentile: value.SecondQuintile_Percentile,
      ThirdQuintile_Percentile: value.ThirdQuintile_Percentile,
      FourthQuintile_Percentile: value.FourthQuintile_Percentile,
      Min_Percentile: value.Min_Percentile,
      Max_Percentile: value.Max_Percentile,
      Mid_Formula: value.Mid_Formula,
      Min_Formula: value.Min_Formula,
      Max_Formula: value.Max_Formula,
      FirstTertile_Formula: value.FirstTertile_Formula,
      SecondTertile_Formula: value.SecondTertile_Formula,
      FirstQuartile_Formula: value.FirstQuartile_Formula,
      SecondQuartile_Formula: value.SecondQuartile_Formula,
      FirstQuintile_Formula: value.FirstQuintile_Formula,
      SecondQuintile_Formula: value.SecondQuintile_Formula,
      ThirdQuintile_Formula: value.ThirdQuintile_Formula,
      FourthQuintile_Formula: value.FourthQuintile_Formula,
      MinCalculationType: value.MinCalculationType,
      MaxCalculationType: value.MaxCalculationType
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
