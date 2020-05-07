import { combineReducers } from '@ngrx/store';
// Import feature reducers
import * as fromExchangeOptionsReducer from './exchange-options.reducer';
import * as fromCompanyOptionsReducer from './company-options.reducer';
import * as fromAssociateJobsReducer from './associate-jobs.reducer';

// Feature area state
export interface State {
  companyOptions: fromCompanyOptionsReducer.State;
  exchangeOptions: fromExchangeOptionsReducer.State;
  associateJobs: fromAssociateJobsReducer.State;
}

const reducers = {
  companyOptions: fromCompanyOptionsReducer.reducer,
  exchangeOptions: fromExchangeOptionsReducer.reducer,
  associateJobs: fromAssociateJobsReducer.reducer,
};

export const reducersCombined = combineReducers(reducers);
export function reducer(state, action) {
  return reducersCombined(state, action);
}
