import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';

import { CompanyJob } from 'libs/models/company';
import { ExchangeJob } from 'libs/features/peer/job-association/models/exchange-job.model';
import { createGridReducer } from 'libs/core/reducers/grid.reducer';
import { GridTypeEnum } from 'libs/models/common';

import * as fromPeerCompanyJobs from '../../_manage/actions/company-jobs.actions';

export interface State extends EntityState<CompanyJob> {
  exchangeId: number;
  loading: boolean;
  loadingError: boolean;
  loadingErrorMessage: string;
  total: number;
  searchTerm: string;
  selectedCompanyJob: CompanyJob;
  pageRowIndexToScrollTo: number;
  // mapped Exchange job
  loadingMappedExchangeJobs: boolean;
  loadingMappedExchangeJobsSuccess: boolean;
  loadingMappedExchangeJobsError: boolean;
  mappedExchangeJob: any;
  // jdm PDF download
  loadingJdmDescriptionId: boolean;
  loadingJdmDescriptionIdSuccess: boolean;
  jdmDescriptionIds: number[];
  downloadingJdmDescription: boolean;
  downloadingJdmDescriptionError: boolean;
}

export const adapter: EntityAdapter<CompanyJob> = createEntityAdapter<CompanyJob>({
  selectId: (companyJob: CompanyJob) => companyJob.CompanyJobId
});

const initialState: State = adapter.getInitialState({
  exchangeId: null,
  loading: false,
  loadingError: false,
  loadingErrorMessage: 'Error loading company jobs',
  total: 0,
  searchTerm: null,
  selectedCompanyJob: null,
  pageRowIndexToScrollTo: null,
  // mapped Exchange job
  loadingMappedExchangeJobs: false,
  loadingMappedExchangeJobsSuccess: false,
  loadingMappedExchangeJobsError: false,
  mappedExchangeJob: {},
  // jdm PDF download
  loadingJdmDescriptionId: false,
  loadingJdmDescriptionIdSuccess: false,
  jdmDescriptionIds: [],
  downloadingJdmDescription: false,
  downloadingJdmDescriptionError: false
});

export function reducer(state, action) {
  return createGridReducer(
    GridTypeEnum.PeerManageCompanyJobs,
    (featureState = initialState, featureAction: fromPeerCompanyJobs.Actions): State => {
      switch (featureAction.type) {
        case fromPeerCompanyJobs.SET_EXCHANGE_ID: {
          return {
            ...featureState,
            exchangeId: action.payload
          };
        }
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
        case fromPeerCompanyJobs.SET_SELECTED_COMPANY_JOB: {
          return {
            ...featureState,
            selectedCompanyJob: featureAction.payload,
            downloadingJdmDescriptionError: false
          };
        }
        case fromPeerCompanyJobs.UPDATE_PAGE_ROW_INDEX_TO_SCROLL_TO: {
          return {
            ...featureState,
            pageRowIndexToScrollTo: featureAction.payload
          };
        }
        case fromPeerCompanyJobs.LOAD_MAPPED_EXCHANGE_JOBS: {
          return {
            ...featureState,
            loadingMappedExchangeJobs: true
          };
        }
        case fromPeerCompanyJobs.LOAD_MAPPED_EXCHANGE_JOBS_SUCCESS: {
          return {
            ...featureState,
            loadingMappedExchangeJobs: false,
            loadingMappedExchangeJobsSuccess: true,
            mappedExchangeJob: action.payload.find(e => e.ExchangeId === featureState.exchangeId)
          };
        }
        case fromPeerCompanyJobs.LOAD_MAPPED_EXCHANGE_JOBS_ERROR: {
          return {
            ...featureState,
            loadingMappedExchangeJobs: false,
            loadingMappedExchangeJobsError: true
          };
        }
        case fromPeerCompanyJobs.LOAD_JDM_DESCRIPTION_IDS: {
          return {
            ...featureState,
            loadingJdmDescriptionId: true
          };
        }
        case fromPeerCompanyJobs.LOAD_JDM_DESCRIPTION_IDS_COMPLETE: {
          return {
            ...featureState,
            loadingJdmDescriptionId: false,
            jdmDescriptionIds: featureAction.payload
          };
        }
        case fromPeerCompanyJobs.DOWNLOAD_JDM_DESCRIPTION: {
          return {
            ...featureState,
            downloadingJdmDescription: true,
            downloadingJdmDescriptionError: false
          };
        }
        case fromPeerCompanyJobs.DOWNLOAD_JDM_DESCRIPTION_SUCCESS: {
          return {
            ...featureState,
            downloadingJdmDescription: false
          };
        }
        case fromPeerCompanyJobs.DOWNLOAD_JDM_DESCRIPTION_ERROR: {
          return {
            ...featureState,
            downloadingJdmDescription: false,
            downloadingJdmDescriptionError: true,
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
export const getSelectedCompanyJob = (state: State) => state.selectedCompanyJob;
export const getPageRowIndexToScrollTo = (state: State) => state.pageRowIndexToScrollTo;
export const getCompanyJobsExchangeId = (state: State) => state.exchangeId;

// Selector functions, mapped exchange jobs
export const getMappedExchangeJobsLoading = (state: State) => state.loadingMappedExchangeJobs;
export const getMappedExchangeJobsLoadingSuccess = (state: State) => state.loadingMappedExchangeJobsSuccess;
export const getMappedExchangeJobsLoadingError = (state: State) => state.loadingMappedExchangeJobsError;
export const getMappedExchangeJob = (state: State) => state.mappedExchangeJob;

// Selector functions, Jdm PDF download
export const getJdmDescriptionIds = (state: State) => state.jdmDescriptionIds;
export const getDownloadingJdmDescription = (state: State) => state.downloadingJdmDescription;
export const getDownloadingJdmDescriptionError = (state: State) => state.downloadingJdmDescriptionError;
