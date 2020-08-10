import { cloneDeep, difference, uniq } from 'lodash';
import { GridDataResult } from '@progress/kendo-angular-grid';

import { createGridReducer } from 'libs/core/reducers/grid.reducer';
import { GridTypeEnum, SelectAllStatus } from 'libs/models/common';
import { TotalRewardAssignedEmployee } from 'libs/models/payfactors-api';

import * as fromAssignedEmployeesGridActions from '../actions/assigned-employees-grid.actions';

export interface State {
  data: GridDataResult;
  loading: boolean;
  loadingError: boolean;
  selectedCompanyEmployeeIds: number[];
  visibleCompanyEmployeeIds: number[];
  openActionMenuEmployee: TotalRewardAssignedEmployee;
  selectAllStatus: string;
  employeeSearchTerm: string;
}

const initialState: State = {
  data: { data: [], total: null },
  loading: false,
  loadingError: false,
  selectedCompanyEmployeeIds: [],
  visibleCompanyEmployeeIds: [],
  openActionMenuEmployee: null,
  selectAllStatus: 'unchecked',
  employeeSearchTerm: null
};

export function reducer(state, action) {
  return createGridReducer(
    GridTypeEnum.TotalRewardsAssignedEmployees,
    (featureState: State = initialState, featureAction: fromAssignedEmployeesGridActions.AssignedEmployeesGridActions): State => {
      switch (featureAction.type) {
        case fromAssignedEmployeesGridActions.RESET: {
          return initialState;
        }
        case fromAssignedEmployeesGridActions.LOAD_ASSIGNED_EMPLOYEES: {
          return {
            ...featureState,
            loading: true,
            loadingError: false
          };
        }
        case fromAssignedEmployeesGridActions.LOAD_ASSIGNED_EMPLOYEES_SUCCESS: {
          const gridDataClone: GridDataResult = cloneDeep(featureState.data);
          gridDataClone.data = featureAction.payload.Data;
          gridDataClone.total = featureAction.payload.TotalCount;

          const selectedCompanyEmployeeIds = featureState.selectedCompanyEmployeeIds;
          const visibleCompanyEmployeeIds = featureAction.payload.Data.map(x => x.CompanyEmployeeId);
          const selectedVisibleCompanyEmployeeIds = visibleCompanyEmployeeIds.filter(x => selectedCompanyEmployeeIds.includes(x));
          const loadAssignedEmployeesSelectAllState =
            selectedVisibleCompanyEmployeeIds.length === 0 ? SelectAllStatus.unchecked :
              selectedVisibleCompanyEmployeeIds.length === visibleCompanyEmployeeIds.length ? SelectAllStatus.checked : SelectAllStatus.indeterminate;

          return {
            ...featureState,
            data: gridDataClone,
            loading: false,
            visibleCompanyEmployeeIds: visibleCompanyEmployeeIds,
            selectAllStatus: loadAssignedEmployeesSelectAllState
          };
        }
        case fromAssignedEmployeesGridActions.LOAD_ASSIGNED_EMPLOYEES_ERROR: {
          return {
            ...featureState,
            loading: false,
            loadingError: true
          };
        }
        case fromAssignedEmployeesGridActions.TOGGLE_EMPLOYEE_SELECTION: {
          const localFeatureState: State = cloneDeep(featureState);
          const visibleCompanyEmployeeIds = localFeatureState.visibleCompanyEmployeeIds;
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

          const visibleCompanyEmployeeIds = localFeatureState.visibleCompanyEmployeeIds;
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

export const getAssignedEmployeesGridData = (state: State) => state.data;
export const getAssignedEmployeesLoading = (state: State) => state.loading;
export const getAssignedEmployeesLoadingError = (state: State) => state.loadingError;
export const getAssignedEmployeesTotal = (state: State) => state.data.total;

export const getSelectedCompanyEmployeeIds = (state: State) => state.selectedCompanyEmployeeIds;
export const getSelectedCompanyEmployeeIdCount = (state: State) => state.selectedCompanyEmployeeIds?.length;
export const getOpenActionMenuEmployee = (state: State) => state.openActionMenuEmployee;
export const getSelectAllState = (state: State) => state.selectAllStatus;
export const getEmployeeSearchTerm = (state: State) => state.employeeSearchTerm;
