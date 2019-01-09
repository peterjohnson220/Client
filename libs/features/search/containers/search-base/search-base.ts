import { HostListener, Injectable } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import * as fromSearchFiltersActions from 'libs/features/search/actions/search-filters.actions';
import * as fromSavedFiltersActions from 'libs/features/search/actions/saved-filters.actions';
import * as fromSearchPageActions from 'libs/features/search/actions/search-page.actions';
import * as fromSearchResultsActions from 'libs/features/search/actions/search-results.actions';
import * as fromSearchReducer from 'libs/features/search/reducers';

@Injectable()
export abstract class SearchBase {
  numberOfResults$: Observable<number>;
  searchingFilter$: Observable<boolean>;

  protected constructor(
    protected store: Store<fromSearchReducer.State>
  ) {
    this.numberOfResults$ = this.store.select(fromSearchReducer.getNumberOfResultsOnServer);
    this.searchingFilter$ = this.store.select(fromSearchReducer.getSearchingFilter);
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

  handleCancelClicked() {
    this.store.dispatch(new fromSearchPageActions.CloseSearchPage());
  }

  private resetApp() {
    this.store.dispatch(new fromSearchPageActions.HidePage());
    this.store.dispatch(new fromSavedFiltersActions.CloseSaveFilterModal());
    this.store.dispatch(new fromSearchFiltersActions.RemoveFilters());
    this.store.dispatch(new fromSearchPageActions.HideFilterSearch());
    this.store.dispatch(new fromSavedFiltersActions.ClearSavedFilters());
    this.store.dispatch(new fromSavedFiltersActions.CloseSavedFiltersPopover());
    this.store.dispatch(new fromSearchResultsActions.ClearResults());
    this.onResetApp();
  }

  onResetApp?(): void;
  onSetContext?(payload: any): void;
}
