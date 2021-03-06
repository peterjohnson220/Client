import { createFeatureSelector, createSelector } from '@ngrx/store';

// Import root app reducer
import * as fromRoot from 'libs/state/state';

// Import feature reducers
import * as fromEmployeeManagementReducer from './employee-management.reducer';
import * as fromEmployeeBenefitsReducer from './employee-benefits.reducer';

// Feature area state
export interface EmployeeManagementState {
  employeeData: fromEmployeeManagementReducer.State;
  employeeBenefits: fromEmployeeBenefitsReducer.State;
}

// Extend root state with feature area state
export interface State extends fromRoot.State {
  feature_employee_management: EmployeeManagementState;
}

// Feature area reducers
export const reducers = {
  employeeData: fromEmployeeManagementReducer.reducer,
  employeeBenefits: fromEmployeeBenefitsReducer.reducer
};

// Select Feature Area
export const selectEmployeeManagementFeature =
  createFeatureSelector<EmployeeManagementState>('feature_employee_management');

// View Selectors
export const selectEmployeeDataState =
  createSelector(selectEmployeeManagementFeature, (state: EmployeeManagementState) => state.employeeData);

export const selectEmployeeBenefitsState =
  createSelector(selectEmployeeManagementFeature, (state: EmployeeManagementState) => state.employeeBenefits);

// User Form
export const getShowEmployeeForm = createSelector(selectEmployeeDataState, fromEmployeeManagementReducer.getShowEmployeeForm);
export const getSaving = createSelector(selectEmployeeDataState, fromEmployeeManagementReducer.getSavingEmployee);
export const getCompanyJobs = createSelector(selectEmployeeDataState, fromEmployeeManagementReducer.getCompanyJobs);
export const getPaymarkets = createSelector(selectEmployeeDataState, fromEmployeeManagementReducer.getPaymarkets);
export const getCountries = createSelector(selectEmployeeDataState, fromEmployeeManagementReducer.getCountries);
export const getCurrencies = createSelector(selectEmployeeDataState, fromEmployeeManagementReducer.getCurrencies);
export const getDepartments = createSelector(selectEmployeeDataState, fromEmployeeManagementReducer.getDepartments);
export const getGradeCodes = createSelector(selectEmployeeDataState, fromEmployeeManagementReducer.getGradeCodes);
export const getStructures = createSelector(selectEmployeeDataState, fromEmployeeManagementReducer.getStructures);
export const getEmployeesUserDefinedFields = createSelector(selectEmployeeDataState, fromEmployeeManagementReducer.getEmployeesUserDefinedFields);
export const getErrorMessage = createSelector(selectEmployeeDataState, fromEmployeeManagementReducer.getErrorMessage);
export const getEmployee = createSelector(selectEmployeeDataState, fromEmployeeManagementReducer.getEmployeeAsync);
export const getEmployeeValidationAsync = createSelector(selectEmployeeDataState, fromEmployeeManagementReducer.getEmployeeValidationAsync);
export const getMoreCompanyJobsToLoad = createSelector(selectEmployeeDataState, fromEmployeeManagementReducer.getMoreCompanyJobsToLoad);
export const getIsTotalRewardsStatementModalOpen = createSelector(selectEmployeeDataState, fromEmployeeManagementReducer.getIsTotalRewardsStatementModalOpen);
export const getTotalRewardsStatement = createSelector(selectEmployeeDataState, fromEmployeeManagementReducer.getTotalRewardsStatement);
export const getEmployeeTotalRewardsData = createSelector(selectEmployeeDataState, fromEmployeeManagementReducer.getEmployeeTotalRewardsData);
export const getTotalRewardsStatementId = createSelector(selectEmployeeDataState, fromEmployeeManagementReducer.getTotalRewardsStatementId);

// Employee Benefits
export const getEmployeeBenefitsAsync = createSelector(selectEmployeeBenefitsState, fromEmployeeBenefitsReducer.getEmployeeBenefitsAsync);
export const getEmployeeBenefitsSaving = createSelector(selectEmployeeBenefitsState, fromEmployeeBenefitsReducer.getSaving);
export const getEmployeeBenefitsSavingError = createSelector(selectEmployeeBenefitsState, fromEmployeeBenefitsReducer.getSavingError);
export const getEmployeeBenefitsUpdated = createSelector(selectEmployeeBenefitsState, fromEmployeeBenefitsReducer.getEmployeeBenefitsUpdated);
export const getEmployeeBenefits = createSelector(selectEmployeeBenefitsState, fromEmployeeBenefitsReducer.getEmployeeBenefits);
