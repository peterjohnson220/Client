import cloneDeep from 'lodash/cloneDeep';

import { AsyncStateObj, generateDefaultAsyncStateObj, KendoTypedDropDownItem, GenericKeyValue, CompanyEmployee } from 'libs/models';
import { EmployeeRewardsData } from 'libs/models/payfactors-api/total-rewards/response';
import { Statement } from 'libs/features/total-rewards/total-rewards-statement/models';

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
  isTotalRewardsStatementModalOpen: boolean;
  totalRewardsStatement: AsyncStateObj<Statement>;
  employeeTotalRewardsData: AsyncStateObj<EmployeeRewardsData>;
  totalRewardsStatementId: AsyncStateObj<string>;
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
  moreJobsToLoad: true,
  isTotalRewardsStatementModalOpen: false,
  totalRewardsStatement: generateDefaultAsyncStateObj<Statement>(null),
  employeeTotalRewardsData: generateDefaultAsyncStateObj<EmployeeRewardsData>(null),
  totalRewardsStatementId: generateDefaultAsyncStateObj<string>(null)
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
    case fromEmployeeManagementActions.OPEN_TOTAL_REWARDS_STATEMENT: {
      return {
        ...state,
        isTotalRewardsStatementModalOpen: true
      };
    }
    case fromEmployeeManagementActions.CLOSE_TOTAL_REWARDS_STATEMENT: {
      const statementClone: AsyncStateObj<Statement> = cloneDeep(state.totalRewardsStatement);
      statementClone.obj = null;
      const rewardsDataClone: AsyncStateObj<EmployeeRewardsData> = cloneDeep(state.employeeTotalRewardsData);
      rewardsDataClone.obj = null;
      const statementIdClone: AsyncStateObj<string> = cloneDeep(state.totalRewardsStatementId);
      statementIdClone.obj = null;
      return {
        ...state,
        isTotalRewardsStatementModalOpen: false,
        totalRewardsStatement: statementClone,
        employeeTotalRewardsData: rewardsDataClone,
        totalRewardsStatementId: statementIdClone
      };
    }
    case fromEmployeeManagementActions.GET_TOTAL_REWARDS_STATEMENT: {
      const statementClone: AsyncStateObj<Statement> = cloneDeep(state.totalRewardsStatement);
      statementClone.loading = true;
      statementClone.obj = null;
      return {
        ...state,
        totalRewardsStatement: statementClone
      };
    }
    case fromEmployeeManagementActions.GET_TOTAL_REWARDS_STATEMENT_SUCCESS: {
      const statementClone: AsyncStateObj<Statement> = cloneDeep(state.totalRewardsStatement);
      statementClone.loading = false;
      statementClone.obj = action.payload;
      return {
        ...state,
        totalRewardsStatement: statementClone
      };
    }
    case fromEmployeeManagementActions.GET_TOTAL_REWARDS_STATEMENT_ERROR: {
      const statementClone: AsyncStateObj<Statement> = cloneDeep(state.totalRewardsStatement);
      statementClone.loading = false;
      statementClone.loadingError = true;
      return {
        ...state,
        totalRewardsStatement: statementClone
      };
    }
    case fromEmployeeManagementActions.GET_EMPLOYEE_TOTAL_REWARDS_DATA: {
      const rewardsDataClone: AsyncStateObj<EmployeeRewardsData> = cloneDeep(state.employeeTotalRewardsData);
      rewardsDataClone.loading = true;
      rewardsDataClone.obj = null;
      return {
        ...state,
        employeeTotalRewardsData: rewardsDataClone
      };
    }
    case fromEmployeeManagementActions.GET_EMPLOYEE_TOTAL_REWARDS_DATA_SUCCESS: {
      const rewardsDataClone: AsyncStateObj<EmployeeRewardsData> = cloneDeep(state.employeeTotalRewardsData);
      rewardsDataClone.loading = false;
      rewardsDataClone.obj = action.payload;
      return {
        ...state,
        employeeTotalRewardsData: rewardsDataClone
      };
    }
    case fromEmployeeManagementActions.GET_EMPLOYEE_TOTAL_REWARDS_DATA_ERROR: {
      const rewardsDataClone: AsyncStateObj<EmployeeRewardsData> = cloneDeep(state.employeeTotalRewardsData);
      rewardsDataClone.loading = false;
      rewardsDataClone.loadingError = true;
      return {
        ...state,
        employeeTotalRewardsData: rewardsDataClone
      };
    }
    case fromEmployeeManagementActions.GET_TOTAL_REWARDS_STATEMENT_ID: {
      const statementIdClone: AsyncStateObj<string> = cloneDeep(state.totalRewardsStatementId);
      statementIdClone.loading = true;
      statementIdClone.obj = null;
      return {
        ...state,
        totalRewardsStatementId: statementIdClone
      };
    }
    case fromEmployeeManagementActions.GET_TOTAL_REWARDS_STATEMENT_ID_SUCCESS: {
      const statementIdClone: AsyncStateObj<string> = cloneDeep(state.totalRewardsStatementId);
      statementIdClone.loading = false;
      statementIdClone.obj = action.payload.statementId;
      return {
        ...state,
        totalRewardsStatementId: statementIdClone
      };
    }
    case fromEmployeeManagementActions.GET_TOTAL_REWARDS_STATEMENT_ID_ERROR: {
      const statementIdClone: AsyncStateObj<string> = cloneDeep(state.totalRewardsStatementId);
      statementIdClone.loading = false;
      statementIdClone.loadingError = true;
      return {
        ...state,
        totalRewardsStatementId: statementIdClone
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
export const getIsTotalRewardsStatementModalOpen = (state: State) => state.isTotalRewardsStatementModalOpen;
export const getTotalRewardsStatement = (state: State) => state.totalRewardsStatement;
export const getEmployeeTotalRewardsData = (state: State) => state.employeeTotalRewardsData;
export const getTotalRewardsStatementId = (state: State) => state.totalRewardsStatementId;
