import { HostListener, Injectable, Directive } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import * as fromSearchFiltersActions from 'libs/features/search/search/actions/search-filters.actions';
import * as fromUserFilterActions from 'libs/features/users/user-filter/actions/user-filter.actions';
import * as fromSaveFilterModalActions from 'libs/features/users/user-filter/actions/save-filter-modal.actions';
import * as fromUserFilterPopoverActions from 'libs/features/users/user-filter/actions/user-filter-popover.actions';
import * as fromSearchPageActions from 'libs/features/search/search/actions/search-page.actions';
import * as fromSearchFeatureActions from 'libs/features/search/search/actions/search-feature.actions';
import * as fromSearchReducer from 'libs/features/search/search/reducers';
import { SearchFeatureIds } from 'libs/features/search/search/enums/search-feature-ids';
import { UserFilterTypeData } from 'libs/features/users/user-filter/models';

import { SearchFilterMappingDataObj } from '../../models';

@Directive()
@Injectable()
export abstract class SearchBaseDirective {
  numberOfResults$: Observable<number>;
  searchingFilter$: Observable<boolean>;
  searchingChildFilters$: Observable<boolean>;

  protected constructor(
    protected store: Store<fromSearchReducer.State>,
    private searchFilterMappingDataObj: SearchFilterMappingDataObj,
    private searchFeatureId: SearchFeatureIds,
    private userFilterTypeData: UserFilterTypeData
  ) {
    this.numberOfResults$ = this.store.select(fromSearchReducer.getNumberOfResultsOnServer);
    this.searchingFilter$ = this.store.select(fromSearchReducer.getSearchingFilter);
    this.searchingChildFilters$ = this.store.select(fromSearchReducer.getSearchingChildFilter);
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

        this.store.dispatch(new fromSearchPageActions.SetSearchFeatureId(this.searchFeatureId));
        this.store.dispatch(new fromSearchPageActions.SetSearchFilterMappingData(this.searchFilterMappingDataObj));
        this.store.dispatch(new fromSearchPageActions.SetUserFilterTypeData(this.userFilterTypeData));
        this.onSetContext(event.data.payfactorsMessage.payload);
        break;
    }
  }

  resetActions() {
    this.store.dispatch(new fromSaveFilterModalActions.CloseSaveModal());
    this.store.dispatch(new fromSearchFiltersActions.RemoveFilters());
    this.store.dispatch(new fromUserFilterActions.Reset());
    this.store.dispatch(new fromUserFilterPopoverActions.ClosePopover());

    this.store.dispatch(new fromSearchFeatureActions.ResetSearchFeatureId(this.searchFeatureId));
  }

  handleCancelClicked() {
    this.store.dispatch(new fromSearchPageActions.CloseSearchPage());
    this.store.dispatch(new fromSearchPageActions.Cancel());
  }

  resetApp() {
    this.resetActions();
    this.onResetApp();
  }

  onResetApp?(): void;
  onSetContext?(payload: any): void;
}
