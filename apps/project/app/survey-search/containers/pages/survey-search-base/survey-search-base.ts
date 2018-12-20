import { HostListener, Injectable } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import * as fromSearchFiltersActions from 'libs/features/search/actions/search-filters.actions';
import * as fromSurveyResultsActions from 'libs/features/search/actions/search-results.actions';
import * as fromSavedFiltersActions from 'libs/features/search/actions/saved-filters.actions';
import * as fromSearchPageActions from 'libs/features/search/actions/search-page.actions';
import * as fromSearchReducer from 'libs/features/search/reducers';

import * as fromSurveySearchResultsActions from '../../../actions/survey-search-results.actions';
import * as fromSurveySearchReducer from '../../../reducers';
import { staticFilters } from '../../../data';

@Injectable()
export abstract class SurveySearchBase {
  numberOfResults$: Observable<number>;
  searchingFilter$: Observable<boolean>;

  protected constructor(
    protected store: Store<fromSurveySearchReducer.State>
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
        this.setContext(event.data.payfactorsMessage.payload);
        break;
    }
  }

  private resetApp() {
    this.store.dispatch(new fromSavedFiltersActions.CloseSaveFilterModal());
    this.store.dispatch(new fromSearchFiltersActions.RemoveFilters());
    this.store.dispatch(new fromSurveyResultsActions.ClearResults());
    this.store.dispatch(new fromSurveySearchResultsActions.ClearDataCutSelections());
    this.store.dispatch(new fromSearchPageActions.HideFilterSearch());
    this.store.dispatch(new fromSavedFiltersActions.ClearSavedFilters());
    this.store.dispatch(new fromSavedFiltersActions.CloseSavedFiltersPopover());
    this.onResetApp();
  }

  private setContext(payload: any) {
    this.store.dispatch(new fromSearchFiltersActions.AddFilters(staticFilters));
    this.onSetContext(payload);
  }

  onResetApp?(): void;
  onSetContext?(payload: any): void;
}
