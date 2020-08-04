import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { cloneDeep, difference, uniq } from 'lodash';

import { createGridReducer } from 'libs/core/reducers/grid.reducer';
import { GridTypeEnum, SelectAllStatus } from 'libs/models/common';
import { CompanyEmployee } from 'libs/models/company';

import * as fromAssignedEmployeesGridActions from '../actions/assigned-employees-grid.actions';

export interface State extends EntityState<CompanyEmployee> {
  assignedEmployeesLoading: boolean;
  assignedEmployeesLoadingError: boolean;
  assignedEmployeesTotal: number;
  selectedCompanyEmployeeIds: number[];
  openActionMenuEmployee: CompanyEmployee;
  selectAllStatus: string;
  employeeSearchTerm: string;
}

export const adapter: EntityAdapter<CompanyEmployee> = createEntityAdapter<CompanyEmployee>({
  selectId: (companyEmployee: CompanyEmployee) => companyEmployee.CompanyEmployeeId
});

const initialState: State = adapter.getInitialState({
  assignedEmployeesLoading: false,
  assignedEmployeesLoadingError: false,
  assignedEmployeesTotal: null,
  selectedCompanyEmployeeIds: [],
  openActionMenuEmployee: null,
  selectAllStatus: 'unchecked',
  employeeSearchTerm: null
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
          const selectedCompanyEmployeeIds = localFeatureState.selectedCompanyEmployeeIds;
          const visibleCompanyEmployeeIds = action.payload.data.map(x => x.CompanyEmployeeId);
          const selectedVisibleCompanyEmployeeIds = visibleCompanyEmployeeIds.filter(x => selectedCompanyEmployeeIds.includes(x));
          const loadAssignedEmployeesSelectAllState =
            selectedVisibleCompanyEmployeeIds.length === 0 ? SelectAllStatus.unchecked :
              selectedVisibleCompanyEmployeeIds.length === visibleCompanyEmployeeIds.length ? SelectAllStatus.checked : SelectAllStatus.indeterminate;

          return {
            ...adapter.setAll(featureAction.payload.data, featureState),
            assignedEmployeesTotal: action.payload.total,
            assignedEmployeesLoading: false,
            assignedEmployeesLoadingError: false,
            selectAllStatus: loadAssignedEmployeesSelectAllState
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
          const visibleCompanyEmployeeIds = localFeatureState.ids;
          let selectAllStateToSet = SelectAllStatus.unchecked;
          let selectedCompanyEmployeeIds = cloneDeep(localFeatureState.selectedCompanyEmployeeIds);

          if (selectedCompanyEmployeeIds.find((e: number) => e === action.payload.CompanyEmployeeId)) {
            selectedCompanyEmployeeIds = selectedCompanyEmployeeIds.filter((e: number) => e !== action.payload.CompanyEmployeeId);
          } else {
            selectedCompanyEmployeeIds.push(action.payload.CompanyEmployeeId);
          }

          if (visibleCompanyEmployeeIds && visibleCompanyEmployeeIds.every(x => selectedCompanyEmployeeIds.includes(x))) {
            selectAllStateToSet = SelectAllStatus.checked;
          } else if (selectedCompanyEmployeeIds.length !== 0) {
            selectAllStateToSet = SelectAllStatus.indeterminate;
          }

          return {
            ...localFeatureState,
            selectedCompanyEmployeeIds,
            selectAllStatus: selectAllStateToSet
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
            selectedCompanyEmployeeIds: [],
            selectAllStatus: SelectAllStatus.unchecked
          };
        }
        case fromAssignedEmployeesGridActions.SELECT_ALL: {
          const localFeatureState: State = cloneDeep(featureState);
          const selectAllStateToSet = localFeatureState.selectAllStatus === SelectAllStatus.checked ?
            SelectAllStatus.unchecked : SelectAllStatus.checked;

          const visibleCompanyEmployeeIds = localFeatureState.ids;
          const selectedCompanyEmployeeIds = localFeatureState.selectedCompanyEmployeeIds;
          let newSelectedCompanyEmployeeIds = [];
          if (selectAllStateToSet === SelectAllStatus.checked) {
            newSelectedCompanyEmployeeIds = selectedCompanyEmployeeIds.length === 0 ?
              visibleCompanyEmployeeIds : uniq([...selectedCompanyEmployeeIds, ...visibleCompanyEmployeeIds]);
          } else {
            newSelectedCompanyEmployeeIds = difference(selectedCompanyEmployeeIds, visibleCompanyEmployeeIds);
          }
          return {
            ...localFeatureState,
            selectAllStatus: selectAllStateToSet,
            selectedCompanyEmployeeIds: newSelectedCompanyEmployeeIds
          };
        }
        case fromAssignedEmployeesGridActions.UPDATE_EMPLOYEE_SEARCH_TERM: {
          return {
            ...featureState,
            employeeSearchTerm: featureAction.payload.searchTerm
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
export const getSelectAllState = (state: State) => state.selectAllStatus;
export const getEmployeeSearchTerm = (state: State) => state.employeeSearchTerm;
