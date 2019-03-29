// Import all exports from our feature's actions
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';

import { createGridReducer } from 'libs/core/reducers/grid.reducer';
import { GridTypeEnum, GenericMenuItem } from 'libs/models/common';

import * as fromPeerExchangeJobsActions from '../actions/exchange-jobs.actions';
import { CompanyJob, ExchangeJob, ExchangeJobAssociation } from '../models/';

export interface State extends EntityState<ExchangeJob> {
  // grid and search term
  loading: boolean;
  loadingError: boolean;
  loadingErrorMessage: string;
  badRequestMessage: string;
  total: number;
  searchTerm: string;
  ExchangeJobAssociations: ExchangeJobAssociation[];
  selectedExchangeJob: ExchangeJob;
  isDetailPanelExpanded: boolean;
  expandedDetailRowId: number;
  // job family filter
  loadingJobFamilyFilter: boolean;
  loadingJobFamilyFilterSuccess: boolean;
  loadingJobFamilyFilterError: boolean;
  isJobFamilyFilterExpanded: boolean;
  jobFamilyOptions: GenericMenuItem[];
  selectedJobFamilies: GenericMenuItem[];
  // previous associations
  loadingPreviousAssociations: boolean;
  loadingPreviousAssociationsSuccess: boolean;
  loadingPreviousAssociationsError: boolean;
  previousAssociations: CompanyJob[];
}

// Define our Adapter
export const adapter: EntityAdapter<ExchangeJob> = createEntityAdapter<ExchangeJob>({
  selectId: (exchangeJob: ExchangeJob) => exchangeJob.ExchangeJobId
});

// Define our initial state
const initialState: State = adapter.getInitialState({
  // grid and search term
  loading: false,
  loadingError: false,
  loadingErrorMessage: '',
  badRequestMessage: '',
  total: 0,
  searchTerm: '',
  ExchangeJobAssociations: [],
  selectedExchangeJob: {} as ExchangeJob,
  isDetailPanelExpanded: false,
  expandedDetailRowId: null,
  // job family filter
  loadingJobFamilyFilter: false,
  loadingJobFamilyFilterSuccess: false,
  loadingJobFamilyFilterError: false,
  isJobFamilyFilterExpanded: false,
  selectedJobFamilies: [],
  jobFamilyOptions: [],
  // previous associations
  loadingPreviousAssociations: false,
  loadingPreviousAssociationsSuccess: false,
  loadingPreviousAssociationsError: false,
  previousAssociations: []
});

// Reducer function
export function reducer(state, action) {
  return createGridReducer(
    GridTypeEnum.JobAssociationModalPeerExchangeJobs,
    (featureState = initialState,  featureAction: fromPeerExchangeJobsActions.Actions): State => {
      switch (featureAction.type) {
        case fromPeerExchangeJobsActions.RESET: {
          return {
            ...initialState
          };
        }
        case fromPeerExchangeJobsActions.LOAD_EXCHANGE_JOBS: {
          return {
            ...adapter.removeAll(featureState),
            loading: true,
            loadingError: false,
            isDetailPanelExpanded: false
          };
        }
        case fromPeerExchangeJobsActions.LOAD_EXCHANGE_JOBS_SUCCESS: {
          const exchangeJobs: ExchangeJob[] = featureAction.payload.data;
          return {
            ...adapter.addAll(exchangeJobs, featureState),
            total: featureAction.payload.total,
            loading: false,
            loadingError: false,
            badRequestMessage: ''
          };
        }
        case fromPeerExchangeJobsActions.LOAD_EXCHANGE_JOBS_ERROR: {
          return {
            ...featureState,
            loading: false,
            loadingError: true,
            loadingErrorMessage: featureAction.payload
          };
        }
        case fromPeerExchangeJobsActions.LOAD_EXCHANGE_JOBS_BAD_REQUEST: {
          const emptyResponse: ExchangeJob[] = [];
          return {
            ...adapter.addAll(emptyResponse, featureState),
            loading: false,
            badRequestMessage: featureAction.payload
          };
        }
        case fromPeerExchangeJobsActions.UPDATE_SEARCH_TERM: {
          return {
            ...featureState,
            searchTerm: featureAction.payload,
            isDetailPanelExpanded: false
          };
        }
        case fromPeerExchangeJobsActions.ADD_ASSOCIATION: {
          const exchangeJobAssociations = [...featureState.ExchangeJobAssociations];
          exchangeJobAssociations.push(featureAction.payload);
          return {
            ...featureState,
            ExchangeJobAssociations: exchangeJobAssociations
          };
        }
        case fromPeerExchangeJobsActions.REMOVE_ASSOCIATION: {
          const exchangeJobAssociations: ExchangeJobAssociation[] = [];
          featureState.ExchangeJobAssociations.forEach(exchangeJobAssociation => {
            let companyJobs: CompanyJob[] = exchangeJobAssociation.CompanyJobs;
            if (exchangeJobAssociation.ExchangeId === featureAction.exchangeId &&
                exchangeJobAssociation.ExchangeJobId === featureAction.exchangeJobId) {
              companyJobs = exchangeJobAssociation.CompanyJobs
                  .filter(cj => cj.CompanyJobId !== featureAction.companyJobId);
            }
            if (companyJobs.length > 0) {
              exchangeJobAssociations.push({
                ExchangeId: exchangeJobAssociation.ExchangeId,
                ExchangeJobId: exchangeJobAssociation.ExchangeJobId,
                CompanyJobs: companyJobs
              });
            }
          });
          return {
            ...featureState,
            ExchangeJobAssociations: exchangeJobAssociations
          };
        }
        // previous associations
        case fromPeerExchangeJobsActions.LOAD_PREVIOUS_ASSOCIATIONS: {
          return {
            ...featureState,
            loadingPreviousAssociations: true,
            previousAssociations: [],
            expandedDetailRowId: featureAction.payload.ExpandedDetailRowId
          };
        }
        case fromPeerExchangeJobsActions.LOAD_PREVIOUS_ASSOCIATIONS_SUCCESS: {
          return {
            ...featureState,
            loadingPreviousAssociations: false,
            loadingPreviousAssociationsError: false,
            loadingPreviousAssociationsSuccess: true,
            previousAssociations: featureAction.payload
          };
        }
        case fromPeerExchangeJobsActions.LOAD_PREVIOUS_ASSOCIATIONS_ERROR: {
          return {
            ...featureState,
            loadingPreviousAssociations: false,
            loadingPreviousAssociationsError: true,
            loadingPreviousAssociationsSuccess: false
          };
        }
        case fromPeerExchangeJobsActions.SELECT_EXCHANGE_JOB: {
          // close the panel if we're expanded and selecting the same job, otherwise open it
          const isCurrentJobSelected = (featureAction.payload.ExchangeJobId === featureState.selectedExchangeJob.ExchangeJobId);
          const isDetailPanelExpanded = !(isCurrentJobSelected && featureState.isDetailPanelExpanded);

          return {
            ...featureState,
            selectedExchangeJob: featureAction.payload,
            isDetailPanelExpanded
          };
        }
        case fromPeerExchangeJobsActions.TOGGLE_DETAIL_PANEL: {
          return {
            ...featureState,
            isDetailPanelExpanded: !featureState.isDetailPanelExpanded
          };
        }
        case fromPeerExchangeJobsActions.CLOSE_DETAIL_PANEL: {
          return {
            ...featureState,
            isDetailPanelExpanded: false
          };
        }
        // job family filter
        case fromPeerExchangeJobsActions.LOAD_JOB_FAMILY_FILTER: {
          return {
            ...featureState,
            loadingJobFamilyFilter: true,
            loadingJobFamilyFilterError: false
          };
        }
        case fromPeerExchangeJobsActions.LOAD_JOB_FAMILY_FILTER_SUCCESS: {
          return {
            ...featureState,
            loadingJobFamilyFilter: false,
            loadingJobFamilyFilterError: false,
            jobFamilyOptions: featureAction.payload
          };
        }
        case fromPeerExchangeJobsActions.LOAD_JOB_FAMILY_FILTER_ERROR: {
          return {
            ...featureState,
            loadingJobFamilyFilter: false,
            loadingJobFamilyFilterError: true
          };
        }
        case fromPeerExchangeJobsActions.TOGGLE_JOB_FAMILY_FILTER: {
          // if a value is explicitly passed use that as the new isExpanded value, otherwise toggle
          const override = featureAction.payload;
          const isJobFamilyFilterExpanded = (typeof override !== 'undefined') ? override : !featureState.isJobFamilyFilterExpanded;

          return {
            ...featureState,
            isJobFamilyFilterExpanded,
            isDetailPanelExpanded: (isJobFamilyFilterExpanded) ? false : featureState.isDetailPanelExpanded
          };
        }
        case fromPeerExchangeJobsActions.TOGGLE_JOB_FAMILY_FILTER_SELECTION: {
          const actionOption = featureAction.payload;
          const jobFamilyOptions = [];

          // loop through the array, then add each option to the new collection with the appropriate IsSelectedValue
          featureState.jobFamilyOptions.forEach(option => {
            const isSelected =
              (option.DisplayName === actionOption.DisplayName) ? actionOption.IsSelected : option.IsSelected;
            jobFamilyOptions.push({ ...option, IsSelected: isSelected });
          });

          return {
            ...featureState,
            jobFamilyOptions
          };
        }
        case fromPeerExchangeJobsActions.SELECTED_JOB_FAMILIES_CHANGED: {
          return {
            ...featureState,
            selectedJobFamilies:  [...action.payload]
          };
          break;
        }
        case fromPeerExchangeJobsActions.CLEAR_SELECTED_JOB_FAMILIES: {
          // create a new array, and for each option create a new one with IsSelected false
          const selectedJobFamilies = [];
          return {
            ...featureState,
            selectedJobFamilies
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

// Selector functions, grid and search term
export const getLoading = (state: State) => state.loading;
export const getLoadingError = (state: State) => state.loadingError;
export const getTotal = (state: State) => state.total;

// Selector functions, job family filter
export const getJobFamilyFilterLoading = (state: State) => state.loadingJobFamilyFilter;
export const getJobFamilyFilterIsExpanded = (state: State) => state.isJobFamilyFilterExpanded;
export const getJobFamilyFilterOptions = (state: State) => state.jobFamilyOptions;
export const getSelectedJobFamilies = (state: State) => state.selectedJobFamilies;
