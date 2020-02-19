import { Component, OnInit, Output, EventEmitter, OnDestroy, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { DropDownFilterSettings } from '@progress/kendo-angular-dropdowns';
import * as cloneDeep from 'lodash.clonedeep';

import { PfValidators } from 'libs/forms/validators';
import { AsyncStateObj, KendoTypedDropDownItem, GenericKeyValue, CompanyEmployee } from 'libs/models';

import * as fromEmployeeManagementReducer from '../../reducers';
import * as fromEmployeeManagementActions from '../../actions';

@Component({
  selector: 'pf-employee-management',
  templateUrl: './employee-management.component.html',
  styleUrls: ['./employee-management.component.scss'],
})
export class EmployeeManagementComponent implements OnInit, OnDestroy {
  @Input() companyId: number;
  @Output() saveSuccess = new EventEmitter();

  // observables
  showEmployeeForm$: Observable<boolean>;
  loading$: Observable<boolean>;
  saving$: Observable<boolean>;
  errorMessage$: Observable<string>;
  jobs$: Observable<AsyncStateObj<KendoTypedDropDownItem[]>>;
  countries$: Observable<AsyncStateObj<KendoTypedDropDownItem[]>>;
  currencies$: Observable<AsyncStateObj<KendoTypedDropDownItem[]>>;
  departments$: Observable<AsyncStateObj<string[]>>;
  paymarkets$: Observable<AsyncStateObj<KendoTypedDropDownItem[]>>;
  gradeCodes$: Observable<AsyncStateObj<KendoTypedDropDownItem[]>>;
  structureNames$: Observable<AsyncStateObj<KendoTypedDropDownItem[]>>;
  employeesUserDefinedFields$: Observable<AsyncStateObj<GenericKeyValue<string, string>[]>>;

  // subscriptions
  openModalSubscription: Subscription;
  udfsSubscription: Subscription;
  structuresSubscription: Subscription;
  gradeCodesSubscription: Subscription;

  employeeForm: FormGroup;
  initialized = false;
  genders = ['', 'Male', 'Female'];
  rates = ['Annual', 'Hourly'];
  yesNo: KendoTypedDropDownItem[] = [{Name: '', Value: null}, {Name: 'Y', Value: true}, {Name: 'N', Value: false}];

  calculatedTCC: number;
  calculatedTDC: number;

  readonly DEFAULT_MAX_LENGTH = 255;
  readonly HOURLY_CONVERSION_RATE = 2080;

  filterSettings: DropDownFilterSettings = {
    caseSensitive: false,
    operator: 'startsWith'
  };
  get f() { return this.employeeForm.controls; }

  constructor(
      private store: Store<fromEmployeeManagementReducer.State>,
      private formBuilder: FormBuilder
  ) {
    this.showEmployeeForm$ = this.store.select(fromEmployeeManagementReducer.getShowEmployeeForm);
    this.saving$ = this.store.select(fromEmployeeManagementReducer.getSaving);
    this.jobs$ = this.store.select(fromEmployeeManagementReducer.getCompanyJobs);
    this.paymarkets$ = this.store.select(fromEmployeeManagementReducer.getPaymarkets);
    this.currencies$ = this.store.select(fromEmployeeManagementReducer.getCurrencies);
    this.countries$ = this.store.select(fromEmployeeManagementReducer.getCountries);
    this.departments$ = this.store.select(fromEmployeeManagementReducer.getDepartments);
    this.gradeCodes$ = this.store.select(fromEmployeeManagementReducer.getGradeCodes);
    this.structureNames$ = this.store.select(fromEmployeeManagementReducer.getStructureNames);
    this.employeesUserDefinedFields$ = this.store.select(fromEmployeeManagementReducer.getEmployeesUserDefinedFields);
    this.errorMessage$ = this.store.select(fromEmployeeManagementReducer.getErrorMessage);
    this.createForm();
  }

  ngOnInit() {
    this.openModalSubscription = this.showEmployeeForm$.subscribe(isOpen => {
      if (isOpen) {
        if (!this.initialized) {
          this.initializeDroplists();
        }
      }
    });
    this.udfsSubscription = this.employeesUserDefinedFields$.subscribe(userDefinedFieldsAync => {
      if (!!userDefinedFieldsAync && !!userDefinedFieldsAync.obj) {
        for (const userDefinedField of userDefinedFieldsAync.obj) {
          this.employeeForm.addControl(
            userDefinedField.Key,
            new FormControl('', PfValidators.maxLengthTrimWhitespace(this.DEFAULT_MAX_LENGTH)));
        }
      }
    });
    this.gradeCodesSubscription = this.gradeCodes$.subscribe(gradeCodesAsync => {
      if (!!gradeCodesAsync && !!gradeCodesAsync.obj) {
        this.updateControl(gradeCodesAsync.obj, 'GradeCode');
      }
    });
    this.structuresSubscription = this.structureNames$.subscribe(structureNamesAsync => {
      if (!!structureNamesAsync && !!structureNamesAsync.obj) {
        this.updateControl(structureNamesAsync.obj, 'StructureRangeGroupId');
      }
    });
  }

  ngOnDestroy() {
    this.openModalSubscription.unsubscribe();
    this.structuresSubscription.unsubscribe();
    this.udfsSubscription.unsubscribe();
    this.gradeCodesSubscription.unsubscribe();
    this.structuresSubscription.unsubscribe();
  }

  onCancelChanges() {
    this.store.dispatch(new fromEmployeeManagementActions.ShowEmployeeForm(false));
    this.resetForm();
  }

  onSubmit() {
    const employee = this.getEmployeeDataFromForm();
    this.store.dispatch(new fromEmployeeManagementActions.SaveEmployee(employee));
  }

  private createForm(): void {
    this.employeeForm = this.formBuilder.group({
      CompanyEmployeeId: 0,
      CompanyId: 0,
      EmployeeId: ['', [
        PfValidators.required,
        PfValidators.maxLengthTrimWhitespace(50)]],
      ManagerEmployeeId: ['', [
        PfValidators.maxLengthTrimWhitespace(50)]],
      FirstName: ['', [
        PfValidators.maxLengthTrimWhitespace(this.DEFAULT_MAX_LENGTH)]],
      LastName: ['', [
        PfValidators.maxLengthTrimWhitespace(this.DEFAULT_MAX_LENGTH)]],
      EmployeeStatus: ['', [
        PfValidators.maxLengthTrimWhitespace(50)]],
      City: ['', [
        PfValidators.maxLengthTrimWhitespace(this.DEFAULT_MAX_LENGTH)]],
      State: ['', [
        PfValidators.maxLengthTrimWhitespace(this.DEFAULT_MAX_LENGTH)]],
      Zip: ['', [
        PfValidators.maxLengthTrimWhitespace(this.DEFAULT_MAX_LENGTH)]],
      Country: [null, [Validators.required]],
      CompanyJobId: [null, [Validators.required]],
      CompanyPayMarketId: [null, [Validators.required]],
      Rate: [null, [Validators.required]],
      CurrencyCode: [null, [Validators.required]],
      DOB: null,
      DOH: null,
      Facility: ['', [
        PfValidators.maxLengthTrimWhitespace(this.DEFAULT_MAX_LENGTH)]],
      STIElig: null,
      LTIElig: null,
      Department: null,
      Gender: null,
      Base: 0,
      FTE: 1,
      Bonus: 0,
      BonusPct: 0,
      BonusTarget: 0,
      OverrideTCC: false,
      TCC: null,
      TCCCalculated: 0,
      TDCCalculated: 0,
      STI: 0,
      LTI: 0,
      OverrideTDC: false,
      TDC: null,
      BonusTargetPct: 0,
      TargetTCC: 0,
      TargetLTIP: 0,
      TargetTDC: 0,
      Allow: 0,
      TGP: 0,
      Remun: 0,
      Fixed: 0,
      StructureRangeGroupId: null,
      GradeCode: null
    });
  }

  private resetForm() {
    this.employeeForm.reset({
      CompanyEmployeeId: 0,
      Base: 0,
      FTE: 1,
      Bonus: 0,
      BonusPct: 0,
      BonusTarget: 0,
      OverrideTCC: 0,
      TCC: null,
      TCCCalculated: 0,
      STI: 0,
      LTI: 0,
      OverrideTDC: 0,
      TDC: null,
      BonusTargetPct: 0,
      TargetTCC: 0,
      TargetLTIP: 0,
      TargetTDC: 0,
      Allow: 0,
      TGP: 0,
      Remun: 0,
      Fixed: 0
    });
    this.calculatedTCC = 0;
    this.calculatedTDC = 0;
  }

  private initializeDroplists() {
    this.initialized = true;
    this.store.dispatch(new fromEmployeeManagementActions.LoadCompanyJobs());
    this.store.dispatch(new fromEmployeeManagementActions.LoadPaymarkets());
    this.store.dispatch(new fromEmployeeManagementActions.LoadCountries());
    this.store.dispatch(new fromEmployeeManagementActions.LoadCurrencies());
    this.store.dispatch(new fromEmployeeManagementActions.LoadDepartments());
    this.store.dispatch(new fromEmployeeManagementActions.GetCustomFields({ companyId: this.companyId }));
  }

  public loadGrades() {
    const jobId = this.employeeForm.get('CompanyJobId').value || 0;
    const paymarketId = this.employeeForm.get('CompanyPayMarketId').value || 0;
    const structureId = this.employeeForm.get('StructureRangeGroupId').value || 0;
    this.store.dispatch(new fromEmployeeManagementActions.LoadGradeCodes({ jobId: jobId, paymarketId: paymarketId, companyStructureId: structureId }));
  }

  public loadStructures() {
    const jobId = this.employeeForm.get('CompanyJobId').value || 0;
    const paymarketId = this.employeeForm.get('CompanyPayMarketId').value || 0;
    this.store.dispatch(new fromEmployeeManagementActions.LoadStructures({ jobId: jobId, paymarketId: paymarketId }));
  }

  public onJobChanges() {
    this.loadGrades();
    this.loadStructures();
  }

  public onPaymarketChanges() {
    this.loadGrades();
    this.loadStructures();
  }

  public onStructureChanges() {
    this.loadGrades();
  }

  public onCompChanges() {
    this.calculateTCC();
    this.calculateTDC();
  }

  private calculateTCC() {
    const formValue = this.getCalculationValues();
    this.calculatedTCC = ((formValue.Base * formValue.Conversion) + formValue.Bonus
      + formValue.STI) / formValue.FTE;
  }

  private calculateTDC() {
    const formValue = this.getCalculationValues();
    this.calculatedTDC = ((formValue.Base * formValue.Conversion) + formValue.Bonus
      + formValue.STI + formValue.LTI) / formValue.FTE;
  }

  private getCalculationValues() {
    const formValue = this.employeeForm.value;
    return {
      FTE: formValue.FTE || 1,
      Base: formValue.Base || 0,
      Bonus: formValue.Bonus || 0,
      STI: formValue.STI || 0,
      LTI: formValue.LTI || 0,
      Conversion: formValue.Rate === 'Hourly' ? this.HOURLY_CONVERSION_RATE : 1,
    };
  }

  private getEmployeeDataFromForm(): CompanyEmployee {
    const employee: CompanyEmployee = cloneDeep(this.employeeForm.value);
    employee.OverrideTCC = employee.TCC !== null;
    employee.OverrideTDC = employee.TDC !== null;
    employee.TCCCalculated = this.calculatedTCC;
    employee.TDCCalculated = this.calculatedTDC;
    employee.CompanyId = this.companyId;
    return employee;
  }

  private updateControl(list: KendoTypedDropDownItem[], controlName: string): void {
    if (!list.length) {
      this.employeeForm.controls[controlName].disable();
    } else {
      this.employeeForm.controls[controlName].enable();
    }
    const value = this.employeeForm.controls[controlName].value;
    if (!list.some(x => x.Value === value)) {
      this.employeeForm.controls[controlName].setValue(null);
    }
  }
}
