import { Component, OnInit, Output, EventEmitter, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

import { Observable, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';
import { ComboBoxComponent, DropDownFilterSettings } from '@progress/kendo-angular-dropdowns';
import * as cloneDeep from 'lodash.clonedeep';
import { IntlService } from '@progress/kendo-angular-intl';

import * as fromRootState from 'libs/state/state';
import { PfValidators } from 'libs/forms/validators';
import { AsyncStateObj, KendoTypedDropDownItem, GenericKeyValue, CompanyEmployee, UserContext, PfConstants } from 'libs/models';

import * as fromEmployeeManagementReducer from '../../reducers';
import * as fromEmployeeManagementActions from '../../actions';
import { EmployeeValidation } from '../../models/employee-validation.model';
import { Job } from '../../models';

@Component({
  selector: 'pf-employee-management',
  templateUrl: './employee-management.component.html',
  styleUrls: ['./employee-management.component.scss']
})
export class EmployeeManagementComponent implements OnInit, OnDestroy, AfterViewInit {
  @Output() saveSuccess = new EventEmitter();
  @ViewChild('jobsCombobox', { static: true }) jobsCombobox: ComboBoxComponent;
  @ViewChild('paymarketCombobox', { static: true }) paymarketCombobox: ComboBoxComponent;
  @ViewChild('currencyCombobox', { static: true }) currencyCombobox: ComboBoxComponent;
  @ViewChild('workCountryCombobox', { static: true }) workCountryCombobox: ComboBoxComponent;
  @ViewChild('departmentCombobox', { static: true }) departmentCombobox: ComboBoxComponent;

  // observables
  userContext$: Observable<UserContext>;
  showEmployeeForm$: Observable<boolean>;
  loading$: Observable<boolean>;
  saving$: Observable<boolean>;
  errorMessage$: Observable<string>;
  jobs$: Observable<AsyncStateObj<Job[]>>;
  countries$: Observable<AsyncStateObj<KendoTypedDropDownItem[]>>;
  currencies$: Observable<AsyncStateObj<KendoTypedDropDownItem[]>>;
  departments$: Observable<AsyncStateObj<string[]>>;
  paymarkets$: Observable<AsyncStateObj<KendoTypedDropDownItem[]>>;
  gradeCodes$: Observable<AsyncStateObj<KendoTypedDropDownItem[]>>;
  structureNames$: Observable<AsyncStateObj<KendoTypedDropDownItem[]>>;
  employeesUserDefinedFields$: Observable<AsyncStateObj<GenericKeyValue<string, string>[]>>;
  employee$: Observable<AsyncStateObj<CompanyEmployee>>;
  employeeValidationAsync$: Observable<AsyncStateObj<EmployeeValidation>>;

  // subscriptions
  openModalSubscription: Subscription;
  udfsSubscription: Subscription;
  structuresSubscription: Subscription;
  gradeCodesSubscription: Subscription;
  employeeSubscription: Subscription;
  userContextSubscription: Subscription;
  jobsSubscription: Subscription;
  filterChangeSubscription: Subscription;
  employeeValidationSubscription: Subscription;

  employeeForm: FormGroup;
  initialized = false;
  genders = ['', 'Male', 'Female'];
  rates = ['Annual', 'Hourly'];
  yesNo: KendoTypedDropDownItem[] = [{Name: '', Value: null}, {Name: 'Y', Value: true}, {Name: 'N', Value: false}];
  filteredJobs: Job[];
  allJobs: Job[];
  calculatedTCC: number;
  calculatedTDC: number;
  jobCode: string;

  readonly DEFAULT_MAX_LENGTH = 255;
  readonly HOURLY_CONVERSION_RATE = 2080;

  filterSettings: DropDownFilterSettings = {
    caseSensitive: false,
    operator: 'contains'
  };
  companyId: number;
  employee: CompanyEmployee;
  udfFields: GenericKeyValue<string, string>[];
  employeeValidationAsync: AsyncStateObj<EmployeeValidation>;

  get f() { return this.employeeForm.controls; }

  constructor(
    private rootStore: Store<fromRootState.State>,
    private store: Store<fromEmployeeManagementReducer.State>,
    private formBuilder: FormBuilder,
    private intlService: IntlService
  ) {
    this.userContext$ = this.rootStore.pipe(select(fromRootState.getUserContext));
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
    this.employee$ = this.store.select(fromEmployeeManagementReducer.getEmployee);
    this.employeeValidationAsync$ = this.store.select(fromEmployeeManagementReducer.getEmployeeValidationAsync);
  }

  ngOnInit() {
    this.userContextSubscription = this.userContext$.subscribe(uc => {
      if (!!uc) {
        this.companyId = uc.CompanyId;
        this.createForm();
        this.store.dispatch(new fromEmployeeManagementActions.GetCustomFields({ companyId: uc.CompanyId }));
      }
    });
    this.openModalSubscription = this.showEmployeeForm$.subscribe(isOpen => {
      if (isOpen) {
        if (!this.initialized) {
          this.initializeDroplists();
        }
      }
    });
    this.udfsSubscription = this.employeesUserDefinedFields$.subscribe(userDefinedFieldsAync => {
      if (!!userDefinedFieldsAync && !!userDefinedFieldsAync.obj) {
        this.udfFields = userDefinedFieldsAync.obj;
        for (const userDefinedField of userDefinedFieldsAync.obj) {
          this.employeeForm.addControl(
            userDefinedField.Key,
            new FormControl('', PfValidators.maxLengthTrimWhitespace(this.DEFAULT_MAX_LENGTH)));
        }
      }
    });
    this.gradeCodesSubscription = this.gradeCodes$.subscribe(gradeCodesAsync => {
      if (!!gradeCodesAsync && !gradeCodesAsync.loading && !!gradeCodesAsync.obj) {
        this.updateControl(gradeCodesAsync.obj, 'GradeCode');
      }
    });
    this.structuresSubscription = this.structureNames$.subscribe(structureNamesAsync => {
      if (!!structureNamesAsync && !structureNamesAsync.loading && !!structureNamesAsync.obj) {
        this.updateControl(structureNamesAsync.obj, 'StructureRangeGroupId');
        this.loadGrades();
      }
    });
    this.employeeSubscription = this.employee$.subscribe(asyncObj => {
      if (!!this.employeeForm && !!asyncObj && asyncObj.loading) {
        this.resetForm();
      } else {
        this.employee = asyncObj.obj;
        this.updateForm();
      }
    });
    this.jobsSubscription = this.jobs$.subscribe(jobs => {
      if (!!jobs && !jobs.loading && !!jobs.obj) {
        this.filteredJobs = jobs.obj;
        this.allJobs = jobs.obj;
      }
    });
    this.employeeValidationSubscription = this.employeeValidationAsync$.subscribe(asyncObj => this.employeeValidationAsync = asyncObj);
  }

  ngAfterViewInit(): void {
    this.filterChangeSubscription = this.jobsCombobox.filterChange.asObservable().pipe(
      debounceTime(PfConstants.DEBOUNCE_DELAY),
      distinctUntilChanged())
      .subscribe(searchTerm => {
        if (!!searchTerm) {
          this.filteredJobs = this.allJobs.filter(x => x.DisplayName.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1);
        } else {
          this.filteredJobs = this.allJobs;
        }
      });
  }

  ngOnDestroy() {
    this.openModalSubscription.unsubscribe();
    this.structuresSubscription.unsubscribe();
    this.udfsSubscription.unsubscribe();
    this.gradeCodesSubscription.unsubscribe();
    this.structuresSubscription.unsubscribe();
    this.userContextSubscription.unsubscribe();
    this.employeeSubscription.unsubscribe();
    this.filterChangeSubscription.unsubscribe();
    this.jobsSubscription.unsubscribe();
    this.employeeValidationSubscription.unsubscribe();
  }

  public get modalTitle(): string {
    return !!this.employee ? 'Edit Employee' : 'Add Employee';
  }

  public employeeValidationFailed(key: string): boolean {
    return (this.employeeValidationAsync && this.employeeValidationAsync.obj &&
      this.employeeValidationAsync.obj.IsValid === false &&
      (this.employeeValidationAsync.obj.FieldKeys.indexOf(key) > -1));
  }

  onCancelChanges() {
    this.store.dispatch(new fromEmployeeManagementActions.ShowEmployeeForm(false));
    this.resetForm();
  }

  onSubmit() {
    const employee = this.getEmployeeDataFromForm();
    this.store.dispatch(new fromEmployeeManagementActions.ValidateEmployeeKeys(employee));
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
      StructureRangeGroupId: [null, [Validators.required]],
      GradeCode: [null, [Validators.required]]
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
    this.jobsCombobox.filterChange.emit('');
    this.paymarketCombobox.filterChange.emit('');
    this.currencyCombobox.filterChange.emit('');
    this.workCountryCombobox.filterChange.emit('');
    this.departmentCombobox.filterChange.emit('');
    this.updateControl([], 'StructureRangeGroupId');
    this.updateControl([], 'GradeCode');
  }

  private initializeDroplists() {
    this.initialized = true;
    this.store.dispatch(new fromEmployeeManagementActions.LoadCompanyJobs());
    this.store.dispatch(new fromEmployeeManagementActions.LoadPaymarkets());
    this.store.dispatch(new fromEmployeeManagementActions.LoadCountries());
    this.store.dispatch(new fromEmployeeManagementActions.LoadCurrencies());
    this.store.dispatch(new fromEmployeeManagementActions.LoadDepartments());
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

  public onJobChanges(companyJobId: number) {
    if (companyJobId) {
      const selectedJob = this.filteredJobs.find(j => j.CompanyJobId === companyJobId);
      this.jobCode = selectedJob ? selectedJob.JobCode : null;
    }
    this.loadStructures();
  }

  public onPaymarketChanges() {
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
    const employee: CompanyEmployee = cloneDeep(this.employeeForm.getRawValue());
    employee.OverrideTCC = employee.TCC !== null;
    employee.OverrideTDC = employee.TDC !== null;
    employee.TCCCalculated = this.calculatedTCC;
    employee.TDCCalculated = this.calculatedTDC;
    employee.CompanyId = this.companyId;
    employee.JobCode = this.jobCode;
    if (!!this.employee) {
      employee.CompanyEmployeeId = this.employee.CompanyEmployeeId;
    }
    return employee;
  }

  private updateControl(list: KendoTypedDropDownItem[], controlName: string): void {
    let selectedValue = !!list.length ? list[0].Value : null;
    if (!!this.employee && this.employee[controlName] && list.some(x => x.Value === this.employee[controlName])) {
        selectedValue = this.employee[controlName];
    }
    this.employeeForm.controls[controlName].setValue(selectedValue);
    if (!list.length || list.length === 1) {
      this.employeeForm.controls[controlName].disable();
    } else {
      this.employeeForm.controls[controlName].enable();
    }
  }

  private updateForm(): void {
    if (!!this.employeeForm && !!this.employee) {
      const rate: string = this.employee.Rate.toLowerCase() === 'annual'
        ? 'Annual'
        : 'Hourly';
      this.employeeForm.patchValue({
        EmployeeId: this.employee.EmployeeId,
        ManagerEmployeeId: this.employee.ManagerEmployeeId,
        FirstName: this.employee.FirstName,
        LastName: this.employee.LastName,
        EmployeeStatus: this.employee.EmployeeStatus,
        City: this.employee.City,
        State: this.employee.State,
        Zip: this.employee.Zip,
        Country: this.employee.Country,
        CompanyJobId: this.employee.CompanyJobId,
        CompanyPayMarketId: this.employee.CompanyPayMarketId,
        Rate: rate,
        CurrencyCode: this.employee.CurrencyCode,
        DOB: this.convertToDate(this.employee.DOB),
        DOH: this.convertToDate(this.employee.DOH),
        Facility: this.employee.Facility,
        STIElig: this.employee.STIElig,
        LTIElig: this.employee.LTIElig,
        Department: this.employee.Department,
        Gender: this.employee.Gender,
        Base: this.employee.Base,
        FTE: this.employee.FTE,
        Bonus: this.employee.Bonus,
        BonusPct: this.employee.BonusPct,
        BonusTarget: this.employee.BonusTarget,
        OverrideTCC: this.employee.OverrideTCC,
        TCC: this.employee.TCC,
        TCCCalculated: this.employee.TCCCalculated,
        TDCCalculated: this.employee.TDCCalculated,
        STI: this.employee.STI,
        LTI: this.employee.LTI,
        OverrideTDC: this.employee.OverrideTDC,
        TDC: this.employee.TDC,
        BonusTargetPct: this.employee.BonusTargetPct,
        TargetTCC: this.employee.TargetTCC,
        TargetLTIP: this.employee.TargetLTIP,
        TargetTDC: this.employee.TargetTDC,
        Allow: this.employee.Allow,
        TGP: this.employee.TGP,
        Remun: this.employee.Remun,
        Fixed: this.employee.Fixed,
        StructureRangeGroupId: this.employee.StructureRangeGroupId,
        GradeCode: this.employee.GradeCode
      });
      this.updateUDFFields();
      this.loadStructures();
      this.jobCode = this.employee.JobCode;
    }
  }

  private updateUDFFields(): void {
    for (const udf of this.udfFields) {
      this.employeeForm.controls[udf.Key].patchValue(this.employee[udf.Key]);
    }
  }

  private convertToDate(date: Date): Date {
    return date ? this.intlService.parseDate(date.toString()) : null;
  }
}
