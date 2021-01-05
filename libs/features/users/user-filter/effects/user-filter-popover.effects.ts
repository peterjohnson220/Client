import { Injectable } from '@angular/core';

import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { mergeMap, withLatestFrom } from 'rxjs/operators';

import * as fromSearchReducer from 'libs/features/search/search/reducers';
import * as fromSearchResultsActions from 'libs/features/search/search/actions/search-results.actions';
import * as fromSearchFiltersActions from 'libs/features/search/search/actions/search-filters.actions';
import * as fromSingledFilterActions from 'libs/features/search/search/actions/singled-filter.actions';
import { MultiSelectFilter } from 'libs/features/search/search/models';

import * as fromUserFilterPopoverActions from '../actions/user-filter-popover.actions';
import * as fromUserFilterActions from '../actions/user-filter.actions';
import * as fromUserFilterReducer from '../reducers';

@Injectable()
export class UserFilterPopoverEffects {
  @Effect()
  selectSavedFilter$ = this.actions$
  .pipe(
    ofType(fromUserFilterPopoverActions.SELECT),
    withLatestFrom(
      this.store.select(fromSearchReducer.getSearchingFilter),
      this.store.select(fromSearchReducer.getSingledFilter),
      (action: fromUserFilterPopoverActions.Select, searchingFilter, singledFilter) =>
        ({ action, searchingFilter, singledFilter })),
    mergeMap(data => {
      const actions = [];
      const savedFilters = data.action.payload.Filters;

      actions.push(new fromUserFilterActions.SetSelected({ id: data.action.payload.Id, selected: true }));
      if (data.searchingFilter) {
        const savedFiltersSearchingFilter = <MultiSelectFilter>savedFilters.find(sf => sf.Id === data.singledFilter.Id);
        const selections = !!savedFiltersSearchingFilter ? savedFiltersSearchingFilter.Options : [];

        actions.push(new fromSingledFilterActions.ApplySelections(selections));
      }

      actions.push(new fromSearchFiltersActions.ApplySavedFilters(savedFilters));
      actions.push(new fromSearchResultsActions.GetResults({ keepFilteredOutOptions: false, searchAggregation: data.searchingFilter }));

      return actions;
    })
  );

  @Effect()
  unselectSavedFilter$ = this.actions$
  .pipe(
    ofType(fromUserFilterPopoverActions.UNSELECT),
    withLatestFrom(
      this.store.select(fromSearchReducer.getSearchingFilter),
      (action: fromUserFilterPopoverActions.Unselect, searchingFilter) =>
        ({ action, searchingFilter })
    ),
    mergeMap(data => {
      const actions = [];
      const savedFilter = data.action.payload;
      actions.push(new fromUserFilterActions.SetSelected({ id: savedFilter.Id, selected: false }));
      actions.push(new fromSearchFiltersActions.ClearSavedFilters(savedFilter.Filters));
      actions.push(new fromSearchResultsActions.GetResults({ keepFilteredOutOptions: false, searchAggregation: data.searchingFilter }));

      return actions;
    })
  );

  @Effect()
  toggleSavedFilterSelection$ = this.actions$
  .pipe(
    ofType(fromUserFilterPopoverActions.TOGGLE_SAVED_FILTER_SELECTION),
    withLatestFrom(
      this.store.select(fromUserFilterReducer.getSelectedSavedFilter),
      (action: fromUserFilterPopoverActions.ToggleSavedFilterSelection, selectedSavedFilter) =>
        ({ action, selectedSavedFilter })
    ),
    mergeMap(data => {
      const actions = [];
      const currentSavedFilter = data.action.payload;
      if (!!data.selectedSavedFilter && data.selectedSavedFilter.Id === currentSavedFilter.Id) {
        actions.push(new fromUserFilterPopoverActions.Unselect(currentSavedFilter));
      } else {
        actions.push(new fromUserFilterPopoverActions.Select(currentSavedFilter));
      }

      return actions;
    })
  );

  @Effect()
  deleteSavedFilterSuccess$ = this.actions$
  .pipe(
    ofType(fromUserFilterActions.DELETE_SUCCESS),
    withLatestFrom(
      this.store.select(fromUserFilterReducer.getSelectedSavedFilter),
      (action: fromUserFilterActions.DeleteSuccess, currentSelectedSavedFilter) =>
        ({action, currentSelectedSavedFilter})),
    mergeMap((data) => {
      const actions = [];
      if (!!data.currentSelectedSavedFilter && data.action.payload.deletedFilterId === data.currentSelectedSavedFilter.Id) {
        actions.push(new fromUserFilterPopoverActions.ToggleSavedFilterSelection(data.currentSelectedSavedFilter));
      }
      actions.push(new fromUserFilterActions.GetAll());
      return actions;
    })
  );

  constructor(
    private actions$: Actions,
    private store: Store<fromUserFilterReducer.State>
  ) { }
}
