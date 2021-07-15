import { Injectable } from '@angular/core';

import { Effect } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, map, switchMap, withLatestFrom, filter } from 'rxjs/operators';

import { ScrollIdConstants } from 'libs/features/search/infinite-scroll/models';
import { JobSearchApiService } from 'libs/data/payfactors-api/search';
import { PayfactorsSearchApiModelMapper, PayfactorsSearchApiHelper } from 'libs/features/search/search/helpers';
import { InfiniteScrollEffectsService } from 'libs/features/search/infinite-scroll/services';
import { SearchFilter, JobSearchContext } from 'libs/models/payfactors-api';
import { MultiSelectFilter } from 'libs/features/search/search/models';
import { JobSearchAggregationRequest } from 'libs/models/payfactors-api';
import { SearchFeatureIds } from 'libs/features/search/search/enums/search-feature-ids';
import * as fromSingledFilterActions from 'libs/features/search/search/actions/singled-filter.actions';
import * as fromSearchReducer from 'libs/features/search/search/reducers';
import * as fromAddJobsReducer from 'libs/features/jobs/add-jobs/reducers';

@Injectable()
export class SingledFilterEffects {

  @Effect()
  searchSurveyAggregations = this.infiniteScrollEffectsService.infiniteScrollActions$(ScrollIdConstants.SEARCH_SINGLED_FILTER).pipe(
      withLatestFrom(
        this.store.select(fromSearchReducer.getSingledFilter),
        this.store.select(fromSearchReducer.getParentFilters),
        this.store.select(fromAddJobsReducer.getContext),
        this.store.select(fromSearchReducer.getSingledFilterSearchValue),
        this.store.select(fromSearchReducer.getSearchFeatureId),
        (infiniteScrollActionContext, singledFilter, filters, context, searchValue, searchFeatureId) => (
          { infiniteScrollActionContext, singledFilter, filters, context, searchValue, searchFeatureId }
        )),
      filter((data) => data.searchFeatureId === SearchFeatureIds.AddJobs),
      switchMap(data => {
        const request: JobSearchAggregationRequest = {
          SearchFields: this.payfactorsSearchApiHelper.getTextFiltersWithValuesAsSearchFields(data.filters),
          Filters: this.payfactorsSearchApiHelper.getSelectedFiltersAsSearchFilters(data.filters),
          ProjectId: data.context.ProjectId,
          SearchField: data.singledFilter.BackingField,
          TextQuery: data.searchValue,
          PayMarketId: data.context.PayMarketId,
          Type: JobSearchContext.ProjectJobSearch,
          PagingOptions: data.infiniteScrollActionContext.pagingOptions
        };

        return this.jobSearchApiService.searchJobAggregations(request).pipe(

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
    private store: Store<fromAddJobsReducer.State>,
    private payfactorsSearchApiModelMapper: PayfactorsSearchApiModelMapper,
    private payfactorsSearchApiHelper: PayfactorsSearchApiHelper,
    private jobSearchApiService: JobSearchApiService,
    private infiniteScrollEffectsService: InfiniteScrollEffectsService
  ) {
  }
}
