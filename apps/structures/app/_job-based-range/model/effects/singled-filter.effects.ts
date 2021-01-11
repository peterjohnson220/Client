import { Injectable } from '@angular/core';

import { Effect } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, map, switchMap, withLatestFrom , filter } from 'rxjs/operators';

import { ScrollIdConstants } from 'libs/features/infinite-scroll/models';
import { JobSearchApiService } from 'libs/data/payfactors-api/search';
import { PayfactorsSearchApiModelMapper, PayfactorsSearchApiHelper } from 'libs/features/search/helpers';
import { InfiniteScrollEffectsService } from 'libs/features/infinite-scroll/services';
import { SearchFilter, JobSearchStructuresAggregationRequest, JobSearchContext } from 'libs/models/payfactors-api';
import { MultiSelectFilter } from 'libs/features/search/models';
import { SearchFeatureIds } from 'libs/features/search/enums/search-feature-ids';
import * as fromSingledFilterActions from 'libs/features/search/actions/singled-filter.actions';
import * as fromSearchReducer from 'libs/features/search/reducers';
import * as fromAddJobsReducer from 'libs/features/add-jobs/reducers';

import * as fromSharedReducer from '../../shared/reducers';

@Injectable()
export class SingledFilterEffects {

  @Effect()
  searchAggregations = this.infiniteScrollEffectsService.infiniteScrollActions$(ScrollIdConstants.SEARCH_SINGLED_FILTER).pipe(
      withLatestFrom(
        this.store.select(fromSearchReducer.getSingledFilter),
        this.store.select(fromSearchReducer.getParentFilters),
        this.store.select(fromSearchReducer.getSingledFilterSearchValue),
        this.store.select(fromAddJobsReducer.getContextStructureRangeGroupId),
        this.store.select(fromSharedReducer.getMetadata),
        this.store.select(fromSearchReducer.getSearchFeatureId),
        (infiniteScrollActionContext, singledFilter, filters, searchValue, contextStructureRangeGroupId: number, metadata, searchFeatureId) => (
          { infiniteScrollActionContext, singledFilter, filters, searchValue, contextStructureRangeGroupId, metadata, searchFeatureId }
        )),
      filter(data => data.searchFeatureId === SearchFeatureIds.AddJobs),
      switchMap(data => {
        const request: JobSearchStructuresAggregationRequest = {
          SearchFields: this.payfactorsSearchApiHelper.getTextFiltersWithValuesAsSearchFields(data.filters),
          Filters: this.payfactorsSearchApiHelper.getSelectedFiltersAsSearchFilters(data.filters),
          StructureRangeGroupId: data.contextStructureRangeGroupId,
          SearchField: data.singledFilter.BackingField,
          TextQuery: data.searchValue,
          Type: JobSearchContext.StructuresJobSearch,
          PagingOptions: data.infiniteScrollActionContext.pagingOptions
        };
        return this.jobSearchApiService.searchStructuresJobAggregations(request).pipe(

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
