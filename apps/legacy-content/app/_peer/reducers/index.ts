import { createSelector, createFeatureSelector } from '@ngrx/store';

// Import root app reducer
import * as fromRoot from 'libs/state/state';
import * as fromDataCutValidationReducer from 'libs/features/peer/guidelines-badge/reducers/data-cut-validation.reducer';

// Import feature reducers
import * as fromAssociateCompanyJobReducer from './associate-company-job.reducer';
import * as fromPaymarketExchangeScopeReducer from './paymarket-exchange-scope.reducer';
import * as fromTaggingEntitiesReducer from './tagging-entities.reducer';

// Feature area state
export interface UpsertPeerDataState {
  associateCompanyJob: fromAssociateCompanyJobReducer.State;
  paymarketExchangeScope: fromPaymarketExchangeScopeReducer.State;
  taggingEntities: fromTaggingEntitiesReducer.State;
}

// Extend root state with feature area state
export interface State extends fromRoot.State {
  legacy_upsertPeerData: UpsertPeerDataState;
}

// Feature area reducers
export const reducers = {
  associateCompanyJob: fromAssociateCompanyJobReducer.reducer,
  paymarketExchangeScope: fromPaymarketExchangeScopeReducer.reducer,
  taggingEntities: fromTaggingEntitiesReducer.reducer
};

// Select Feature Area
export const selectUpsertPeerDataState =
  createFeatureSelector<UpsertPeerDataState>('legacy_upsertPeerData');

// Feature Selectors
export const selectAssociateCompanyJobState =
  createSelector(selectUpsertPeerDataState, (state: UpsertPeerDataState) => state.associateCompanyJob);
export const selectPaymarketExchangeState =
  createSelector(selectUpsertPeerDataState, (state: UpsertPeerDataState) => state.paymarketExchangeScope);
export const selectTaggingEntitiesState =
  createSelector(selectUpsertPeerDataState, (state: UpsertPeerDataState) => state.taggingEntities);

// Associate Company Job Selectors
export const getExchangeSearchResult = createSelector(
  selectAssociateCompanyJobState,
  fromAssociateCompanyJobReducer.getExchangeJobs
);

export const getIsLoading = createSelector(
  selectAssociateCompanyJobState,
  fromAssociateCompanyJobReducer.getIsLoading
);

export const getHasLoadingError = createSelector(
  selectAssociateCompanyJobState,
  fromAssociateCompanyJobReducer.getHasLoadingError
);

export const getIsAdding = createSelector(
  selectAssociateCompanyJobState,
  fromAssociateCompanyJobReducer.getIsAdding
);

export const getHasAddingError = createSelector(
  selectAssociateCompanyJobState,
  fromAssociateCompanyJobReducer.getHasAddingError
);

export const getCompanyJob = createSelector(
  selectAssociateCompanyJobState,
  fromAssociateCompanyJobReducer.getCompanyJob
);

export const getLoadingExchangeDictionary = createSelector(
  selectAssociateCompanyJobState,
  fromAssociateCompanyJobReducer.getLoadingExchangeDictionary
);

export const getLoadingExchangeDictionaryError = createSelector(
  selectAssociateCompanyJobState,
  fromAssociateCompanyJobReducer.getLoadingExchangeDictionaryError
);

export const getExchangeDictionaryForCompany = createSelector(
  selectAssociateCompanyJobState,
  fromAssociateCompanyJobReducer.getExchangeDictionary
);

export const getLoadingActiveExchange = createSelector(
  selectAssociateCompanyJobState,
  fromAssociateCompanyJobReducer.getLoadingActiveExchange
);

export const getLoadingActiveExchangeError = createSelector(
  selectAssociateCompanyJobState,
  fromAssociateCompanyJobReducer.getLoadingActiveExchangeError
);
export const getActiveExchange = createSelector(
  selectAssociateCompanyJobState,
  fromAssociateCompanyJobReducer.getActiveExchange
);

// Paymarket Exchange Scope Selectors
export const getExchangeScopesIsLoading = createSelector(
  selectPaymarketExchangeState,
  fromPaymarketExchangeScopeReducer.getExchangeScopesIsLoading
);

export const getExchangeScopeLoadingError = createSelector(
  selectPaymarketExchangeState,
  fromPaymarketExchangeScopeReducer.getExchangeScopeLoadingError
);

export const getExchangeScopes = createSelector(
  selectPaymarketExchangeState,
  fromPaymarketExchangeScopeReducer.getExchangeScopes
);

export const getSelectedExchangeScopes = createSelector(
  selectPaymarketExchangeState,
  fromPaymarketExchangeScopeReducer.getSelectedExchangeScopes
);

// Tagging Entities Selectors
export const getTagInformationLoading = createSelector(
  selectTaggingEntitiesState,
  fromTaggingEntitiesReducer.getTagInformationLoading
);

export const getTagInformationLoadingError = createSelector(
  selectTaggingEntitiesState,
  fromTaggingEntitiesReducer.getTagInformationLoadingError
);

export const getTagInformation = createSelector(
  selectTaggingEntitiesState,
  fromTaggingEntitiesReducer.getTagInformation
);

export const getSavingTagInformation = createSelector(
  selectTaggingEntitiesState,
  fromTaggingEntitiesReducer.getSavingTagInformation
);

export const getSavingTagInformationError = createSelector(
  selectTaggingEntitiesState,
  fromTaggingEntitiesReducer.getSavingTagInformationError
);

export const getAddedTags = createSelector(
  selectTaggingEntitiesState,
  fromTaggingEntitiesReducer.getAddedTags
);

export const getRemovedTags = createSelector(
  selectTaggingEntitiesState,
  fromTaggingEntitiesReducer.getRemovedTags
);
