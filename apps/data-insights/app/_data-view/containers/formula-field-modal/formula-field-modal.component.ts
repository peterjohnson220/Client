import { Component, ViewChild, OnInit, Input, OnDestroy, SimpleChanges, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { PfValidators } from 'libs/forms/validators';

import { Store, select } from '@ngrx/store';
import { Observable, Subscription, Subject } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

import * as fromDataViewMainReducer from '../../reducers';
import * as fromFormulaFieldActions from '../../actions/formula-field-modal.actions';
import { FormulaFieldModalObj } from '../../models';
import { FormulaEditorComponent } from '../../components';

@Component({
  selector: 'pf-formula-field-modal',
  templateUrl: './formula-field-modal.component.html',
  styleUrls: ['./formula-field-modal.component.scss']
})
export class FormulaFieldModalComponent implements OnInit, OnDestroy, OnChanges {
  @Input() baseEntityId: number;
  @Input() fieldSuggestions: string[];
  @Input() modalData: FormulaFieldModalObj;

  formulaValid$: Observable<boolean>;
  validating$: Observable<boolean>;
  saving$: Observable<boolean>;
  savingSuccess$: Observable<boolean>;
  savingError$: Observable<boolean>;
  savingErrorMessage$: Observable<string>;
  formulaChanged: Subject<string> = new Subject<string>();

  formulaChangedSubscription: Subscription;

  formulaValidSubscription: Subscription;
  validatingSubscription: Subscription;
  savingSubscription: Subscription;
  savingSuccessSubscription: Subscription;
  savingErrorSubscription: Subscription;

  @ViewChild('formulaFieldModal', { static: true }) public formulaFieldModal: any;
  @ViewChild(FormulaEditorComponent, { static: true }) public formulaEditor: FormulaEditorComponent;
  readonly maxFieldNameLength = 255;
  readonly VALIDATE_DEBOUNCE_TIME = 2000;
  saving: boolean;
  savingSuccess: boolean;
  formulaFieldForm: FormGroup;
  title: string;
  fieldName: string;
  formula: string;
  isValidFormula: boolean;
  validating: boolean;
  showErrorMessages: boolean;
  isWaitingForValidation: boolean;

  constructor(
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private store: Store<fromDataViewMainReducer.State>
  ) {
    this.validating$ = this.store.pipe(select(fromDataViewMainReducer.getFormulaValidating));
    this.formulaValid$ = this.store.pipe(select(fromDataViewMainReducer.getFormulaValid));
    this.saving$ = this.store.pipe(select(fromDataViewMainReducer.getFormulaSaving));
    this.savingSuccess$ = this.store.pipe(select(fromDataViewMainReducer.getFormulaSavingSuccess));
    this.savingError$ = this.store.pipe(select(fromDataViewMainReducer.getFormulaSavingError));
    this.savingErrorMessage$ = this.store.pipe(select(fromDataViewMainReducer.getFormulaSavingErrorMessage));
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!!changes && !!changes.modalData && !!changes.modalData.currentValue) {
      this.updateForm();
    }
  }

  ngOnInit(): void {
    this.formulaValidSubscription = this.formulaValid$.subscribe(result => this.isValidFormula = result);
    this.validatingSubscription = this.validating$.subscribe(result => this.validating = result);
    this.savingSubscription = this.saving$.subscribe(result => this.saving = result);
    this.savingSuccessSubscription = this.savingSuccess$.subscribe(result => this.handleSavingSuccess(result));
    this.savingErrorSubscription = this.savingError$.subscribe(result => this.handleSavingError(result));
    this.formulaChangedSubscription = this.formulaChanged
      .pipe(
        debounceTime(this.VALIDATE_DEBOUNCE_TIME),
        distinctUntilChanged())
          .subscribe((value) => this.handleFormulaChangedAfterDebounceTime(value));
    this.createForm();
  }

  ngOnDestroy(): void {
    this.formulaValidSubscription.unsubscribe();
    this.validatingSubscription.unsubscribe();
    this.savingSubscription.unsubscribe();
    this.savingSuccessSubscription.unsubscribe();
    this.savingErrorSubscription.unsubscribe();
    this.formulaChangedSubscription.unsubscribe();
  }

  open(): void {
    this.modalService.open(this.formulaFieldModal, { backdrop: 'static', centered: true, size: 'lg' });
  }

  close(): void {
    this.modalService.dismissAll();
    this.formulaChanged.next(null);
  }

  handleSaveClicked(): void {
    const payload: FormulaFieldModalObj = {
      FieldName: this.formulaFieldForm.value.fieldName,
      Formula: this.formula,
      FormulaId: this.modalData ? this.modalData.FormulaId : null
    };
    this.store.dispatch(new fromFormulaFieldActions.SaveFormulaField(payload));
  }

  handleFormulaChanged(value: string): void {
    this.isWaitingForValidation = true;
    this.formulaChanged.next(value);
  }

  public get saveDisabled(): boolean {
    if (!this.formulaFieldForm) {
      return this.saving;
    }

    return this.saving || !this.formulaFieldForm.valid || !this.isValidFormula || this.isWaitingForValidation;
  }

  public get isEditable(): boolean {
    return !!this.modalData && this.modalData.IsEditable;
  }

  private createForm(): void {
    this.formulaFieldForm = this.formBuilder.group({
      fieldName: [
        { value: this.fieldName, disabled: !this.isEditable },
        [PfValidators.required, Validators.maxLength(this.maxFieldNameLength)]]
    });
  }

  private updateForm(): void {
    this.title = this.modalData ? this.modalData.Title : '';
    this.fieldName = this.modalData ? this.modalData.FieldName : '';
    this.saving = false;
    if (!!this.modalData && !!this.formulaFieldForm) {
      this.formulaFieldForm.reset({
        fieldName: { value: this.fieldName, disabled: !this.isEditable }
      });
      this.handleFormulaChanged(this.modalData.Formula);
    }
  }

  private handleSavingSuccess(result: boolean) {
    if (result) {
      this.close();
    }
  }

  private handleSavingError(result: boolean) {
    this.showErrorMessages = result;
  }

  private handleFormulaChangedAfterDebounceTime(value: string): void {
    if (!value) {
      return;
    }
    this.showErrorMessages = false;
    this.formula = value;
    if (this.formula.length !== 0) {
      this.store.dispatch(new fromFormulaFieldActions.ValidateFormula({ formula: value, baseEntityId: this.baseEntityId }));
      this.isWaitingForValidation = false;
    } else {
      this.isWaitingForValidation = true;
    }
  }

}

