import { HostListener, Injectable } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import * as fromSharedReducer from '../../../reducers';
import * as fromSearchFiltersActions from '../../../actions/search-filters.actions';
import * as fromSurveyResultsActions from '../../../actions/search-results.actions';
import * as fromSavedFiltersActions from '../../../actions/saved-filters.actions';
import * as fromSearchActions from '../../../actions/search.actions';

@Injectable()
export abstract class SurveySearchBase {
  numberOfResults$: Observable<number>;
  searchingFilter$: Observable<boolean>;

  protected constructor(
    protected store: Store<fromSharedReducer.State>
  ) {
    this.numberOfResults$ = this.store.select(fromSharedReducer.getResultsTotal);
    this.searchingFilter$ = this.store.select(fromSharedReducer.getSearchingFilter);
  }

  // Listen for messages to the window
  @HostListener('window:message', ['$event'])
  onMessage(event: MessageEvent) {
    if (!event.data || !event.data.payfactorsMessage) {
      return;
    }

    switch (event.data.payfactorsMessage.type) {
      case 'Set Context':
        // Always reset the app before setting the context (on open)
        this.resetApp();
        this.onSetContext(event.data.payfactorsMessage.payload);
        break;
    }
  }

  private resetApp() {
    this.store.dispatch(new fromSavedFiltersActions.CloseSaveFilterModal());
    this.store.dispatch(new fromSearchFiltersActions.RemoveFilters());
    this.store.dispatch(new fromSurveyResultsActions.ClearResults());
    this.store.dispatch(new fromSurveyResultsActions.ClearDataCutSelections());
    this.store.dispatch(new fromSearchActions.HideFilterSearch());
    this.store.dispatch(new fromSavedFiltersActions.ClearSavedFilters());
    this.store.dispatch(new fromSavedFiltersActions.CloseSavedFiltersPopover());
    this.onResetApp();
  }

  onResetApp?(): void;
  onSetContext?(payload: any): void;
}
