import { Injectable } from '@angular/core';

import { Actions, Effect, ofType } from '@ngrx/effects';
import { map} from 'rxjs/operators';

import * as fromSearchFiltersActions from 'libs/features/search/search/actions/search-filters.actions';

import * as fromExchangeFilterContextActions from '../actions/exchange-filter-context.actions';

@Injectable()
export class ExchangeFilterEffects {

  @Effect()
  toggleMultiSelectOption$ = this.actions$.pipe(
    ofType(fromSearchFiltersActions.TOGGLE_MULTI_SELECT_OPTION),
    map(() => new fromExchangeFilterContextActions.ClearExchangeScopeSelection()));

  @Effect()
  updateRangefilter$ = this.actions$.pipe(
    ofType(fromSearchFiltersActions.UPDATE_RANGE_FILTER),
    map(() => new fromExchangeFilterContextActions.ClearExchangeScopeSelection()));

  @Effect()
  clearFilters$ = this.actions$.pipe(
    ofType(fromSearchFiltersActions.CLEAR_FILTERS, fromSearchFiltersActions.CLEAR_FILTER),
    map(() => new fromExchangeFilterContextActions.ClearExchangeScopeSelection()));

  constructor(
    private actions$: Actions
  ) {}
}
