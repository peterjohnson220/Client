import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';

import { CompanyJob } from 'libs/features/peer/job-association/models/company-job.model';
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
  companyJobsSearchTerm: string;
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
  // exchange job search
  searchingExchangeJobs: boolean;
  searchingExchangeJobsSuccess: boolean;
  searchingExchangeJobsError: boolean;
  exchangeJobsSearchResults: ExchangeJob[];
  exchangeJobsTitleSearchTerm: string;
  exchangeJobsDescriptionSearchTerm: string;
  // create, approve or reject pending association in exchange job search
  savingAssociation: boolean;
  savingAssociationSuccess: boolean;
  savingAssociationError: boolean;
  showConfirmUnmatchModal: boolean;
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
  companyJobsSearchTerm: null,
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
  downloadingJdmDescriptionError: false,
  // exchange job search
  searchingExchangeJobs: false,
  searchingExchangeJobsSuccess: false,
  searchingExchangeJobsError: false,
  exchangeJobsSearchResults: [],
  exchangeJobsTitleSearchTerm: null,
  exchangeJobsDescriptionSearchTerm: null,
  // create, approve or reject pending association in exchange job search
  savingAssociation: false,
  savingAssociationSuccess: false,
  savingAssociationError: false,
  showConfirmUnmatchModal: false
});

export function reducer(state, action) {
  return createGridReducer(
    GridTypeEnum.PeerManageCompanyJobs,
    (featureState = initialState, featureAction: fromPeerCompanyJobs.Actions): State => {
      switch (featureAction.type) {
        case fromPeerCompanyJobs.RESET: {
          return {
            ...initialState,
            companyJobsSearchTerm: featureState.companyJobsSearchTerm,
          };
        }
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
            ...adapter.setAll(featureAction.payload.data, featureState),
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
            companyJobsSearchTerm: featureAction.payload
          };
        }
        case fromPeerCompanyJobs.SET_SELECTED_COMPANY_JOB: {
          return {
            ...featureState,
            selectedCompanyJob: featureAction.payload,
            downloadingJdmDescriptionError: false,
            exchangeJobsSearchResults: [],
            savingAssociationError: false,
            searchingExchangeJobsError: false,
            loadingMappedExchangeJobsError: false,
          };
        }
        case fromPeerCompanyJobs.UPDATE_PAGE_ROW_INDEX_TO_SCROLL_TO: {
          return {
            ...featureState,
            pageRowIndexToScrollTo: featureAction.payload
          };
        }
        // mapped exchange job
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
        // jdm PDF download
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
        // exchange jobs search
        case fromPeerCompanyJobs.SEARCH_EXCHANGE_JOBS: {
          return {
            ...featureState,
            searchingExchangeJobs: true,
            searchingExchangeJobsError: false,
            savingAssociationError: false,
            loadingMappedExchangeJobsError: false,
          };
        }
        case fromPeerCompanyJobs.SEARCH_EXCHANGE_JOBS_SUCCESS: {
          return {
            ...featureState,
            searchingExchangeJobs: false,
            searchingExchangeJobsError: false,
            searchingExchangeJobsSuccess: true,
            exchangeJobsSearchResults: featureAction.payload
          };
        }
        case fromPeerCompanyJobs.SEARCH_EXCHANGE_JOBS_ERROR: {
          return {
            ...featureState,
            searchingExchangeJobs: false,
            searchingExchangeJobsSuccess: false,
            searchingExchangeJobsError: true,
          };
        }
        case fromPeerCompanyJobs.UPDATE_EXCHANGE_JOBS_TITLE_SEARCH_TERM: {
          return {
            ...featureState,
            exchangeJobsTitleSearchTerm: featureAction.payload
          };
        }
        case fromPeerCompanyJobs.UPDATE_EXCHANGE_JOBS_DESCRIPTION_SEARCH_TERM: {
          return {
            ...featureState,
            exchangeJobsDescriptionSearchTerm: featureAction.payload
          };
        }
        case fromPeerCompanyJobs.CREATE_ASSOCIATION:
        case fromPeerCompanyJobs.APPROVE_PENDING_MATCH:
        case fromPeerCompanyJobs.UNMATCH: {
          return {
            ...featureState,
            savingAssociation: true,
            savingAssociationError: false
          };
        }
        case fromPeerCompanyJobs.CREATE_ASSOCIATION_SUCCESS:
        case fromPeerCompanyJobs.APPROVE_PENDING_MATCH_SUCCESS: {
          return {
            ...featureState,
            savingAssociation: false,
            savingAssociationSuccess: true,
            savingAssociationError: false,
            selectedCompanyJob: { ...featureState.selectedCompanyJob, IsAssociated: true, IsPendingPeerUserReview: false }
          };
        }
        case fromPeerCompanyJobs.UNMATCH_SUCCESS: {
          return {
            ...featureState,
            savingAssociation: false,
            savingAssociationSuccess: true,
            savingAssociationError: false,
            selectedCompanyJob: { ...featureState.selectedCompanyJob, IsAssociated: false },
            showConfirmUnmatchModal: false
          };
        }
        case fromPeerCompanyJobs.CREATE_ASSOCIATION_ERROR:
        case fromPeerCompanyJobs.APPROVE_PENDING_MATCH_ERROR:
        case fromPeerCompanyJobs.UNMATCH_ERROR: {
          return {
            ...featureState,
            savingAssociation: false,
            savingAssociationSuccess: false,
            savingAssociationError: true
          };
        }
        case fromPeerCompanyJobs.CONFIRM_UNMATCH:
          return {
            ...featureState,
            showConfirmUnmatchModal: true
          };
        case fromPeerCompanyJobs.CANCEL_UNMATCH:
          return {
            ...featureState,
            showConfirmUnmatchModal: false
          };
        default: {
          return featureState;
        }
      }
    }, {
      take: 20
    })(state, action);
}

// Selector functions
export const getExchangeId = (state: State) => state.exchangeId;
export const getLoading = (state: State) => state.loading;
export const getLoadingError = (state: State) => state.loadingError;
export const getLoadingErrorMessage = (state: State) => state.loadingErrorMessage;
export const getTotal = (state: State) => state.total;
export const getSearchTerm = (state: State) => state.companyJobsSearchTerm;
export const getSelectedCompanyJob = (state: State) => state.selectedCompanyJob;
export const getPageRowIndexToScrollTo = (state: State) => state.pageRowIndexToScrollTo;
export const getCompanyJobsExchangeId = (state: State) => state.exchangeId;

// Selector functions, mapped exchange jobs
export const getMappedExchangeJobsLoading = (state: State) => state.loadingMappedExchangeJobs;
export const getMappedExchangeJobsLoadingSuccess = (state: State) => state.loadingMappedExchangeJobsSuccess;
export const getMappedExchangeJobsLoadingError = (state: State) => state.loadingMappedExchangeJobsError;
export const getMappedExchangeJob = (state: State) => state.mappedExchangeJob;

// Selector functions, jdm PDF download
export const getJdmDescriptionIds = (state: State) => state.jdmDescriptionIds;
export const getDownloadingJdmDescription = (state: State) => state.downloadingJdmDescription;
export const getDownloadingJdmDescriptionError = (state: State) => state.downloadingJdmDescriptionError;

// Selector functions, exchange jobs search
export const getSearchingExchangeJobs = (state: State) => state.searchingExchangeJobs;
export const getSearchingExchangeJobsSuccess = (state: State) => state.searchingExchangeJobsSuccess;
export const getSearchingExchangeJobsError = (state: State) => state.searchingExchangeJobsError;
export const getExchangeJobsSearchResults = (state: State) => state.exchangeJobsSearchResults;
export const getExchangeJobsTitleSearchTerm = (state: State) => state.exchangeJobsTitleSearchTerm;
export const getExchangeJobsDescriptionSearchTerm = (state: State) => state.exchangeJobsDescriptionSearchTerm;

// Selector functions, create, approve or reject a pending association in exchange jobs search
export const getSavingAssociation = (state: State) => state.savingAssociation;
export const getSavingAssociationSuccess = (state: State) => state.savingAssociationSuccess;
export const getSavingAssociationError = (state: State) => state.savingAssociationError;
export const getShowConfirmUnmatchModal = (state: State) => state.showConfirmUnmatchModal;
