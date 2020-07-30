import { ExchangeJobSearch, GenericKeyValue, LatestCompanyJob } from 'libs/models';

import * as fromAssociateCompanyJobActions from '../actions/associate-company-jobs.actions';

// Extended entity state
export interface State {
    isLoading: boolean;
    hasLoadingError: boolean;
    isAddingAssociation: boolean;
    hasAddingAssociationError: boolean;
    companyJob: LatestCompanyJob;
    exchangeJobSearch: ExchangeJobSearch[];
    loadingExchangeDictionary: boolean;
    loadingExchangeDictionaryError: boolean;
    exchangeDictionary: GenericKeyValue<number, string>[];
    loadingActiveExchange: boolean;
    loadingActiveExchangeError: boolean;
    activeExchange: number;
}

// Initial State
export const initialState: State = {
    isLoading: false,
    hasLoadingError: false,
    isAddingAssociation: false,
    hasAddingAssociationError: false,
    companyJob: null,
    exchangeJobSearch: null,
    loadingExchangeDictionary: false,
    loadingExchangeDictionaryError: false,
    exchangeDictionary: null,
    loadingActiveExchange: false,
    loadingActiveExchangeError: false,
    activeExchange: null
};


export function reducer(
    featureState = initialState,
    featureAction: fromAssociateCompanyJobActions.Actions
): State {
    switch (featureAction.type) {
        case fromAssociateCompanyJobActions.LOAD_COMPANY_JOB: {
            return {
                ...featureState,
                isLoading: true,
                hasLoadingError: false,
                hasAddingAssociationError: false,
                isAddingAssociation: false,
            };
        }
        case fromAssociateCompanyJobActions.LOAD_COMPANY_JOB_SUCCESS: {
            return {
                ...featureState,
                isLoading: false,
                hasLoadingError: false,
                isAddingAssociation: false,
                hasAddingAssociationError: false,
                companyJob: featureAction.payload
            };
        }
        case fromAssociateCompanyJobActions.LOAD_COMPANY_JOB_ERROR: {
            return {
                ...featureState,
                isLoading: false,
                hasLoadingError: true,
                isAddingAssociation: false,
                hasAddingAssociationError: false,
            };
        }
        case fromAssociateCompanyJobActions.LOAD_EXCHANGE_JOBS: {
            return {
                ...featureState,
                exchangeJobSearch: null,
                isLoading: true,
                hasLoadingError: false,
                hasAddingAssociationError: false,
                isAddingAssociation: false
            };
        }
        case fromAssociateCompanyJobActions.LOAD_EXCHANGE_JOBS_SUCCESS: {
            return {
                ...featureState,
                exchangeJobSearch: featureAction.payload,
                isLoading: false,
                hasLoadingError: false,
                isAddingAssociation: false,
                hasAddingAssociationError: false
            };
        }
        case fromAssociateCompanyJobActions.LOAD_EXCHANGE_JOBS_ERROR: {
            return {
                ...featureState,
                isLoading: false,
                hasLoadingError: true,
                isAddingAssociation: false,
                hasAddingAssociationError: false
            };
        }
        case fromAssociateCompanyJobActions.MAP_EXCHANGE_JOB: {
            return {
                ...featureState,
                isLoading: false,
                hasLoadingError: false,
                isAddingAssociation: true,
                hasAddingAssociationError: false,
            };
        }
        case fromAssociateCompanyJobActions.MAP_EXCHANGE_JOB_SUCCESS: {
            return {
                ...featureState,
                isLoading: false,
                hasLoadingError: false,
                isAddingAssociation: false,
                hasAddingAssociationError: false,
            };
        }
        case fromAssociateCompanyJobActions.MAP_EXCHANGE_JOB_ERROR: {
            return {
                ...featureState,
                isLoading: false,
                hasLoadingError: false,
                isAddingAssociation: false,
                hasAddingAssociationError: true,
            };
        }
        case fromAssociateCompanyJobActions.LOAD_EXCHANGE_DICTIONARY: {
          return {
            ...featureState,
            loadingExchangeDictionary: true,
            loadingExchangeDictionaryError: false
          };
        }
        case fromAssociateCompanyJobActions.LOAD_EXCHANGE_DICTIONARY_SUCCESS: {
          return {
            ...featureState,
            exchangeDictionary: featureAction.payload,
            loadingExchangeDictionary: false,
            loadingExchangeDictionaryError: false
          };
        }
        case fromAssociateCompanyJobActions.LOAD_EXCHANGE_DICTIONARY_ERROR: {
          return {
            ...featureState,
            loadingExchangeDictionary: false,
            loadingExchangeDictionaryError: true
          };
        }
        case fromAssociateCompanyJobActions.LOAD_ACTIVE_EXCHANGE: {
          return {
            ...featureState,
            loadingActiveExchange: true,
            loadingActiveExchangeError: false
          };
        }
        case fromAssociateCompanyJobActions.LOAD_ACTIVE_EXCHANGE_SUCCESS: {
          return {
            ...featureState,
            activeExchange: featureAction.payload,
            loadingActiveExchange: false,
            loadingActiveExchangeError: false
          };
        }
        case fromAssociateCompanyJobActions.LOAD_ACTIVE_EXCHANGE_ERROR: {
          return {
            ...featureState,
            loadingActiveExchange: false,
            loadingActiveExchangeError: true
          };
        }
        default: {
            return featureState;
        }
    }
}

export const getIsLoading = (state: State) => state.isLoading;
export const getHasLoadingError = (state: State) => state.hasLoadingError;
export const getIsAdding = (state: State) => state.isAddingAssociation;
export const getHasAddingError = (state: State) => state.hasAddingAssociationError;
export const getExchangeJobs = (state: State) => state.exchangeJobSearch;
export const getCompanyJob = (state: State) => state.companyJob;
export const getLoadingExchangeDictionary = (state: State) => state.loadingExchangeDictionary;
export const getLoadingExchangeDictionaryError = (state: State) => state.loadingExchangeDictionaryError;
export const getExchangeDictionary = (state: State) => state.exchangeDictionary;
export const getLoadingActiveExchange = (state: State) => state.loadingActiveExchange
export const getLoadingActiveExchangeError = (state: State) => state.loadingActiveExchangeError
export const getActiveExchange = (state: State) => state.activeExchange;
