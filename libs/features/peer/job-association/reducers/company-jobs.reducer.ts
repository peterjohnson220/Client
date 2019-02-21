// Import all exports from our feature's actions
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';

import { createGridReducer } from 'libs/core/reducers/grid.reducer';
import { GridTypeEnum } from 'libs/models/common';

import { CompanyJob } from '../models/';
import * as fromCompanyJobsActions from '../actions/company-jobs.actions';

export interface State extends EntityState<CompanyJob> {
  loading: boolean;
  loadingError: boolean;
  total: number;
}

// Define Adapter
export const adapter: EntityAdapter<CompanyJob> = createEntityAdapter<CompanyJob>({
  selectId: (companyJobGridItem: CompanyJob) => companyJobGridItem.CompanyJobId
});

// Define initial state
const initialState: State = adapter.getInitialState({
  loading: false,
  loadingError: false,
  total: 0,
});

// Reducer function
export function reducer(state, action) {
  return createGridReducer(
    GridTypeEnum.JobAssociationModalCompanyJobs,
    (featureState = initialState, featureAction: fromCompanyJobsActions.Actions): State => {
      switch (featureAction.type) {
        case fromCompanyJobsActions.LOAD_COMPANY_JOBS: {
          return {
            ...adapter.removeAll(featureState),
            loading: true,
            loadingError: false
          };
        }
        case fromCompanyJobsActions.LOAD_COMPANY_JOBS_SUCCESS: {
          const companyJobGridItems: CompanyJob[] = featureAction.payload.data;
          return {
            ...adapter.addAll(companyJobGridItems, featureState),
            total: featureAction.payload.total,
            loading: false,
            loadingError: false
          };
        }
        case fromCompanyJobsActions.LOAD_COMPANY_JOBS_ERROR: {
          return {
            ...featureState,
            loading: false,
            loadingError: true
          };
        }
        default: {
          return featureState;
        }
      }
    }, {
      take: 50
    })(state, action);
}

// Selector functions
export const getLoading = (state: State) => state.loading;
export const getLoadingError = (state: State) => state.loadingError;
export const getTotal = (state: State) => state.total;
