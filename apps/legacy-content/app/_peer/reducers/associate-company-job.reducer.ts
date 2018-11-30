import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';

import { ExchangeJobSearch } from 'libs/models';

import * as fromAssociateCompanyJobActions from '../actions/associate-company-jobs.actions';

// Extended entity state
export interface State extends EntityState<ExchangeJobSearch> {
    isLoading: boolean;
    hasLoadingError: boolean;
    isAddingAssociation: boolean;
    hasAddingAssociationError: boolean;
}

// Create entity adapter
export const adapter: EntityAdapter<ExchangeJobSearch> = createEntityAdapter<ExchangeJobSearch>({
    selectId: (exchangeJob: ExchangeJobSearch) => exchangeJob.ExchangeJobId
});

// Initial State
export const initialState: State = adapter.getInitialState({
    isLoading: false,
    hasLoadingError: false,
    isAddingAssociation: false,
    hasAddingAssociationError: false
});


export function reducer(
    featureState = initialState,
    featureAction: fromAssociateCompanyJobActions.Actions
): State {
    switch (featureAction.type) {
        case fromAssociateCompanyJobActions.LOAD_EXCHANGE_JOBS: {
            return {
                ...adapter.removeAll(featureState),
                isLoading: true,
                hasLoadingError: false,
                hasAddingAssociationError: false,
                isAddingAssociation: false
            };
        }
        case fromAssociateCompanyJobActions.LOAD_EXCHANGE_JOBS_SUCCESS: {
            const jobs: ExchangeJobSearch[] = featureAction.payload;
            return {
                ...adapter.addAll(jobs, featureState),
                isLoading: false,
            };
        }
        case fromAssociateCompanyJobActions.LOAD_EXCHANGE_JOBS_ERROR: {
            return {
                ...featureState,
                isLoading: false,
                hasLoadingError: true
            };
        }
        case fromAssociateCompanyJobActions.MAP_EXCHANGE_JOB: {
            return {
                ...featureState,
                isAddingAssociation: true
            };
        }
        case fromAssociateCompanyJobActions.MAP_EXCHANGE_JOB_SUCCESS: {
            return {
                ...featureState,
                isAddingAssociation: false
            };
        }
        case fromAssociateCompanyJobActions.MAP_EXCHANGE_JOB_ERROR: {
            return {
                ...featureState,
                isAddingAssociation: false,
                hasAddingAssociationError: true
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
