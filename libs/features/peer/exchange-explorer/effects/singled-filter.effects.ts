import { Injectable } from '@angular/core';

import {Actions, Effect, ofType} from '@ngrx/effects';
import {select, Store} from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';

import { SearchFilter } from 'libs/models/payfactors-api';
import { PayfactorsSearchApiModelMapper, PayfactorsSearchApiHelper } from 'libs/features/search/helpers';
import { MultiSelectFilter } from 'libs/features/search/models';
import * as fromSingledFilterActions from 'libs/features/search/actions/singled-filter.actions';
import * as fromSearchReducer from 'libs/features/search/reducers';
import * as fromExchangeExplorerReducer from '../reducers';

import * as fromSurveySearchReducer from '../reducers';
import * as fromLibsPeerMapReducer from '../../map/reducers';
import {SearchExchangeAggregationsRequest} from '../../../../models/payfactors-api/peer-exchange-explorer-search/request';
import {ExchangeDataSearchApiService} from '../../../../data/payfactors-api/search/peer';

@Injectable()
export class SingledFilterEffects {

  @Effect()
  exchangeSearchAggregations$ = this.actions$
    .pipe(
      ofType(fromSingledFilterActions.SEARCH_AGGREGATION),
      withLatestFrom(
        this.store.pipe(select(fromSearchReducer.getSingledFilter)),
        this.store.pipe(select(fromSearchReducer.getFilters)),
        this.store.pipe(select(fromExchangeExplorerReducer.getFilterContext)),
        this.store.pipe(select(fromLibsPeerMapReducer.getPeerMapFilter)),
        this.store.pipe(select(fromSearchReducer.getSingledFilterSearchValue)),
        (action: fromSingledFilterActions.SearchAggregation, singledFilter, filters, context, peerMapContext, searchValue) => (
          { action, singledFilter, filters, context, peerMapContext, searchValue }
        )),
      switchMap(data => {
        const request: SearchExchangeAggregationsRequest = {
          ...data.peerMapContext,
          ...data.context,
          SearchFields: this.payfactorsSearchApiHelper.getTextFiltersWithValuesAsSearchFields(data.filters),
          Filters: this.payfactorsSearchApiHelper.getSelectedFiltersAsSearchFilters(data.filters),
          SearchField: data.singledFilter.BackingField,
          TextQuery: data.searchValue
        };

        return this.exchangeDataSearchApiService.searchExchangeAggregations(request).pipe(

          map((response: SearchFilter) => {
            const matchingFilter = <MultiSelectFilter>data.filters.find(f => f.Id === data.singledFilter.Id);
            const currentSelections = matchingFilter.Options.filter(o => o.Selected);

            return new fromSingledFilterActions.SearchAggregationSuccess(
              {
                newOptions: this.payfactorsSearchApiModelMapper.mapSearchFilterOptionsToMultiSelectOptions(response.Options),
                currentSelections
              }
            );
          }),
          catchError(() => of(new fromSingledFilterActions.SearchAggregationError()))
        );
      })
    );

  constructor(
    private actions$: Actions,
    private store: Store<fromSurveySearchReducer.State>,
    private payfactorsSearchApiModelMapper: PayfactorsSearchApiModelMapper,
    private payfactorsSearchApiHelper: PayfactorsSearchApiHelper,
    private exchangeDataSearchApiService: ExchangeDataSearchApiService
  ) {
  }
}
