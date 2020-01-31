import {Injectable} from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import * as fromChildFilterActions from '../../../search/actions/child-filter.actions';
import {catchError, map, switchMap, withLatestFrom} from 'rxjs/operators';
import {select, Store} from '@ngrx/store';
import * as fromSearchReducer from '../../../search/reducers';
import {SearchExchangeAggregationsRequest} from '../../../../models/payfactors-api/peer/exchange-data-search/request';
import {SearchFilter} from '../../../../models/payfactors-api/search/response';
import {MultiSelectFilter} from '../../../search/models';
import {of} from 'rxjs';
import {PayfactorsSearchApiModelMapper} from '../../../search/helpers';
import {ExchangeDataSearchApiService} from '../../../../data/payfactors-api/search/peer';
import {ExchangeExplorerContextService} from '../services';

@Injectable()
export class ChildFilterEffects {
  @Effect()
  exchangeSearchAggregations$ = this.actions$
    .pipe(
      ofType(fromChildFilterActions.SEARCH_AGGREGATION),
      withLatestFrom(
        this.exchangeExplorerContextService.selectFilterContext(),
        this.searchStore.pipe(select(fromSearchReducer.getChildFilter)),
        this.searchStore.pipe(select(fromSearchReducer.getChildFilterSearchValue)),
        this.searchStore.pipe(select(fromSearchReducer.getSubFilters)),
        (action, filterContext, singledFilter, searchValue, filters) => ({
          filterContext, singledFilter, searchValue, filters
        })),
      switchMap(data => {
        const request: SearchExchangeAggregationsRequest = {
          ...data.filterContext,
          SearchField: data.singledFilter.BackingField,
          TextQuery: data.searchValue
        };

        return this.exchangeDataSearchApiService.searchExchangeAggregations(request).pipe(
          map((response: SearchFilter) => {
            const matchingFilter = <MultiSelectFilter>data.filters.find(f => f.Id === data.singledFilter.Id);
            const currentSelections = matchingFilter.Options.filter(o => o.Selected);

            return new fromChildFilterActions.SearchAggregationSuccess(
              {
                newOptions: this.payfactorsSearchApiModelMapper.mapSearchFilterOptionsToMultiSelectOptions(response.Options),
                currentSelections
              }
            );
          }),
          catchError(() => of(new fromChildFilterActions.SearchAggregationError()))
        );
      })
    );

  constructor(
    private actions$: Actions,
    private searchStore: Store<fromSearchReducer.State>,
    private payfactorsSearchApiModelMapper: PayfactorsSearchApiModelMapper,
    private exchangeDataSearchApiService: ExchangeDataSearchApiService,
    private exchangeExplorerContextService: ExchangeExplorerContextService
  ) {
  }
}
