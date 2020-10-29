import { Component, OnDestroy, OnInit, Input, forwardRef, OnChanges, SimpleChanges, AfterViewInit } from '@angular/core';
import { FormControl, FormGroup, Validators, NG_VALUE_ACCESSOR, NG_VALIDATORS, ControlValueAccessor } from '@angular/forms';

import { Store, select } from '@ngrx/store';
import { Observable, Subscription, Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import cloneDeep from 'lodash/cloneDeep';

import { PfValidators } from 'libs/forms';
import { RangeGroupMetadata } from 'libs/models/structures';
import { DataViewAccessLevel, DataViewEntity } from 'libs/models/payfactors-api';
import { FormulaFieldModalObj } from 'libs/models/formula-editor';
import { Suggestion, functionSuggestionList, Field, FieldDataType } from 'libs/features/formula-editor';
import * as fromFormulaFieldActions from 'libs/features/formula-editor/actions/formula-field.actions';
import * as fromFieldActions from 'libs/features/formula-editor/actions/fields.actions';
import * as fromPfDataGridReducer from 'libs/features/pf-data-grid/reducers';

import * as fromJobBasedRangeReducer from '../../reducers';
import { PagesHelper } from '../../helpers/pages.helper';

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

  formulaFieldSuggestions$: Observable<Suggestion[]>;
  validating$: Observable<boolean>;
  formulaValid$: Observable<boolean>;
  baseEntity$: Observable<DataViewEntity>;
  savedFormulaField$: Observable<Field>;
  saveFormulaFieldSuccess$: Observable<boolean>;
  saveFormulaFieldError$: Observable<boolean>;
  savingErrorMessage$: Observable<string>;

  subscriptions: Subscription[] = [];

  get formControls() {
    return this.structuresFormulaForm.controls;
  }

  get FieldName() {
    return (this.structuresFormulaForm.get('FieldName'));
  }

  constructor(public store: Store<fromJobBasedRangeReducer.State>) {
    this.formulaFieldSuggestions$ = this.store.pipe(select(fromJobBasedRangeReducer.getFormulaFieldSuggestions));
    this.validating$ = this.store.pipe(select(fromJobBasedRangeReducer.getFormulaValidating));
    this.formulaValid$ = this.store.pipe(select(fromJobBasedRangeReducer.getFormulaValid));
    this.savedFormulaField$ = this.store.pipe(select(fromJobBasedRangeReducer.getFormulaField));
    this.savingErrorMessage$ = this.store.pipe(select(fromJobBasedRangeReducer.getFormulaSavingErrorMessage));
    this.saveFormulaFieldError$ = this.store.pipe(select(fromJobBasedRangeReducer.getFormulaSavingError));
    this.saveFormulaFieldSuccess$ = this.store.pipe(select(fromJobBasedRangeReducer.getFormulaSavingSuccess));
  }

  ngOnChanges(changes: SimpleChanges): void {

    if (!!changes && !!changes.metadata) {
      const metadata = changes.metadata.currentValue;
      const setting = metadata?.RangeDistributionSetting;

      if (!!setting && !!setting.ControlPoint_Formula) {
        this.formulaFieldObj = cloneDeep(setting.ControlPoint_Formula);
      } else {
        this.formulaFieldObj = this.getDefaultFormulaField();
      }
    }
  }

  ngOnInit(): void {
    this.buildForm();

    const modelPageViewId = PagesHelper.getModelPageViewIdByRangeDistributionType(this.metadata?.RangeDistributionTypeId);
    this.store.dispatch(new fromFieldActions.GetAvailableReportFieldsByPageViewId({ pageViewId: modelPageViewId }));
    this.baseEntity$ = this.store.pipe(select(fromPfDataGridReducer.getBaseEntity, modelPageViewId));

    this.subscriptions.push(
      this.structuresFormulaForm.valueChanges.subscribe(value => {
        this.onChange(value);
        this.onTouched();
      }),

      this.baseEntity$.subscribe(e => {
        this.baseEntity = e;
        if (!!this.baseEntity && !!this.formulaFieldObj.Formula) {
          this.store.dispatch(new fromFormulaFieldActions.ValidateFormula({ formula: this.formulaFieldObj.Formula, baseEntityId: this.baseEntity?.Id }));
        }
      }),

      this.formulaFieldSuggestions$.subscribe(f => this.fieldSuggestions = f),

      this.validating$.subscribe(result => this.validating = result),

      this.formulaValid$.subscribe(result => {
        this.isValidFormula = result;
        if (this.isValidFormula && this.structuresFormulaForm.controls['FieldName'].valid) {
          this.structuresFormulaForm.controls['Formula'].setValue(this.formulaFieldObj.Formula);
          this.store.dispatch(new fromFormulaFieldActions.SaveFormulaField({ formula: this.getFormulaField(), baseEntityId: this.baseEntity?.Id }));
        }
      }),

      this.formulaChanged.pipe(debounceTime(this.VALIDATE_DEBOUNCE_TIME))
        .subscribe((value) => this.handleFormulaChangedAfterDebounceTime(value))
    );

    this.saveFormulaFieldSuccess$.subscribe(s => this.successfulFormulaSave = s);

    this.savedFormulaField$.subscribe(f => {
      if (!!f) {
        this.formulaFieldObj = cloneDeep(this.mapFormulaFieldObject(f));
        this.structuresFormulaForm.controls['FormulaId'].setValue(f.FormulaId);
      }
    });
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
      'Formula': new FormControl({ value: this.formulaFieldObj.Formula }, [Validators.required]),
      'FieldName': new FormControl({ value: this.formulaFieldObj.FieldName, disabled: false },
        [Validators.required, PfValidators.minLengthTrimWhitespace(1), Validators.maxLength(this.maxFieldNameLength)]),
      'IsPublic': new FormControl({ value: this.formulaFieldObj.IsPublic })
    });
  }

  getFormulaField(): FormulaFieldModalObj {
    return this.formulaFieldObj = {
      FormulaId: this.formulaFieldObj.FormulaId,
      FieldName: this.formControls.FieldName.value,
      Formula: this.formulaFieldObj.Formula,
      IsEditable: true,
      DuplicateAllowed: false,
      IsPublic: this.formulaFieldObj.IsPublic,
      AccessLevel: DataViewAccessLevel.Owner,
      DataType: FieldDataType.Float
    };
  }

  getDefaultFormulaField(): FormulaFieldModalObj {
    return this.formulaFieldObj = {
      FormulaId: null,
      FieldName: null,
      Formula: null,
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

  handleFormulaNameChange(value) {
    if (!!this.formulaFieldObj.Formula && this.isValidFormula) {
      this.store.dispatch(new fromFormulaFieldActions.SaveFormulaField({ formula: this.getFormulaField(), baseEntityId: this.baseEntity?.Id }));
    }
  }

  handlePublicChange() {
    this.formulaFieldObj.IsPublic = !this.formulaFieldObj.IsPublic;
    this.structuresFormulaForm.controls['IsPublic'].setValue(this.formulaFieldObj.IsPublic);
    if (this.isValid()) {
      this.store.dispatch(new fromFormulaFieldActions.SaveFormulaField({ formula: this.getFormulaField(), baseEntityId: this.baseEntity?.Id }));
    }
  }

  handleFormulaChanged(value: string): void {
    this.isWaitingForValidation = true;
    this.formulaChanged.next(value);
    this.store.dispatch(new fromFormulaFieldActions.WaitForFormulaValidation());
  }

  private handleFormulaChangedAfterDebounceTime(value: string): void {
    if (!value) {
      return;
    }
    this.formulaFieldObj.Formula = value;
    if (this.formulaFieldObj.Formula.length !== 0) {
      this.store.dispatch(new fromFormulaFieldActions.ValidateFormula({ formula: value, baseEntityId: this.baseEntity?.Id }));
      this.isWaitingForValidation = false;
    } else {
      this.isWaitingForValidation = true;
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
