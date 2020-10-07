import cloneDeep from 'lodash/cloneDeep';

import { EmployeeSearchResult } from 'libs/models/payfactors-api/total-rewards/response/employee-search-response.model';
import { TotalRewardsAssignmentService} from 'libs/features/total-rewards/total-rewards-statement/services/total-rewards-assignment.service';

import * as fromEmployeeSearchResultsActions from '../actions/employee-search-results.actions';

export interface State {
  employees: EmployeeSearchResult[];
  selectedCompanyEmployeeIds: number[];
}

export const initialState: State = {
  employees: [],
  selectedCompanyEmployeeIds: [],
};

export function reducer(state = initialState, action: fromEmployeeSearchResultsActions.EmployeeSearchResultsActions): State {
  switch (action.type) {
    case fromEmployeeSearchResultsActions.REPLACE_EMPLOYEE_RESULTS: {
      return {
        ...state,
        employees: TotalRewardsAssignmentService.setEmployeeSelectedToggle(action.payload, state.selectedCompanyEmployeeIds)
      };
    }
    case fromEmployeeSearchResultsActions.ADD_EMPLOYEE_RESULTS: {
      return {
        ...state,
        employees: state.employees.concat(TotalRewardsAssignmentService.setEmployeeSelectedToggle(action.payload, state.selectedCompanyEmployeeIds))
      };
    }
    case fromEmployeeSearchResultsActions.CLEAR_EMPLOYEE_RESULTS: {
      return {
        ...state,
        employees: []
      };
    }
    case fromEmployeeSearchResultsActions.TOGGLE_EMPLOYEE_SELECTION: {
      const employeesCopy = cloneDeep(state.employees);
      let selectedEmployeeIdsCopy = cloneDeep(state.selectedCompanyEmployeeIds);

      // From toggleJobSelection in search-results.helper (jobs specific)
      const employeeMatch = employeesCopy.find(e => e.CompanyEmployeeId === action.payload.CompanyEmployeeId);
      employeeMatch.IsSelected = !employeeMatch.IsSelected;

      // From toggleValueInList in search-results.helper (jobs specific)
      const matchingValue = selectedEmployeeIdsCopy.find(id => id === action.payload.CompanyEmployeeId);
      if (!!matchingValue) {
        selectedEmployeeIdsCopy = selectedEmployeeIdsCopy.filter(id => id !== matchingValue);
      } else {
        selectedEmployeeIdsCopy.push(action.payload.CompanyEmployeeId);
      }
      return {
        ...state,
        employees: employeesCopy,
        selectedCompanyEmployeeIds: selectedEmployeeIdsCopy
      };
    }
    case fromEmployeeSearchResultsActions.CLEAR_SELECTED_EMPLOYEES: {
      const employeesCopy = cloneDeep(state.employees).map(e => {
        e.IsSelected = false;
        return e;
      });
      return {
        ...state,
        employees: employeesCopy,
        selectedCompanyEmployeeIds: []
      };
    }
    default: {
      return state;
    }
  }
}

export const getSelectedCompanyEmployeeIds = (state: State) => state.selectedCompanyEmployeeIds;
export const getSelectedEmployeesCount = (state: State) => state.selectedCompanyEmployeeIds.length;
export const getEmployees = (state: State) => state.employees;
