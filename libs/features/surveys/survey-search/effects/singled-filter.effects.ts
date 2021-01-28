import { Injectable } from '@angular/core';

import { Actions, Effect } from '@ngrx/effects';
import { Store} from '@ngrx/store';
import { catchError, filter, map, switchMap, withLatestFrom } from 'rxjs/operators';

import { MultiSelectFilter } from 'libs/features/search/search/models';
import { ScrollIdConstants } from 'libs/features/search/infinite-scroll/models';
import { SurveySearchApiService } from 'libs/data/payfactors-api/search';
import { SearchFilter, SearchSurveyAggregationsRequest } from 'libs/models/payfactors-api';
import { PayfactorsSearchApiModelMapper, PayfactorsSearchApiHelper } from 'libs/features/search/search/helpers';
import { InfiniteScrollEffectsService } from 'libs/features/search/infinite-scroll/services';
import { SearchFeatureIds } from 'libs/features/search/search/enums/search-feature-ids';
import * as fromSingledFilterActions from 'libs/features/search/search/actions/singled-filter.actions';
import * as fromSearchReducer from 'libs/features/search/search/reducers';

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
        this.store.select(fromSearchReducer.getSearchFeatureId),
        (infiniteScrollActionContext, singledFilter, filters, context, searchValue, searchFeatureId) => (
          { infiniteScrollActionContext, singledFilter, filters, context, searchValue, searchFeatureId}
        )),
      filter((data) => data.searchFeatureId === SearchFeatureIds.MultiMatch || data.searchFeatureId === SearchFeatureIds.AddSurveyData),
      switchMap(data => {
        const request: SearchSurveyAggregationsRequest = {
          SearchFields: this.payfactorsSearchApiHelper.getTextFiltersWithValuesAsSearchFields(data.filters),
          Filters: this.payfactorsSearchApiHelper.getSelectedFiltersAsSearchFilters(data.filters),
          CountryCode: data.context.CountryCode,
          CurrencyCode: data.context.CurrencyCode,
          SearchField: data.singledFilter.BackingField,
          TextQuery: data.searchValue,
          PagingOptions: data.infiniteScrollActionContext.pagingOptions
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
