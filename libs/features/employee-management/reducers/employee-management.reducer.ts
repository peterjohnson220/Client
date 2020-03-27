import * as cloneDeep from 'lodash.clonedeep';

import { AsyncStateObj, generateDefaultAsyncStateObj, KendoTypedDropDownItem, GenericKeyValue, CompanyEmployee } from 'libs/models';

import * as fromEmployeeManagementActions from '../actions/employee-management.actions';
import { EmployeeValidation, Job, Structure } from '../models';

export interface State {
  errorMessage: string;
  showEmployeeForm: boolean;
  saving: boolean;
  jobs: AsyncStateObj<Job[]>;
  paymarkets: AsyncStateObj<KendoTypedDropDownItem[]>;
  currencies: AsyncStateObj<KendoTypedDropDownItem[]>;
  countries: AsyncStateObj<KendoTypedDropDownItem[]>;
  departments: AsyncStateObj<string[]>;
  structureGrades: AsyncStateObj<KendoTypedDropDownItem[]>;
  structures: AsyncStateObj<Structure[]>;
  employeesUserDefinedFields: AsyncStateObj<GenericKeyValue<string, string>[]>;
  employee: AsyncStateObj<CompanyEmployee>;
  employeeValidation: AsyncStateObj<EmployeeValidation>;
  moreJobsToLoad: boolean;
}

export const initialState: State = {
  errorMessage: '',
  showEmployeeForm: false,
  saving: false,
  jobs: generateDefaultAsyncStateObj<Job[]>([]),
  paymarkets: generateDefaultAsyncStateObj<KendoTypedDropDownItem[]>([]),
  currencies: generateDefaultAsyncStateObj<KendoTypedDropDownItem[]>([]),
  countries: generateDefaultAsyncStateObj<KendoTypedDropDownItem[]>([]),
  departments: generateDefaultAsyncStateObj<string[]>([]),
  structureGrades: generateDefaultAsyncStateObj<KendoTypedDropDownItem[]>([]),
  structures: generateDefaultAsyncStateObj<Structure[]>([]),
  employeesUserDefinedFields: generateDefaultAsyncStateObj<GenericKeyValue<string, string>[]>([]),
  employee: generateDefaultAsyncStateObj<CompanyEmployee>(null),
  employeeValidation: generateDefaultAsyncStateObj<EmployeeValidation>(null),
  moreJobsToLoad: true
};


export function reducer(state = initialState, action: fromEmployeeManagementActions.Actions): State {
  switch (action.type) {
    case fromEmployeeManagementActions.SHOW_EMPLOYEE_FORM: {
      return {
        ...state,
        showEmployeeForm: action.payload,
        employeeValidation: generateDefaultAsyncStateObj<EmployeeValidation>(null),
        errorMessage: null
      };
    }
    case fromEmployeeManagementActions.SAVE_EMPLOYEE:
    case fromEmployeeManagementActions.UPDATE_EMPLOYEE: {
      return {
        ...state,
        saving: true,
        errorMessage: null
      };
    }
    case fromEmployeeManagementActions.SAVE_EMPLOYEE_SUCCESS: {
      return {
        ...state,
        saving: false,
        showEmployeeForm: false
      };
    }
    case fromEmployeeManagementActions.SAVE_EMPLOYEE_ERROR: {
      return {
        ...state,
        saving: false,
        showEmployeeForm: true,
        errorMessage: action.payload
      };
    }
    case fromEmployeeManagementActions.LOAD_COMPANYJOB_BY_ID:
    case fromEmployeeManagementActions.LOAD_COMPANYJOBS: {
      const jobsClone = cloneDeep(state.jobs);
      jobsClone.loading = true;
      return {
        ...state,
        jobs: jobsClone
      };
    }
    case fromEmployeeManagementActions.LOAD_COMPANYJOBS_SUCCESS: {
      const jobsClone = cloneDeep(state.jobs);
      jobsClone.loading = false;
      jobsClone.obj = action.payload.jobs;
      return {
        ...state,
        jobs: jobsClone,
        moreJobsToLoad: action.payload.moreData
      };
    }
    case fromEmployeeManagementActions.LOAD_MORE_COMPANYJOBS_SUCCESS: {
      const jobsClone = cloneDeep(state.jobs);
      jobsClone.loading = false;
      jobsClone.obj = jobsClone.obj.concat(action.payload.jobs);
      return {
        ...state,
        jobs: jobsClone,
        moreJobsToLoad: action.payload.moreData
      };
    }
    case fromEmployeeManagementActions.LOAD_COMPANYJOBS_ERROR: {
      const jobsClone = cloneDeep(state.jobs);
      jobsClone.loading = false;
      return {
        ...state,
        jobs: jobsClone
      };
    }
    case fromEmployeeManagementActions.LOAD_COUNTRIES: {
      const countriesClone = cloneDeep(state.countries);
      countriesClone.loading = true;
      return {
        ...state,
        countries: countriesClone
      };
    }
    case fromEmployeeManagementActions.LOAD_COUNTRIES_SUCCESS: {
      const countriesClone = cloneDeep(state.countries);
      countriesClone.loading = false;
      countriesClone.obj = action.payload;
      return {
        ...state,
        countries: countriesClone
      };
    }
    case fromEmployeeManagementActions.LOAD_COUNTRIES_ERROR: {
      const countriesClone = cloneDeep(state.countries);
      countriesClone.loading = false;
      return {
        ...state,
        countries: countriesClone
      };
    }
    case fromEmployeeManagementActions.LOAD_CURRENCIES: {
      const currenciesClone = cloneDeep(state.currencies);
      currenciesClone.loading = true;
      return {
        ...state,
        currencies: currenciesClone
      };
    }
    case fromEmployeeManagementActions.LOAD_CURRENCIES_SUCCESS: {
      const currenciesClone = cloneDeep(state.currencies);
      currenciesClone.loading = false;
      currenciesClone.obj = action.payload;
      return {
        ...state,
        currencies: currenciesClone
      };
    }
    case fromEmployeeManagementActions.LOAD_CURRENCIES_ERROR: {
      const currenciesClone = cloneDeep(state.currencies);
      currenciesClone.loading = false;
      return {
        ...state,
        currencies: currenciesClone
      };
    }
    case fromEmployeeManagementActions.LOAD_DEPARTMENTS: {
      const departmentsClone = cloneDeep(state.departments);
      departmentsClone.loading = true;
      return {
        ...state,
        departments: departmentsClone
      };
    }
    case fromEmployeeManagementActions.LOAD_DEPARTMENTS_SUCCESS: {
      const departmentsClone = cloneDeep(state.departments);
      departmentsClone.loading = false;
      departmentsClone.obj = action.payload;
      return {
        ...state,
        departments: departmentsClone
      };
    }
    case fromEmployeeManagementActions.LOAD_DEPARTMENTS_ERROR: {
      const departmentsClone = cloneDeep(state.departments);
      departmentsClone.loading = false;
      return {
        ...state,
        departments: departmentsClone
      };
    }
    case fromEmployeeManagementActions.LOAD_PAYMARKETS: {
      const paymarketsClone = cloneDeep(state.paymarkets);
      paymarketsClone.loading = true;
      return {
        ...state,
        paymarkets: paymarketsClone
      };
    }
    case fromEmployeeManagementActions.LOAD_PAYMARKETS_SUCCESS: {
      const paymarketsClone = cloneDeep(state.paymarkets);
      paymarketsClone.loading = false;
      paymarketsClone.obj = action.payload;
      return {
        ...state,
        paymarkets: paymarketsClone
      };
    }
    case fromEmployeeManagementActions.LOAD_PAYMARKETS_ERROR: {
      const paymarketsClone = cloneDeep(state.paymarkets);
      paymarketsClone.loading = false;
      return {
        ...state,
        paymarkets: paymarketsClone
      };
    }
    case fromEmployeeManagementActions.LOAD_STRUCTURES: {
      const structuresClone = cloneDeep(state.structures);
      structuresClone.loading = true;
      return {
        ...state,
        structures: structuresClone
      };
    }
    case fromEmployeeManagementActions.LOAD_STRUCTURES_SUCCESS: {
      const structuresClone = cloneDeep(state.structures);
      structuresClone.loading = false;
      structuresClone.obj = action.payload;
      return {
        ...state,
        structures: structuresClone
      };
    }
    case fromEmployeeManagementActions.LOAD_STRUCTURES_ERROR: {
      const structuresClone = cloneDeep(state.structures);
      structuresClone.loading = false;
      return {
        ...state,
        structures: structuresClone
      };
    }
    case fromEmployeeManagementActions.LOAD_GRADE_CODES: {
      const structureGradesClone = cloneDeep(state.structureGrades);
      structureGradesClone.loading = true;
      return {
        ...state,
        structureGrades: structureGradesClone
      };
    }
    case fromEmployeeManagementActions.LOAD_GRADE_CODES_SUCCESS: {
      const structureGradesClone = cloneDeep(state.structureGrades);
      structureGradesClone.loading = false;
      structureGradesClone.obj = action.payload;
      return {
        ...state,
        structureGrades: structureGradesClone
      };
    }
    case fromEmployeeManagementActions.LOAD_GRADE_CODES_ERROR: {
      const structureGradesClone = cloneDeep(state.structureGrades);
      structureGradesClone.loading = false;
      return {
        ...state,
        structureGrades: structureGradesClone
      };
    }
    case fromEmployeeManagementActions.GET_CUSTOM_FIELDS: {
      const employeesUserDefinedFieldsClone = cloneDeep(state.employeesUserDefinedFields);
      employeesUserDefinedFieldsClone.loading = true;
      return {
        ...state,
        employeesUserDefinedFields: employeesUserDefinedFieldsClone
      };
    }
    case fromEmployeeManagementActions.GET_CUSTOM_FIELDS_SUCCESS: {
      const employeesUserDefinedFieldsClone = cloneDeep(state.employeesUserDefinedFields);
      employeesUserDefinedFieldsClone.loading = false;
      const mappedKeys = action.payload.map(k => {
        return {
          Key: k.Key.replace('Name', ''),
          Value: k.Value
        };
      });
      employeesUserDefinedFieldsClone.obj = mappedKeys;
      return {
        ...state,
        employeesUserDefinedFields: employeesUserDefinedFieldsClone
      };
    }
    case fromEmployeeManagementActions.GET_CUSTOM_FIELDS_ERROR: {
      const employeesUserDefinedFieldsClone = cloneDeep(state.employeesUserDefinedFields);
      employeesUserDefinedFieldsClone.loading = false;
      return {
        ...state,
        employeesUserDefinedFields: employeesUserDefinedFieldsClone
      };
    }
    case fromEmployeeManagementActions.GET_EMPLOYEE: {
      const employeeClone: AsyncStateObj<CompanyEmployee> = cloneDeep(state.employee);
      employeeClone.loading = true;
      employeeClone.loadingError = false;
      employeeClone.obj = null;
      return {
        ...state,
        showEmployeeForm: true,
        employee: employeeClone
      };
    }
    case fromEmployeeManagementActions.GET_EMPLOYEE_SUCCESS: {
      const employeeClone: AsyncStateObj<CompanyEmployee> = cloneDeep(state.employee);
      employeeClone.loading = false;
      employeeClone.obj = action.payload;

      return {
        ...state,
        employee: employeeClone
      };
    }
    case fromEmployeeManagementActions.GET_EMPLOYEE_ERROR: {
      const employeeClone: AsyncStateObj<CompanyEmployee> = cloneDeep(state.employee);
      employeeClone.loading = false;
      employeeClone.loadingError = true;

      return {
        ...state,
        employee: employeeClone
      };
    }
    case fromEmployeeManagementActions.ADD_EMPLOYEE: {
      const employeeClone: AsyncStateObj<CompanyEmployee> = cloneDeep(state.employee);
      employeeClone.obj = null;
      return {
        ...state,
        employee: employeeClone,
        showEmployeeForm: true
      };
    }
    case fromEmployeeManagementActions.VALIDATE_EMPLOYEE_KEYS: {
      const validationClone: AsyncStateObj<EmployeeValidation> = cloneDeep(state.employeeValidation);
      validationClone.loading = true;
      validationClone.loadingError = false;
      return {
        ...state,
        employeeValidation: validationClone,
        saving: true,
        errorMessage: null
      };
    }
    case fromEmployeeManagementActions.VALIDATE_EMPLOYEE_KEYS_SUCCESS: {
      const validationClone: AsyncStateObj<EmployeeValidation> = cloneDeep(state.employeeValidation);
      validationClone.loading = false;
      validationClone.obj = action.payload;
      const message = action.payload.IsValid ? state.errorMessage : action.payload.Message;
      return {
        ...state,
        employeeValidation: validationClone,
        errorMessage: message,
        saving: action.payload.IsValid
      };
    }
    case fromEmployeeManagementActions.VALIDATE_EMPLOYEE_KEYS_ERROR: {
      const validationClone: AsyncStateObj<EmployeeValidation> = cloneDeep(state.employeeValidation);
      validationClone.loading = false;
      validationClone.loadingError = true;
      return {
        ...state,
        employeeValidation: validationClone,
        errorMessage: action.payload,
        saving: false
      };
    }
    default:
      return state;
  }
}

export const getShowEmployeeForm = (state: State) => state.showEmployeeForm;
export const getSavingEmployee = (state: State) => state.saving;
export const getCompanyJobs = (state: State) => state.jobs;
export const getDepartments = (state: State) => state.departments;
export const getPaymarkets = (state: State) => state.paymarkets;
export const getCountries = (state: State) => state.countries;
export const getCurrencies = (state: State) => state.currencies;
export const getGradeCodes = (state: State) => state.structureGrades;
export const getStructures = (state: State) => state.structures;
export const getEmployeesUserDefinedFields = (state: State) => state.employeesUserDefinedFields;
export const getErrorMessage = (state: State) => state.errorMessage;
export const getEmployeeAsync = (state: State) => state.employee;
export const getEmployeeValidationAsync = (state: State) => state.employeeValidation;
export const getMoreCompanyJobsToLoad = (state: State) => state.moreJobsToLoad;
