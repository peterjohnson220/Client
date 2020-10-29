import { Component } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { SearchBaseDirective } from 'libs/features/search/containers/search-base';
import * as fromCompanySettingsActions from 'libs/state/app-context/actions/company-settings.actions';
import * as fromSearchFiltersActions from 'libs/features/search/actions/search-filters.actions';
import * as fromPaymarketActions from 'libs/features/add-jobs/actions/paymarkets.actions';
import * as fromAddJobsPageActions from 'libs/features/add-jobs/actions/add-jobs-page.actions';
import * as fromAddJobsSearchResultsActions from 'libs/features/add-jobs/actions/search-results.actions';
import * as fromSearchReducer from 'libs/features/search/reducers';
import * as fromSearchPageActions from 'libs/features/search/actions/search-page.actions';

import { staticFilters } from '../../../shared/data';

@Component({
  selector: 'pf-add-jobs-modal-wrapper',
  templateUrl: './add-jobs-modal-wrapper.component.html',
  styleUrls: ['./add-jobs-modal-wrapper.component.scss']
})
export class AddJobsModalWrapperComponent extends SearchBaseDirective {
  // Observables
  pageShown$: Observable<boolean>;

  // Constants
  MODAL_NAME = 'Add Jobs';

  constructor(
    store: Store<fromSearchReducer.State>
  ) {
    super(store);
    this.pageShown$ = this.store.select(fromSearchReducer.getPageShown);
  }

  onSetContext(payload: any): void {
    this.store.dispatch(new fromAddJobsPageActions.SetContext(payload));
    this.store.dispatch(new fromSearchFiltersActions.AddFilters(staticFilters));

    this.store.dispatch(new fromPaymarketActions.SetDefaultPaymarket(Number(payload.PayMarketId)));
    this.store.dispatch(new fromPaymarketActions.LoadPaymarkets());

    // Always get the latest company settings so we have the latest job count
    this.store.dispatch(new fromCompanySettingsActions.LoadCompanySettings());
  }

  onResetApp(): void {
    this.store.dispatch(new fromPaymarketActions.ClearPayMarkets());
    this.store.dispatch(new fromAddJobsSearchResultsActions.ClearSelectedJobs());
    this.store.dispatch(new fromAddJobsSearchResultsActions.Reset());
  }

  close() {
    this.store.dispatch(new fromSearchPageActions.CloseSearchPage());
  }
}
