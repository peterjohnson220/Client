import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';

import { CompanyJob } from 'libs/models/company';
import { createGridReducer } from 'libs/core/reducers/grid.reducer';
import { GridTypeEnum } from 'libs/models/common';

import * as fromPeerCompanyJobs from '../../_manage/actions/company-jobs.actions';

export interface State extends EntityState<CompanyJob> {
  loading: boolean;
  loadingError: boolean;
  loadingErrorMessage: string;
  total: number;
  searchTerm: string;
}

export const adapter: EntityAdapter<CompanyJob> = createEntityAdapter<CompanyJob>({
  selectId: (companyJob: CompanyJob) => companyJob.CompanyJobId
});

const initialState: State = adapter.getInitialState({
  loading: false,
  loadingError: false,
  loadingErrorMessage: 'Error loading company jobs',
  total: 0,
  searchTerm: null
});

export function reducer(state, action) {
  return createGridReducer(
    GridTypeEnum.PeerManageCompanyJobs,
    (featureState = initialState, featureAction: fromPeerCompanyJobs.Actions): State => {
      switch (featureAction.type) {
        case fromPeerCompanyJobs.LOAD_COMPANY_JOBS: {
          return {
            ...adapter.removeAll(featureState),
            loading: true,
            loadingError: false,
            loadingErrorMessage: 'Error loading company jobs'
          };
        }
        case fromPeerCompanyJobs.LOAD_COMPANY_JOBS_SUCCESS: {
          return {
            ...adapter.addAll(featureAction.payload.data, featureState),
            total: featureAction.payload.total,
            loading: false,
            loadingError: false
          };
        }
        case fromPeerCompanyJobs.LOAD_COMPANY_JOBS_ERROR: {
          return {
            ...featureState,
            loading: false,
            loadingError: true
          };
        }
        case fromPeerCompanyJobs.LOAD_COMPANY_JOBS_PAGING_ERROR: {
          return {
            ...featureState,
            loading: false,
            loadingError: true,
            loadingErrorMessage: featureAction.payload
          };
        }
        case fromPeerCompanyJobs.UPDATE_COMPANY_JOBS_SEARCH_TERM: {
          return {
            ...featureState,
            searchTerm: featureAction.payload
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

// Selector functions
export const getLoading = (state: State) => state.loading;
export const getLoadingError = (state: State) => state.loadingError;
export const getLoadingErrorMessage = (state: State) => state.loadingErrorMessage;
export const getTotal = (state: State) => state.total;
export const getSearchTerm = (state: State) => state.searchTerm;
