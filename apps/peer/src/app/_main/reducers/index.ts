import { createSelector, createFeatureSelector } from '@ngrx/store';

// Import root app reducer
import * as fromRoot from 'libs/state/state';

// Import feature reducers
import * as fromExchangeJobMappingReducer from './exchange-job-mapping.reducer';
import * as fromGridReducer from 'libs/common/core/reducers/grid.reducer';
import { IFeatureGridState } from 'libs/common/core/reducers/grid.reducer';

// Feature area state
export interface PeerMainState {
  exchangeJobMapping: IFeatureGridState<fromExchangeJobMappingReducer.State>;
}

// Extend root state with feature area state
export interface State extends fromRoot.State {
  peerMain: PeerMainState;
}

// Feature area reducers
export const reducers = {
  exchangeJobMapping: fromExchangeJobMappingReducer.reducer
};

// Select Feature Area
export const selectFeatureAreaState = createFeatureSelector<PeerMainState>('peerMain');

// Feature Selectors
export const selectExchangeJobMappingState = createSelector(selectFeatureAreaState, (state: PeerMainState) => state.exchangeJobMapping);

// Exchange Job Mapping Selectors
export const selectExchangeJobMappingsFeatureState = createSelector(
  selectExchangeJobMappingState,
  (state: IFeatureGridState<fromExchangeJobMappingReducer.State>) => state.feature
);

export const selectExchangeJobMappingsGridState = createSelector(
  selectExchangeJobMappingState,
  (state: IFeatureGridState<fromExchangeJobMappingReducer.State>) => state.grid
);

export const {
  selectAll: getExchangeJobMappings
} = fromExchangeJobMappingReducer.adapter.getSelectors(selectExchangeJobMappingsFeatureState);

export const getExchangeJobMappingsLoading = createSelector(
  selectExchangeJobMappingsFeatureState,
  fromExchangeJobMappingReducer.getLoading
);

export const getExchangeJobMappingsLoadingError = createSelector(
  selectExchangeJobMappingsFeatureState,
  fromExchangeJobMappingReducer.getLoadingError
);

export const getExchangeJobMappingsTotal = createSelector(
  selectExchangeJobMappingsFeatureState,
  fromExchangeJobMappingReducer.getTotal
);

export const getExchangeJobMappingsGridState = createSelector(
  selectExchangeJobMappingsGridState,
  fromGridReducer.getGridState
);

export const getExchangeJobMappingsQuery = createSelector(
  selectExchangeJobMappingsFeatureState,
  fromExchangeJobMappingReducer.getQuery
);

export const getExchangeJobMappingsGridData = createSelector(
  getExchangeJobMappings,
  getExchangeJobMappingsTotal,
  (data, total) => {
    return { data: data, total: total };
  }
);

export const getExchangeJobMappingGridStateAndQuery = createSelector(
  getExchangeJobMappingsGridState,
  getExchangeJobMappingsQuery,
  (gridState, query)  => {
    return { gridState, query };
  }
);
