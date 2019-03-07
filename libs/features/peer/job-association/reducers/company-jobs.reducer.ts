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
  searchTerm: string;
  selectedCompanyJobs: CompanyJob[];
  selectedCompanyJobInDetailPanel: CompanyJob;
  isDetailPanelExpanded: boolean;
}

// Define Adapter
export const adapter: EntityAdapter<CompanyJob> = createEntityAdapter<CompanyJob>({
  selectId: (companyJobGridItem: CompanyJob) => companyJobGridItem.CompanyJobId
});

// Define initial state
const initialState: State = adapter.getInitialState({
  loading: false,
  loadingError: false,
  selectedCompanyJobs: [],
  total: 0,
  searchTerm: '',
  selectedCompanyJobInDetailPanel: {} as CompanyJob,
  isDetailPanelExpanded: false,
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
            selectedCompanyJobs: [],
            loading: true,
            loadingError: false,
            isDetailPanelExpanded: false
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
        case fromCompanyJobsActions.RESET_STATE: {
          return {
            ...featureState,
            loading: false,
            loadingError: false,
            selectedCompanyJobs: [],
            total: 0,
            searchTerm: '',
            isDetailPanelExpanded: false
          };
        }
        case fromCompanyJobsActions.SEARCH_TERM_UPDATED: {
          return {
            ...featureState,
            searchTerm: featureAction.payload,
            isDetailPanelExpanded: false
          };
        }
        case fromCompanyJobsActions.SELECT_COMPANY_JOBS: {
          let selectedCompanyJobs = [ ...featureState.selectedCompanyJobs ];
          selectedCompanyJobs = featureAction.payload;
          return {
            ...featureState,
            selectedCompanyJobs: featureAction.payload,
            isDetailPanelExpanded: false
          };
        }
        case fromCompanyJobsActions.SELECT_COMPANY_JOB_FOR_DETAIL_PANEL: {
          // close the panel if we're expanded and selecting the same job, otherwise open it
          const isCurrentJobSelected = (featureAction.payload.CompanyJobId === featureState.selectedCompanyJobInDetailPanel.CompanyJobId);
          const isDetailPanelExpanded = !(isCurrentJobSelected && featureState.isDetailPanelExpanded);

          return {
            ...featureState,
            selectedCompanyJobInDetailPanel: featureAction.payload,
            isDetailPanelExpanded
          };
        }
        case fromCompanyJobsActions.TOGGLE_DETAIL_PANEL: {
          return {
            ...featureState,
            isDetailPanelExpanded: !featureState.isDetailPanelExpanded
          };
        }
        case fromCompanyJobsActions.CLOSE_DETAIL_PANEL: {
          return {
            ...featureState,
            isDetailPanelExpanded: false
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
export const getSelectedCompanyJobs = (state: State) => state.selectedCompanyJobs;
