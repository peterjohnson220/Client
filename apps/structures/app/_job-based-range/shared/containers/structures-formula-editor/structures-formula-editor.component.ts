import { AfterViewInit, Component, forwardRef, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { ControlValueAccessor, FormControl, FormGroup, NG_VALIDATORS, NG_VALUE_ACCESSOR, Validators } from '@angular/forms';

import { select, Store } from '@ngrx/store';
import { Observable, Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import cloneDeep from 'lodash/cloneDeep';

import { PfValidators } from 'libs/forms';
import { RangeGroupMetadata } from 'libs/models/structures';
import { AvailableTableFields, DataViewAccessLevel, DataViewEntity, GetAvailableFieldsByTableRequest } from 'libs/models/payfactors-api';
import { FormulaFieldModalObj } from 'libs/models/formula-editor';
import { Field, FieldDataType, FormulaType, functionSuggestionList, Suggestion } from 'libs/ui/formula-editor';
import * as fromFormulaFieldActions from 'libs/ui/formula-editor/actions/formula-field.actions';
import * as fromFieldActions from 'libs/ui/formula-editor/actions/fields.actions';
import * as fromPfDataGridReducer from 'libs/features/grids/pf-data-grid/reducers';

import * as fromJobBasedRangeReducer from '../../reducers';
import { PagesHelper } from '../../../../shared/helpers/pages.helper';
import { ModelSettingsModalConstants } from '../../../../shared/constants/model-settings-modal-constants';

@Component({
  selector: 'pf-structures-formula-editor',
  templateUrl: './structures-formula-editor.component.html',
  styleUrls: ['./structures-formula-editor.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => StructuresFormulaEditorComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => StructuresFormulaEditorComponent),
      multi: true
    }
  ]
})
export class StructuresFormulaEditorComponent implements ControlValueAccessor, OnInit, AfterViewInit, OnDestroy, OnChanges {
  @Input() metadata: RangeGroupMetadata;
  @Input() attemptedSubmit: boolean;
  @Input() includeRangeFields: boolean;
  @Input() formulaFieldId: string;

  readonly maxFieldNameLength = 255;
  readonly VALIDATE_DEBOUNCE_TIME = 2000;

  structuresFormulaForm: FormGroup;
  isEditable = true;
  fieldSuggestions: Suggestion[];
  functionSuggestions: Suggestion[] = functionSuggestionList;
  validating: boolean;
  isValidFormula: boolean;
  successfulFormulaSave = false;
  isWaitingForValidation: boolean;
  baseEntity: DataViewEntity;
  formulaFieldObj: FormulaFieldModalObj;
  formulaChanged: Subject<string> = new Subject<string>();
  pageLoaded = false;
  resetFormula = false;
  formula: string;
  formulaTooltip: string;


  formulaFieldSuggestions$: Observable<Suggestion[]>;
  validating$: Observable<boolean>;
  formulaValid$: Observable<boolean>;
  baseEntity$: Observable<DataViewEntity>;
  savedFormulaField$: Observable<Field>;
  saveFormulaFieldSuccess$: Observable<boolean>;
  saveFormulaFieldError$: Observable<boolean>;
  savingErrorMessage$: Observable<string>;
  resetFormula$: Observable<boolean>;

  subscriptions: Subscription[] = [];

  get formControls() {
    return this.structuresFormulaForm.controls;
  }

  get FieldName() {
    return (this.structuresFormulaForm.get('FieldName'));
  }

  constructor(public store: Store<fromJobBasedRangeReducer.State>) {
    this.formulaTooltip = ModelSettingsModalConstants.FORMULA_TOOL_TIP;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!!changes && !!changes.metadata) {
      const metadata = changes.metadata.currentValue;
      const setting = metadata?.RangeDistributionSetting;


      this.formulaFieldObj = this.getFormulaFieldObject(setting);
      this.formula = this.formulaFieldObj.Formula;
    }
  }

  ngOnInit(): void {
    this.formulaFieldSuggestions$ = this.store.select(fromJobBasedRangeReducer.getFormulaFieldSuggestions, this.formulaFieldId);
    this.validating$ = this.store.select(fromJobBasedRangeReducer.getFormulaValidating, this.formulaFieldId);
    this.formulaValid$ = this.store.select(fromJobBasedRangeReducer.getFormulaValid, this.formulaFieldId);
    this.savedFormulaField$ = this.store.select(fromJobBasedRangeReducer.getFormulaField, this.formulaFieldId);
    this.savingErrorMessage$ = this.store.select(fromJobBasedRangeReducer.getFormulaSavingErrorMessage, this.formulaFieldId);
    this.saveFormulaFieldError$ = this.store.select(fromJobBasedRangeReducer.getFormulaSavingError, this.formulaFieldId);
    this.saveFormulaFieldSuccess$ = this.store.select(fromJobBasedRangeReducer.getFormulaSavingSuccess, this.formulaFieldId);
    this.resetFormula$ = this.store.select(fromJobBasedRangeReducer.getResetFormula, this.formulaFieldId);

    this.buildForm();

    const modelPageViewId =
      PagesHelper.getModelPageViewIdByRangeTypeAndRangeDistributionType(this.metadata?.RangeTypeId, this.metadata?.RangeDistributionTypeId);
    this.store.dispatch(new fromFieldActions.GetAvailableFieldsByTable({
      request: this.buildAvailableFieldsByTableRequest(modelPageViewId),
      fieldId: this.formulaFieldId
    }));
    this.baseEntity$ = this.store.pipe(select(fromPfDataGridReducer.getBaseEntity, modelPageViewId));

    this.subscriptions.push(
      this.structuresFormulaForm.valueChanges.subscribe(value => {
        this.onChange(value);
        this.onTouched();
      }),

      this.savedFormulaField$.subscribe(f => {
        if (!!f) {
          this.formulaFieldObj = cloneDeep(this.mapFormulaFieldObject(f));
          this.formula = String(this.formulaFieldObj.Formula);
          this.structuresFormulaForm.controls['FormulaId'].setValue(f.FormulaId);
        }
      }),

      this.resetFormula$.subscribe(rf => {
        this.resetFormula = rf;
        if (rf === true) {
          this.formulaFieldObj = this.getDefaultFormulaField();
          this.formula = String(this.formulaFieldObj.Formula);
        }
      }),

      this.baseEntity$.subscribe(e => {
        this.baseEntity = e;
        if (!!this.baseEntity && !!this.formulaFieldObj.Formula && !this.resetFormula) {
          this.store.dispatch(new fromFormulaFieldActions.ValidateFormula({
            formula: this.formulaFieldObj.Formula, baseEntityId: this.baseEntity?.Id,
            formulaFieldId: this.formulaFieldId
          }));
        }
      }),

      this.formulaFieldSuggestions$.subscribe(f => this.fieldSuggestions = f),

      this.validating$.subscribe(result => this.validating = result),

      this.formulaValid$.subscribe(result => {
        this.isValidFormula = result;
        if (!this.resetFormula && this.isValidFormula && this.structuresFormulaForm.controls['FieldName'].valid) {
          this.structuresFormulaForm.controls['Formula'].setValue(this.formulaFieldObj.Formula);
          this.store.dispatch(new fromFormulaFieldActions.SaveFormulaField({
            formula: this.getFormulaField(), baseEntityId: this.baseEntity?.Id,
            formulaFieldId: this.formulaFieldId, formulaTypeId: FormulaType.Structures
          }));
        }
      }),

      this.formulaChanged.pipe(debounceTime(this.VALIDATE_DEBOUNCE_TIME))
        .subscribe((value) => this.handleFormulaChangedAfterDebounceTime(value)),

      this.saveFormulaFieldSuccess$.subscribe(s => this.successfulFormulaSave = s)
    );
  }

  ngAfterViewInit() {
    this.pageLoaded = true;
  }

  ngOnDestroy(): void {
    this.formulaChanged.next(null);
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  buildForm() {
    this.structuresFormulaForm = new FormGroup({
      'FormulaId': new FormControl(this.formulaFieldObj.FormulaId, [Validators.required]),
      'Formula': new FormControl({ value: this.formulaFieldObj.Formula }),
      'FieldName': new FormControl({ value: this.formulaFieldObj.FieldName, disabled: false },
        [Validators.required, PfValidators.minLengthTrimWhitespace(1), Validators.maxLength(this.maxFieldNameLength)])
    });
    (setTimeout(_ => this.structuresFormulaForm.updateValueAndValidity()));
  }

  getFormulaField(): FormulaFieldModalObj {
    return this.formulaFieldObj = {
      FormulaId: this.formulaFieldObj.FormulaId,
      FieldName: this.formControls.FieldName.value,
      Formula: this.formulaFieldObj.Formula,
      IsEditable: true,
      DuplicateAllowed: false,
      IsPublic: true,
      AccessLevel: DataViewAccessLevel.Owner,
      DataType: FieldDataType.Float
    };
  }

  getDefaultFormulaField(): FormulaFieldModalObj {
    return this.formulaFieldObj = {
      FormulaId: null,
      FieldName: null,
      Formula: '',
      IsEditable: true,
      DuplicateAllowed: false,
      IsPublic: true,
      AccessLevel: DataViewAccessLevel.Owner,
      DataType: FieldDataType.Float
    };
  }

  mapFormulaFieldObject(data) {
    return this.formulaFieldObj = {
      FormulaId: data.FormulaId,
      FieldName: data.FormulaName,
      Formula: data.Formula,
      IsEditable: data.IsEditable,
      DuplicateAllowed: false,
      IsPublic: data.IsPublic,
      AccessLevel: DataViewAccessLevel.Owner,
      DataType: FieldDataType.Float
    };
  }

  buildAvailableFieldsByTableRequest(pageViewId): GetAvailableFieldsByTableRequest {
    const tables: AvailableTableFields[] = [];
    // always add pricings
    tables.push({ TableName: 'CompanyJobs_Pricings', IncludedDataTypes: [] });
    if (this.includeRangeFields) {
      tables.push({ TableName: 'CompanyStructures_Ranges', IncludedDataTypes: ['Float'] });
    }
    return { PageViewId: pageViewId, Tables: tables };
  }

  handleFormulaNameChange() {
    if (!!this.formulaFieldObj.Formula && this.isValidFormula) {
      this.store.dispatch(new fromFormulaFieldActions.SaveFormulaField({
        formula: this.getFormulaField(), baseEntityId: this.baseEntity?.Id,
        formulaFieldId: this.formulaFieldId, formulaTypeId: FormulaType.Structures
      }));
    }
  }

  handleFormulaChanged(value: string): void {
    this.isWaitingForValidation = true;
    this.formulaChanged.next(value);
    this.store.dispatch(new fromFormulaFieldActions.WaitForFormulaValidation({ formulaFieldId: this.formulaFieldId }));
  }

  private handleFormulaChangedAfterDebounceTime(value: string): void {
    this.formulaFieldObj.Formula = value;
    if (this.formulaFieldObj.Formula.length !== 0) {
      this.store.dispatch(new fromFormulaFieldActions.ValidateFormula({
        formula: value, baseEntityId: this.baseEntity?.Id,
        formulaFieldId: this.formulaFieldId
      }));
      this.isWaitingForValidation = false;
    } else {
      this.isWaitingForValidation = true;
    }
  }

  private getFormulaFieldObject(setting: any): FormulaFieldModalObj {
    let formulaObject = null;
    switch (this.formulaFieldId) {
      case 'Min': {
        if (!!setting && !!setting.Min_Formula) {
          formulaObject = cloneDeep(setting.Min_Formula);
        }
        break;
      }
      case 'Mid': {
        if (!!setting && !!setting.Mid_Formula) {
          formulaObject = cloneDeep(setting.Mid_Formula);
        }
        break;
      }
      case 'Max': {
        if (!!setting && !!setting.Max_Formula) {
          formulaObject = cloneDeep(setting.Max_Formula);
        }
        break;
      }
      case 'FirstTertile': {
        if (!!setting && !!setting.FirstTertile_Formula) {
          formulaObject = cloneDeep(setting.FirstTertile_Formula);
        }
        break;
      }
      case 'SecondTertile': {
        if (!!setting && !!setting.SecondTertile_Formula) {
          formulaObject = cloneDeep(setting.SecondTertile_Formula);
        }
        break;
      }
      case 'FirstQuartile': {
        if (!!setting && !!setting.FirstQuartile_Formula) {
          formulaObject = cloneDeep(setting.FirstQuartile_Formula);
        }
        break;
      }
      case 'SecondQuartile': {
        if (!!setting && !!setting.SecondQuartile_Formula) {
          formulaObject = cloneDeep(setting.SecondQuartile_Formula);
        }
        break;
      }
      case 'FirstQuintile': {
        if (!!setting && !!setting.FirstQuintile_Formula) {
          formulaObject = cloneDeep(setting.FirstQuintile_Formula);
        }
        break;
      }
      case 'SecondQuintile': {
        if (!!setting && !!setting.SecondQuintile_Formula) {
          formulaObject = cloneDeep(setting.SecondQuintile_Formula);
        }
        break;
      }
      case 'ThirdQuintile': {
        if (!!setting && !!setting.ThirdQuintile_Formula) {
          formulaObject = cloneDeep(setting.ThirdQuintile_Formula);
        }
        break;
      }
      case 'FourthQuintile': {
        if (!!setting && !!setting.FourthQuintile_Formula) {
          formulaObject = cloneDeep(setting.FourthQuintile_Formula);
        }
        break;
      }
    }

    if (!!formulaObject) {
      return formulaObject;
    } else {
      return this.getDefaultFormulaField();
    }
  }

  isValid(): boolean {
    if (this.pageLoaded) {
      return this.structuresFormulaForm.valid && !!this.formulaFieldObj.Formula && this.isValidFormula && !!this.formulaFieldObj?.FormulaId;
    } else {
      return false;
    }
  }

  get value(): FormulaFieldModalObj {
    return this.structuresFormulaForm.getRawValue();
  }

  set value(value: FormulaFieldModalObj) {
    this.structuresFormulaForm.patchValue(value);
    this.onChange(value);
    this.onTouched();
  }

  onChange: any = () => {};

  onTouched: any = () => {};

  writeValue(value) {
    if (!!value) {
      this.value = value;
    } else {
      this.structuresFormulaForm.reset();
    }
  }

  // communicate the inner form validation to the parent form
  validate(_: FormControl) {
    if (this.pageLoaded) {
      return this.isValid() ? null : { Formula: { valid: false } };
    } else {
      return false;
    }
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
