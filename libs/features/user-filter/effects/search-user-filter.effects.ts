import { Injectable } from '@angular/core';

import { Actions, Effect } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { mergeMap, withLatestFrom } from 'rxjs/operators';

import * as fromSearchReducer from 'libs/features/search/reducers';
import * as fromSearchResultsActions from 'libs/features/search/actions/search-results.actions';
import * as fromSearchFiltersActions from 'libs/features/search/actions/search-filters.actions';
import * as fromSingledFilterActions from 'libs/features/search/actions/singled-filter.actions';
import { FiltersHelper } from 'libs/features/search/helpers';
import { MultiSelectFilter } from 'libs/features/search/models';

import * as fromSaveFilterModalActions from '../actions/save-filter-modal.actions';
import * as fromSavedFiltersPopover from '../actions/saved-filters-popover.actions';
import * as fromUserFilterActions from '../actions/user-filter.actions';
import * as fromUserFilterReducer from '../reducers';

@Injectable()
export class SearchUserFilterEffects {
  @Effect()
  createSavedFilter$ = this.actions$
    .ofType(fromSaveFilterModalActions.CREATE_SAVED_FILTER)
    .pipe(
      withLatestFrom(
        this.store.select(fromSearchReducer.getFilters),
        (action: fromSaveFilterModalActions.CreateSavedFilter, filters) => ({ action, filters })),
      mergeMap(data => {
        const actions = [];
        const selectedFilters = FiltersHelper.getMultiSelectFiltersWithSelections(data.filters);
        actions.push(new fromSaveFilterModalActions.SetModalData({
          Name: '',
          SetAsDefault: false,
          SearchFiltersToSave: selectedFilters.filter(f => !f.Locked && !f.SaveDisabled)
        }));
        actions.push(new fromSaveFilterModalActions.OpenSaveModal());

        return actions;
      })
    );

  @Effect()
  selectSavedFilter$ = this.actions$
  .ofType(fromUserFilterActions.SELECT_SAVED_FILTER)
  .pipe(
    withLatestFrom(
      this.store.select(fromSearchReducer.getSearchingFilter),
      this.store.select(fromSearchReducer.getSingledFilter),
      (action: fromUserFilterActions.SelectSavedFilter, searchingFilter, singledFilter) =>
        ({ action, searchingFilter, singledFilter })),
    mergeMap(data => {
      const actions = [];
      const savedFilters = data.action.payload.Filters;

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
  toggleSavedFilterSelection$ = this.actions$
  .ofType(fromSavedFiltersPopover.TOGGLE_SAVED_FILTER_SELECTION)
  .pipe(
    withLatestFrom(
      this.store.select(fromUserFilterReducer.getSelectedSavedFilter),
      this.store.select(fromSearchReducer.getSearchingFilter),
      (action: fromSavedFiltersPopover.ToggleSavedFilterSelection, selectedSavedFilter, searchingFilter) =>
        ({ action, selectedSavedFilter, searchingFilter })
    ),
    mergeMap(data => {
      const actions = [];
      const currentSavedFilter = data.action.payload;
      if (!!data.selectedSavedFilter && data.selectedSavedFilter.Id === currentSavedFilter.Id) {
        actions.push(new fromUserFilterActions.UnselectSavedFilter());
        actions.push(new fromSearchFiltersActions.ClearSavedFilters(data.selectedSavedFilter.Filters));
        actions.push(new fromSearchResultsActions.GetResults({ keepFilteredOutOptions: false, searchAggregation: data.searchingFilter }));
      } else {
        actions.push(new fromUserFilterActions.SelectSavedFilter(currentSavedFilter));
      }

      return actions;
    })
  );

  @Effect()
  deleteSavedFilterSuccess$ = this.actions$
  .ofType(fromUserFilterActions.DELETE_SUCCESS)
  .pipe(
    withLatestFrom(
      this.store.select(fromUserFilterReducer.getSelectedSavedFilter),
      (action: fromUserFilterActions.DeleteSuccess, currentSelectedSavedFilter) =>
        ({action, currentSelectedSavedFilter})),
    mergeMap((data) => {
      const actions = [];
      if (!!data.currentSelectedSavedFilter && data.action.payload.deletedFilterId === data.currentSelectedSavedFilter.Id) {
        actions.push(new fromSavedFiltersPopover.ToggleSavedFilterSelection(data.currentSelectedSavedFilter));
      }
      actions.push(new fromUserFilterActions.GetAll());
      return actions;
    })
  );

  @Effect()
  toggleMultiSelectOption$ = this.actions$
  .ofType(fromSearchFiltersActions.TOGGLE_MULTI_SELECT_OPTION)
  .pipe(
    mergeMap(() => [
      new fromUserFilterActions.UnselectSavedFilter()
    ])
  );

  @Effect()
  saveFilterSuccess$ = this.actions$
  .ofType(fromUserFilterActions.UPSERT_SUCCESS)
  .pipe(
    mergeMap(() => {
      const actions = [];
      actions.push(new fromSaveFilterModalActions.CloseSaveModal());
      actions.push(new fromUserFilterActions.GetAll());
      return actions;
    })
  );

  constructor(
    private actions$: Actions,
    private store: Store<fromUserFilterReducer.State>
  ) { }
}
