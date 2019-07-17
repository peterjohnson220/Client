import { Component, OnDestroy, OnInit } from '@angular/core';

import { select, Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import { AsyncStateObj } from 'libs/models/state';

import { StandardReportDetails } from '../../../models';
import * as fromDataInsightsMainReducer from '../../../reducers';
import * as fromStandardReportsListPageActions from '../../../actions/standard-reports-list-page.actions';

@Component({
  selector: 'pf-standard-reports-list-page',
  templateUrl: './standard-reports-list.page.html',
  styleUrls: ['./standard-reports-list.page.scss']
})
export class StandardReportsListPageComponent implements OnInit, OnDestroy {
  standardReportDetails$: Observable<AsyncStateObj<StandardReportDetails[]>>;
  syncingStandardReports$: Observable<boolean>;

  standardReportSubscription: Subscription;

  allWorkbooks: StandardReportDetails[] = [];
  searchTerm: string;

  constructor(
    private store: Store<fromDataInsightsMainReducer.State>
  ) {
    this.standardReportDetails$ = this.store.pipe(select(fromDataInsightsMainReducer.getStandardReportDetailsAsync));
    this.syncingStandardReports$ = this.store.pipe(select(fromDataInsightsMainReducer.getSyncingStandardReports));
  }

  ngOnInit(): void {
    this.store.dispatch(new fromStandardReportsListPageActions.GetStandardReportDetails());
    this.standardReportSubscription = this.standardReportDetails$.subscribe(rp => this.allWorkbooks = rp.obj);
  }

  ngOnDestroy(): void {
    this.standardReportSubscription.unsubscribe();
  }

  updateSearchTerm(value: string) {
    this.searchTerm = value;
  }

  syncStandardReports(): void {
    this.store.dispatch(new fromStandardReportsListPageActions.SyncStandardReports());
  }

  get filteredStandardReports(): StandardReportDetails[] {
    return this.searchTerm
      ? this.allWorkbooks.filter(x => (x.Name && x.Name.toLowerCase().includes(this.searchTerm.toLowerCase()))
            || (x.DisplayName && x.DisplayName.toLowerCase().includes(this.searchTerm.toLowerCase())))
      : this.allWorkbooks;
  }
}
