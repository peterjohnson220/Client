import * as cloneDeep from 'lodash.clonedeep';

import * as fromCompanyFlsaStatusActions from 'libs/features/job-description-management/actions/company-flsa-status.actions';

export interface State {
  companyFlsaStatuses: string[];
  loadingCompanyFlsaStatuses: boolean;
  loadingCompanyFlsaStatusesError: boolean;
}

export const initialState: State = {
  companyFlsaStatuses: [],
  loadingCompanyFlsaStatuses: false,
  loadingCompanyFlsaStatusesError: false
};

export function reducer(state = initialState, action: fromCompanyFlsaStatusActions.Actions): State {
  switch (action.type) {
    case fromCompanyFlsaStatusActions.LOAD_COMPANY_FLSA_STATUSES:
      return {
        ...state,
        loadingCompanyFlsaStatuses: true
      };
    case fromCompanyFlsaStatusActions.LOAD_COMPANY_FLSA_STATUSES_ERROR:
      return {
        ...state,
        loadingCompanyFlsaStatuses: false,
        loadingCompanyFlsaStatusesError: true
      };
    case fromCompanyFlsaStatusActions.LOAD_COMPANY_FLSA_STATUSES_SUCCESS:
      return {
        ...state,
        loadingCompanyFlsaStatuses: false,
        loadingCompanyFlsaStatusesError: false,
        companyFlsaStatuses: cloneDeep(action.payload)
      };
    default:
      return state;
  }
}

export const getCompanyFlsaStatuses = (state: State) => state.companyFlsaStatuses;
export const getCompanyFlsaStatusesLoading = (state: State) => state.loadingCompanyFlsaStatuses;
export const getCompanyFlsaStatusesLoadingError = (state: State) => state.loadingCompanyFlsaStatusesError;
