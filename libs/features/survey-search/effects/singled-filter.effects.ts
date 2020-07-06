import { Injectable } from '@angular/core';

import { Actions, Effect } from '@ngrx/effects';
import { Store} from '@ngrx/store';
import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';

import { MultiSelectFilter } from 'libs/features/search/models';
import { ScrollIdConstants } from 'libs/features/infinite-scroll/models';
import { SurveySearchApiService } from 'libs/data/payfactors-api/search';
import { SearchFilter, SearchSurveyAggregationsRequest } from 'libs/models/payfactors-api';
import { PayfactorsSearchApiModelMapper, PayfactorsSearchApiHelper } from 'libs/features/search/helpers';
import { InfiniteScrollEffectsService } from 'libs/features/infinite-scroll/services';
import * as fromSingledFilterActions from 'libs/features/search/actions/singled-filter.actions';
import * as fromSearchReducer from 'libs/features/search/reducers';

import * as fromSurveySearchReducer from '../reducers';


@Injectable()
export class SingledFilterEffects {

  @Effect()
  searchSurveyAggregations = this.infiniteScrollEffectsService.infiniteScrollActions$(ScrollIdConstants.SEARCH_SINGLED_FILTER)
    .pipe(
      withLatestFrom(
        this.store.select(fromSearchReducer.getSingledFilter),
        this.store.select(fromSearchReducer.getParentFilters),
        this.store.select(fromSurveySearchReducer.getPricingMatchDataSearchContext),
        this.store.select(fromSearchReducer.getSingledFilterSearchValue),
        (infiniteScrollActionContext, singledFilter, filters, context, searchValue) => (
          { infiniteScrollActionContext, singledFilter, filters, context, searchValue}
        )),
      switchMap(data => {
        const request: SearchSurveyAggregationsRequest = {
          SearchFields: this.payfactorsSearchApiHelper.getTextFiltersWithValuesAsSearchFields(data.filters),
          Filters: this.payfactorsSearchApiHelper.getSelectedFiltersAsSearchFilters(data.filters),
          CountryCode: data.context.CountryCode,
          CurrencyCode: data.context.CurrencyCode,
          SearchField: data.singledFilter.BackingField,
          TextQuery: data.searchValue,
          PagingOptions: this.payfactorsSearchApiModelMapper.mapResultsPagingOptionsToPagingOptions(data.infiniteScrollActionContext.pagingOptions)
        };

        return this.surveySearchApiService.searchSurveyAggregations(request).pipe(
          map((response: SearchFilter) => {
            const matchingFilter = <MultiSelectFilter>data.filters.find(f => f.Id === data.singledFilter.Id);
            const currentSelections = matchingFilter.Options.filter(o => o.Selected);

            data.infiniteScrollActionContext.scrollSuccessful(this.store, response);

            return new fromSingledFilterActions.SetSingledFilterOptions(
              {
                newOptions: this.payfactorsSearchApiModelMapper.mapSearchFilterOptionsToMultiSelectOptions(response.Options),
                currentSelections,
                replaceClientOptions: data.infiniteScrollActionContext.isLoadAction
              }
            );
          }),
          catchError(() => data.infiniteScrollActionContext.throwError())
        );
      })
    );

  constructor(
    private actions$: Actions,
    private store: Store<fromSurveySearchReducer.State>,
    private payfactorsSearchApiModelMapper: PayfactorsSearchApiModelMapper,
    private payfactorsSearchApiHelper: PayfactorsSearchApiHelper,
    private surveySearchApiService: SurveySearchApiService,
    private infiniteScrollEffectsService: InfiniteScrollEffectsService
  ) {
  }
}
