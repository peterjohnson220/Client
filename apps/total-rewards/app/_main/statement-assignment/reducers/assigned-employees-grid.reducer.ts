import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import * as cloneDeep from 'lodash.clonedeep';

import { createGridReducer } from 'libs/core/reducers/grid.reducer';
import { GridTypeEnum } from 'libs/models/common';
import { CompanyEmployee } from 'libs/models/company';

import * as fromAssignedEmployeesGridActions from '../actions/assigned-employees-grid.actions';

export interface State extends EntityState<CompanyEmployee> {
  assignedEmployeesLoading: boolean;
  assignedEmployeesLoadingError: boolean;
  assignedEmployeesTotal: number;
  selectedCompanyEmployeeIds: number[];
  openActionMenuEmployee: CompanyEmployee;
}

export const adapter: EntityAdapter<CompanyEmployee> = createEntityAdapter<CompanyEmployee>({
  selectId: (companyEmployee: CompanyEmployee) => companyEmployee.CompanyEmployeeId
});

const initialState: State = adapter.getInitialState({
  assignedEmployeesLoading: false,
  assignedEmployeesLoadingError: false,
  assignedEmployeesTotal: 0,
  selectedCompanyEmployeeIds: [],
  openActionMenuEmployee: null,
});

export function reducer(state, action) {
  return createGridReducer(
    GridTypeEnum.TotalRewardsAssignedEmployees,
    (featureState: State = initialState, featureAction: fromAssignedEmployeesGridActions.AssignedEmployeesGridActions): State => {
      switch (featureAction.type) {
        case fromAssignedEmployeesGridActions.RESET: {
          return initialState;
        }
        case fromAssignedEmployeesGridActions.LOAD_ASSIGNED_EMPLOYEES: {
          const localFeatureState: State = cloneDeep(featureState);
          return {
            ...localFeatureState,
            assignedEmployeesLoading: true,
            assignedEmployeesLoadingError: false,
          };
        }
        case fromAssignedEmployeesGridActions.LOAD_ASSIGNED_EMPLOYEES_SUCCESS: {
          const localFeatureState: State = cloneDeep(featureState);
          return {
            ...adapter.setAll(featureAction.payload.data, featureState),
            assignedEmployeesTotal: action.payload.total,
            assignedEmployeesLoading: false,
            assignedEmployeesLoadingError: false,
          };
        }
        case fromAssignedEmployeesGridActions.LOAD_ASSIGNED_EMPLOYEES_ERROR: {
          const localFeatureState: State = cloneDeep(featureState);
          return {
            ...localFeatureState,
            assignedEmployeesLoading: false,
            assignedEmployeesLoadingError: true,
          };
        }
        case fromAssignedEmployeesGridActions.TOGGLE_EMPLOYEE_SELECTION: {
          const localFeatureState: State = cloneDeep(featureState);
          let selectedCompanyEmployeeIds = cloneDeep(localFeatureState.selectedCompanyEmployeeIds);

          if (selectedCompanyEmployeeIds.find((e: number) => e === action.payload.CompanyEmployeeId)) {
            selectedCompanyEmployeeIds = selectedCompanyEmployeeIds.filter((e: number) => e !== action.payload.CompanyEmployeeId);
          } else {
            selectedCompanyEmployeeIds.push(action.payload.CompanyEmployeeId);
          }

          return {
            ...localFeatureState,
            selectedCompanyEmployeeIds
          };
        }
        case fromAssignedEmployeesGridActions.OPEN_ACTION_MENU: {
          const localFeatureState: State = cloneDeep(featureState);
          return {
            ...localFeatureState,
            openActionMenuEmployee: action.payload
          };
        }
        case fromAssignedEmployeesGridActions.CLOSE_ACTION_MENU: {
          const localFeatureState: State = cloneDeep(featureState);
          return {
            ...localFeatureState,
            openActionMenuEmployee: null
          };
        }
        case fromAssignedEmployeesGridActions.CLEAR_SELECTIONS: {
          const localFeatureState: State = cloneDeep(featureState);
          return {
            ...localFeatureState,
            selectedCompanyEmployeeIds: []
          };
        }
        default: {
          return featureState;
        }
      }
    }, {
      take: 20
    })(state, action);
}

export const getAssignedEmployeesLoading = (state: State) => state.assignedEmployeesLoading;
export const getAssignedEmployeesLoadingError = (state: State) => state.assignedEmployeesLoadingError;
export const getAssignedEmployeesTotal = (state: State) => state.assignedEmployeesTotal;

export const getSelectedCompanyEmployeeIds = (state: State) => state.selectedCompanyEmployeeIds;
export const getSelectedCompanyEmployeeIdCount = (state: State) => state.selectedCompanyEmployeeIds?.length;
export const getOpenActionMenuEmployee = (state: State) => state.openActionMenuEmployee;
