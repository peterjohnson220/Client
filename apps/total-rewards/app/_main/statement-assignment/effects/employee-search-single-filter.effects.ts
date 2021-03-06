import { Injectable } from '@angular/core';

import { Effect } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';

import { ScrollIdConstants } from 'libs/features/search/infinite-scroll/models';
import { PayfactorsSearchApiModelMapper, PayfactorsSearchApiHelper } from 'libs/features/search/search/helpers';
import { InfiniteScrollEffectsService} from 'libs/features/search/infinite-scroll/services';
import { SearchFilter } from 'libs/models/payfactors-api';
import { MultiSelectFilter } from 'libs/features/search/search/models';
import * as fromSingledFilterActions from 'libs/features/search/search/actions/singled-filter.actions';
import * as fromSearchReducer from 'libs/features/search/search/reducers';
import { TotalRewardsSearchApiService } from 'libs/data/payfactors-api/total-rewards';

import * as fromStatementAssignmentReducer from '../reducers';

@Injectable()
export class EmployeeSearchSingleFilterEffects {

  @Effect()
  searchEmployeeAggregations = this.infiniteScrollEffectsService.infiniteScrollActions$(ScrollIdConstants.SEARCH_SINGLED_FILTER).pipe(
    withLatestFrom(
      this.store.select(fromSearchReducer.getSingledFilter),
      this.store.select(fromSearchReducer.getParentFilters),
      this.store.select(fromSearchReducer.getSingledFilterSearchValue),
      this.store.select(fromStatementAssignmentReducer.getStatement),
      (infiniteScrollActionContext, singledFilter, filters, searchValue, statement) => (
        {infiniteScrollActionContext, singledFilter, filters, searchValue, statement}
      )),
    switchMap( data => {
      const request = {
        SearchFields: this.payfactorsSearchApiHelper.getTextFiltersWithValuesAsSearchFields(data.filters),
        Filters: this.payfactorsSearchApiHelper.getSelectedFiltersAsSearchFilters(data.filters),
        PagingOptions: data.infiniteScrollActionContext.pagingOptions,
        SingleFilterAggregateField: data.singledFilter.BackingField,
        SingleFilterAggregateTextQuery: data.searchValue,
        StatementId: data.statement.StatementId
      };

      return this.totalRewardsSearchApiService.searchUnassignedEmployeesAggregations(request).pipe(
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

  constructor(private store: Store<fromStatementAssignmentReducer.State>,
              private infiniteScrollEffectsService: InfiniteScrollEffectsService,
              private payfactorsSearchApiModelMapper: PayfactorsSearchApiModelMapper,
              private payfactorsSearchApiHelper: PayfactorsSearchApiHelper,
              private totalRewardsSearchApiService: TotalRewardsSearchApiService) {
  }
}
