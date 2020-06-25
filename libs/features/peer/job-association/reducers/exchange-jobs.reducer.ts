// Import all exports from our feature's actions
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';

import { createGridReducer } from 'libs/core/reducers/grid.reducer';
import { GridTypeEnum, GenericMenuItem, AggregateResult } from 'libs/models/common';

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
  aggregateResults: AggregateResult[];
  // job family filter
  jobFamilyOptions: GenericMenuItem[];
  selectedJobFamilies: GenericMenuItem[];
  // exchange filter
  exchangeOptions: GenericMenuItem[];
  selectedExchanges: GenericMenuItem[];
  // previous associations
  loadingPreviousAssociations: boolean;
  loadingPreviousAssociationsSuccess: boolean;
  loadingPreviousAssociationsError: boolean;
  previousAssociations: CompanyJob[];
  previousAssociationsToDelete: number[];
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
  aggregateResults: [],

  // job family filter
  jobFamilyOptions: [],
  selectedJobFamilies: [],

  // exchange filter
  exchangeOptions: [],
  selectedExchanges: [],

  // previous associations
  loadingPreviousAssociations: false,
  loadingPreviousAssociationsSuccess: false,
  loadingPreviousAssociationsError: false,
  previousAssociations: [],
  previousAssociationsToDelete: [],
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
          const aggregateResults: AggregateResult[] = featureAction.payload.aggregates;
          const EXCHANGE_JOB_FAMILY_BUCKET_NAME = 'exchange_job_family';
          const EXCHANGE_NAME_BUCKET_NAME = 'exchange_name';

          let jobFamilyOptions: GenericMenuItem[] = [{Value: '', DisplayName: 'No Job Family', IsSelected: false}];
          let exchangeOptions: GenericMenuItem[] = [];

          for (let i = 0; i < aggregateResults.length; i++) {
            const bucketName = aggregateResults[i].BucketName.toLowerCase();
            const genericMenuItems: GenericMenuItem[] = [];
            for (let j = 0; j < aggregateResults[i].Data.length; j++) {
              const value = aggregateResults[i].Data[j].Name;
              const displayName = aggregateResults[i].Data[j].Name + ' (' + aggregateResults[i].Data[j].Value + ')';
              let isSelected = false;
              if (bucketName === EXCHANGE_JOB_FAMILY_BUCKET_NAME) {
                isSelected = featureState.selectedJobFamilies.map(x => x.Value).indexOf(value) >= 0;
              } else if (bucketName === EXCHANGE_NAME_BUCKET_NAME) {
                isSelected = featureState.selectedExchanges.map(x => x.Value).indexOf(value) >= 0;
              }
              genericMenuItems.push({
                Value: value,
                DisplayName: displayName,
                IsSelected: isSelected
              });
            }

            switch (bucketName) {
              case EXCHANGE_JOB_FAMILY_BUCKET_NAME:
                jobFamilyOptions = genericMenuItems;
                break;

              case EXCHANGE_NAME_BUCKET_NAME:
                exchangeOptions = genericMenuItems;
                break;

              default:
                break;
            }
          }
          // Previously selected filters might not comeback in the new aggregates.
          // If they don't come back in the aggregates keep them as checked but with a count of 0
          featureState.selectedJobFamilies.filter(x =>
            jobFamilyOptions.map(options => options.Value).indexOf(x.Value) < 0)
            .forEach(selectedJobFamilyOption =>
              jobFamilyOptions.push({
                Value: selectedJobFamilyOption.Value,
                IsSelected: true,
                DisplayName: selectedJobFamilyOption.Value + ' (0)'
              })
          );

          featureState.selectedExchanges.filter(x =>
            exchangeOptions.map(options => options.Value).indexOf(x.Value) < 0)
            .forEach(selectedExchangeOption =>
              exchangeOptions.push({
                Value: selectedExchangeOption.Value,
                IsSelected: true,
                DisplayName: selectedExchangeOption.Value + ' (0)'
              })
            );

          return {
            ...adapter.setAll(exchangeJobs, featureState),
            total: featureAction.payload.total,
            loading: false,
            loadingError: false,
            badRequestMessage: '',
            aggregateResults: aggregateResults,
            jobFamilyOptions: jobFamilyOptions,
            exchangeOptions: exchangeOptions
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
            ...adapter.setAll(emptyResponse, featureState),
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
        case fromPeerExchangeJobsActions.REMOVE_PREVIOUS_ASSOCIATION: {
          const previousAssociationsToDelete = [...featureState.previousAssociationsToDelete];
          previousAssociationsToDelete.push(featureAction.payload);
          return {
            ...featureState,
            previousAssociationsToDelete: previousAssociationsToDelete
          };
        }
        case fromPeerExchangeJobsActions.UNDO_REMOVE_PREVIOUS_ASSOCIATION: {
          const previousAssociationsToDelete = [...featureState.previousAssociationsToDelete]
            .filter((id) => id !== featureAction.payload);
          return {
            ...featureState,
            previousAssociationsToDelete: previousAssociationsToDelete
          };
        }
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
        case fromPeerExchangeJobsActions.SELECTED_JOB_FAMILIES_CHANGED: {
          return {
            ...featureState,
            selectedJobFamilies: [...action.payload]
          };
        }
        case fromPeerExchangeJobsActions.CLEAR_SELECTED_JOB_FAMILIES: {
          return {
            ...featureState,
            jobFamilyOptions: []
          };
        }
        // exchange filter
        case fromPeerExchangeJobsActions.SELECTED_EXCHANGES_CHANGED: {
          return {
            ...featureState,
            selectedExchanges: [...action.payload]
          };
        }
        case fromPeerExchangeJobsActions.CLEAR_SELECTED_EXCHANGES: {
          return {
            ...featureState,
            selectedExchanges: []
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
export const getJobFamilyFilterOptions = (state: State) => state.jobFamilyOptions;

// Selector functions, exchange filter
export const getExchangeFilterOptions = (state: State) => state.exchangeOptions;
