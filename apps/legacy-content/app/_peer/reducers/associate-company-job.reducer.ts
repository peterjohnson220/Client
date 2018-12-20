import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';

import { ExchangeJobSearch, CompanyJobSummary } from 'libs/models';

import * as fromAssociateCompanyJobActions from '../actions/associate-company-jobs.actions';

// Extended entity state
export interface State {
    isLoading: boolean;
    hasLoadingError: boolean;
    isAddingAssociation: boolean;
    hasAddingAssociationError: boolean;
    companyJob: CompanyJobSummary;
    exchangeJobSearch: ExchangeJobSearch[];
}

// Initial State
export const initialState: State = {
    isLoading: false,
    hasLoadingError: false,
    isAddingAssociation: false,
    hasAddingAssociationError: false,
    companyJob: null,
    exchangeJobSearch: null
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
