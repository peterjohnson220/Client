import { Action } from '@ngrx/store';
import { CompanyEmployee, GenericKeyValue, KendoTypedDropDownItem } from 'libs/models';

export const HANDLE_API_ERROR = '[EmployeeManagement] Handle API Error';
export const SHOW_EMPLOYEE_FORM = '[EmployeeManagement] Show Employee Form';
export const SAVE_EMPLOYEE = '[EmployeeManagement] Save Employee';
export const SAVE_EMPLOYEE_SUCCESS = '[EmployeeManagement] Save Employee Success';
export const SAVE_EMPLOYEE_ERROR = '[EmployeeManagement] Save Employee Error';
export const LOAD_COMPANYJOBS = '[EmployeeManagement] Load Company Jobs';
export const LOAD_COMPANYJOBS_SUCCESS = '[EmployeeManagement] Load Company Jobs Success';
export const LOAD_COMPANYJOBS_ERROR = '[EmployeeManagement] Load Company Jobs Error';
export const LOAD_PAYMARKETS = '[EmployeeManagement] Load Pay Markets';
export const LOAD_PAYMARKETS_SUCCESS = '[EmployeeManagement] Load Pay Markets Success';
export const LOAD_PAYMARKETS_ERROR = '[EmployeeManagement] Load Pay Markets Error';
export const LOAD_COUNTRIES = '[EmployeeManagement] Load Countries';
export const LOAD_COUNTRIES_SUCCESS = '[EmployeeManagement] Load Countries Success';
export const LOAD_COUNTRIES_ERROR = '[EmployeeManagement] Load Countries Error';
export const LOAD_CURRENCIES = '[EmployeeManagement] Load Currencies';
export const LOAD_CURRENCIES_SUCCESS = '[EmployeeManagement] Load Currencies Success';
export const LOAD_CURRENCIES_ERROR = '[EmployeeManagement] Load Currencies Error';
export const LOAD_DEPARTMENTS = '[EmployeeManagement] Load Departments';
export const LOAD_DEPARTMENTS_SUCCESS = '[EmployeeManagement] Load Departments Success';
export const LOAD_DEPARTMENTS_ERROR = '[EmployeeManagement] Load Departments Error';
export const LOAD_GRADE_CODES = '[EmployeeManagement] Load Grade Codes';
export const LOAD_GRADE_CODES_SUCCESS = '[EmployeeManagement] Load Grade Codes Success';
export const LOAD_GRADE_CODES_ERROR = '[EmployeeManagement] Load Grade Codes Error';
export const LOAD_STRUCTURES = '[EmployeeManagement] Load Structures';
export const LOAD_STRUCTURES_SUCCESS = '[EmployeeManagement] Load Structures Success';
export const LOAD_STRUCTURES_ERROR = '[EmployeeManagement] Load Structures Error';
export const GET_CUSTOM_FIELDS = '[EmployeeManagement] Get Custom Fields';
export const GET_CUSTOM_FIELDS_SUCCESS = '[EmployeeManagement] Get Custom Fields Success';
export const GET_CUSTOM_FIELDS_ERROR = '[EmployeeManagement] Get Custom Fields Error';

export class ShowEmployeeForm implements Action {
  readonly type = SHOW_EMPLOYEE_FORM;
  constructor(public payload: boolean) { }
}

export class SaveEmployee implements Action {
  readonly type = SAVE_EMPLOYEE;
  constructor(public payload: CompanyEmployee) { }
}

export class SaveEmployeeSuccess implements Action {
  readonly type = SAVE_EMPLOYEE_SUCCESS;
  constructor() { }
}

export class SaveEmployeeError implements Action {
  readonly type = SAVE_EMPLOYEE_ERROR;
  constructor(public payload: string) { }
}

export class HandleApiError implements Action {
  readonly type = HANDLE_API_ERROR;
  constructor(public payload: string) { }
}

export class LoadCompanyJobs implements Action {
  readonly type = LOAD_COMPANYJOBS;
  constructor() { }
}

export class LoadCompanyJobsSuccess implements Action {
  readonly type = LOAD_COMPANYJOBS_SUCCESS;
  constructor(public payload: KendoTypedDropDownItem[]) { }
}

export class LoadCompanyJobsError implements Action {
  readonly type = LOAD_COMPANYJOBS_ERROR;
  constructor() { }
}

export class LoadPaymarkets implements Action {
  readonly type = LOAD_PAYMARKETS;
  constructor() { }
}

export class LoadPaymarketsSuccess implements Action {
  readonly type = LOAD_PAYMARKETS_SUCCESS;
  constructor(public payload: KendoTypedDropDownItem[]) { }
}

export class LoadPaymarketsError implements Action {
  readonly type = LOAD_PAYMARKETS_ERROR;
  constructor() { }
}

export class LoadCountries implements Action {
  readonly type = LOAD_COUNTRIES;
  constructor() { }
}

export class LoadCountriesSuccess implements Action {
  readonly type = LOAD_COUNTRIES_SUCCESS;
  constructor(public payload: KendoTypedDropDownItem[]) { }
}

export class LoadCountriesError implements Action {
  readonly type = LOAD_COUNTRIES_ERROR;
  constructor() { }
}

export class LoadCurrencies implements Action {
  readonly type = LOAD_CURRENCIES;
  constructor() { }
}

export class LoadCurrenciesSuccess implements Action {
  readonly type = LOAD_CURRENCIES_SUCCESS;
  constructor(public payload: KendoTypedDropDownItem[]) { }
}

export class LoadCurrenciesError implements Action {
  readonly type = LOAD_CURRENCIES_ERROR;
  constructor() { }
}

export class LoadDepartments implements Action {
  readonly type = LOAD_DEPARTMENTS;
  constructor() { }
}

export class LoadDepartmentsSuccess implements Action {
  readonly type = LOAD_DEPARTMENTS_SUCCESS;
  constructor(public payload: string[]) { }
}

export class LoadDepartmentsError implements Action {
  readonly type = LOAD_DEPARTMENTS_ERROR;
  constructor() { }
}

export class LoadGradeCodes implements Action {
  readonly type = LOAD_GRADE_CODES;
  constructor(public payload: { jobId: number, paymarketId: number, companyStructureId: number }) { }
}

export class LoadGradeCodesSuccess implements Action {
  readonly type = LOAD_GRADE_CODES_SUCCESS;
  constructor(public payload: KendoTypedDropDownItem[]) { }
}

export class LoadGradeCodesError implements Action {
  readonly type = LOAD_GRADE_CODES_ERROR;
  constructor() { }
}

export class LoadStructures implements Action {
  readonly type = LOAD_STRUCTURES;
  constructor(public payload: { jobId: number, paymarketId: number }) { }
}

export class LoadStructuresSuccess implements Action {
  readonly type = LOAD_STRUCTURES_SUCCESS;
  constructor(public payload: KendoTypedDropDownItem[]) { }
}

export class LoadStructuresError implements Action {
  readonly type = LOAD_STRUCTURES_ERROR;
  constructor() { }
}

export class GetCustomFields implements Action {
  readonly type = GET_CUSTOM_FIELDS;

  constructor(public payload: { companyId: number }) {}
}

export class GetCustomFieldsSuccess implements Action {
  readonly type = GET_CUSTOM_FIELDS_SUCCESS;

  constructor(public payload: GenericKeyValue<string, string>[]) {}
}

export class GetCustomFieldsError implements Action {
  readonly type = GET_CUSTOM_FIELDS_ERROR;

  constructor() {}
}

export type Actions
  = HandleApiError
  | ShowEmployeeForm
  | SaveEmployee
  | SaveEmployeeSuccess
  | SaveEmployeeError
  | LoadCompanyJobs
  | LoadCompanyJobsSuccess
  | LoadCompanyJobsError
  | LoadPaymarkets
  | LoadPaymarketsSuccess
  | LoadPaymarketsError
  | LoadDepartments
  | LoadDepartmentsSuccess
  | LoadDepartmentsError
  | LoadPaymarkets
  | LoadPaymarketsSuccess
  | LoadPaymarketsError
  | LoadCountries
  | LoadCountriesSuccess
  | LoadCountriesError
  | LoadCurrencies
  | LoadCurrenciesSuccess
  | LoadCurrenciesError
  | LoadStructures
  | LoadStructuresSuccess
  | LoadStructuresError
  | LoadGradeCodes
  | LoadGradeCodesSuccess
  | LoadGradeCodesError
  | GetCustomFields
  | GetCustomFieldsSuccess
  | GetCustomFieldsError;
