import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';

import { ExchangeSearchFilterAggregate } from 'libs/models/peer';
import { GridTypeEnum } from 'libs/models/common';
import { createGridReducer } from 'libs/core/reducers/grid.reducer';

import * as fromExchangeFiltersActions from '../actions/exchange-filters.actions';

// Extended Entity State
export interface State extends EntityState<ExchangeSearchFilterAggregate> {
  loading: boolean;
  loadingError: boolean;
  total: number;
}

// Sort by Ordinal
export function sortByOrdinal(o1: ExchangeSearchFilterAggregate, o2: ExchangeSearchFilterAggregate): number {
  return o1.Ordinal - o2.Ordinal;
}

// Create entity adapter
export const adapter: EntityAdapter<ExchangeSearchFilterAggregate> = createEntityAdapter<ExchangeSearchFilterAggregate>({
  selectId: (exchangeSearchFilterAggregateInfo: ExchangeSearchFilterAggregate) => exchangeSearchFilterAggregateInfo.Id,
  sortComparer: sortByOrdinal
});

// Initial State
export const initialState: State = adapter.getInitialState({
  loading: false,
  loadingError: false,
  total: 0
});

// Reducer
export function reducer(state, action) {
  return createGridReducer(
    GridTypeEnum.ExchangeFilters,
    (featureState = initialState, featureAction: fromExchangeFiltersActions.Actions): State => {
      switch (featureAction.type) {
        case fromExchangeFiltersActions.LOAD_EXCHANGE_FILTERS: {
          return {
            ...adapter.removeAll(featureState),
            loading: true,
            loadingError: false
          };
        }
        case fromExchangeFiltersActions.LOAD_EXCHANGE_FILTERS_SUCCESS: {
          const filters: ExchangeSearchFilterAggregate[] = featureAction.payload.data;
          return {
            ...adapter.addAll(filters, featureState),
            loading: false,
            loadingError: false,
            total: action.payload.total
          };
        }
        case fromExchangeFiltersActions.LOAD_EXCHANGE_FILTERS_ERROR: {
          return {
            ...featureState,
            loading: false,
            loadingError: true
          };
        }
        case fromExchangeFiltersActions.PUT_FILTER: {
          const id = action.payload.Id;
          const change = action.payload.IsDisabled !== true;
          return {
            ...adapter.updateOne({ id: id, changes: { IsDisabled: change } }, featureState)
          };
        }
        case fromExchangeFiltersActions.REORDER_FILTERS: {
          return {
            ...adapter.updateMany(action.payload.map((filter, index) =>
              Object.assign({}, {id: filter.Id, changes: { Ordinal: index + 1 }})),  featureState)
          };
        }
        default: {
          return featureState;
        }
      }
    })(state, action);
}

// Selector Functions
export const getLoading = (state: State) => state.loading;
export const getLoadingError = (state: State) => state.loadingError;
export const getTotal = (state: State) => state.total;
