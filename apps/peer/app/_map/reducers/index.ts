import { createSelector, createFeatureSelector } from '@ngrx/store';

// Import root app reducer
import { IFeatureGridState } from 'libs/core/reducers/grid.reducer';
import * as fromRoot from 'libs/state/state';
import * as fromGridReducer from 'libs/core/reducers/grid.reducer';

import * as fromExchangeScopeReducer from './exchange-scope.reducer';
import * as fromExchangeCompanyJobsReducer from '../reducers/exchange-company-job-grid.reducer';
import * as fromExportDataCutsReducer from '../reducers/export-data-cuts.reducer';

// Feature area state
export interface PeerMapState {
  exchangeScope: fromExchangeScopeReducer.State;
  exportDataCuts: fromExportDataCutsReducer.State;
  exchangeCompanyJobsGrid: IFeatureGridState<fromExchangeCompanyJobsReducer.State>;
}

// Extend root state with feature area state
export interface State extends fromRoot.State {
  peer_map: PeerMapState;
}

// Feature area reducers
export const reducers = {
  exchangeScope: fromExchangeScopeReducer.reducer,
  exportDataCuts: fromExportDataCutsReducer.reducer,
  exchangeCompanyJobsGrid: fromExchangeCompanyJobsReducer.reducer
};

// Select Feature Area
export const selectFeatureAreaState = createFeatureSelector<PeerMapState>('peer_map');

// Feature Selectors
export const selectExchangeScopeState = createSelector(
  selectFeatureAreaState,
  (state: PeerMapState) => state.exchangeScope
);

export const selectExchangeCompanyJobsState = createSelector(
  selectFeatureAreaState,
  (state: PeerMapState) => state.exchangeCompanyJobsGrid
);

export const selectExportDataCutsState = createSelector(
  selectFeatureAreaState,
  (state: PeerMapState) => state.exportDataCuts
);


// Exchange Scope Selectors
export const getExchangeScopeUpserting = createSelector(
  selectExchangeScopeState,
  fromExchangeScopeReducer.getUpserting
);

export const getExchangeScopeUpsertingError = createSelector(
  selectExchangeScopeState,
  fromExchangeScopeReducer.getUpsertingError
);

export const getSaveExchangeScopeModalOpen = createSelector(
  selectExchangeScopeState,
  fromExchangeScopeReducer.getSaveModalOpen
);

// Export Data Cuts
export const getDataCutsExporting = createSelector(
  selectExportDataCutsState,
  fromExportDataCutsReducer.getExporting
);

export const getDataCutsExportingError = createSelector(
  selectExportDataCutsState,
  fromExportDataCutsReducer.getExportingError
);

export const getExportDataCutsModalOpen = createSelector(
  selectExportDataCutsState,
  fromExportDataCutsReducer.getExportDataCutsModalOpen
);

export const getExportDataCutsModalCurrencies = createSelector(
  selectExportDataCutsState,
  fromExportDataCutsReducer.getCurrencies
);

// Exchange Company Jobs Grid
export const selectExchangeCompanyJobsFeatureState = createSelector(
  selectExchangeCompanyJobsState,
  (state: IFeatureGridState<fromExchangeCompanyJobsReducer.State>) => state.feature
);

export const selectExchangeCompanyJobsGridState = createSelector(
  selectExchangeCompanyJobsState,
  (state: IFeatureGridState<fromExchangeCompanyJobsReducer.State>) => state.grid
);

export const {
  selectAll: getExchangeCompanyJobs
} = fromExchangeCompanyJobsReducer.adapter.getSelectors(selectExchangeCompanyJobsFeatureState);

export const getExchangeCompanyJobsLoading = createSelector(
  selectExchangeCompanyJobsFeatureState,
  fromExchangeCompanyJobsReducer.getLoading
);

export const getExchangeCompanyJobsLoadingError = createSelector(
  selectExchangeCompanyJobsFeatureState,
  fromExchangeCompanyJobsReducer.getLoadingError
);

export const getExchangeCompanyJobsTotal = createSelector(
  selectExchangeCompanyJobsFeatureState,
  fromExchangeCompanyJobsReducer.getTotal
);

export const getExchangeCompanyJobsGridSelections = createSelector(
  selectExchangeCompanyJobsGridState,
  fromGridReducer.getGridSelections
);

export const getExchangeCompanyJobsGridSelectAllState = createSelector(
  selectExchangeCompanyJobsGridState,
  fromGridReducer.getGridSelectAllState
);

export const getExchangeCompanyJobsGridState = createSelector(
  selectExchangeCompanyJobsGridState,
  fromGridReducer.getGridState
);

export const getExchangeCompanyJobsGridData = createSelector(
  getExchangeCompanyJobs,
  getExchangeCompanyJobsTotal,
  (data, total) => {
    return { data: data, total: total };
  }
);

export const getExchangeCompanyJobsAllIds = createSelector(
  selectExchangeCompanyJobsFeatureState,
  fromExchangeCompanyJobsReducer.getAllIds
);
