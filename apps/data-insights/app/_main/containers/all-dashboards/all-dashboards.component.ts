import { Component, OnInit, OnDestroy } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import * as fromDataInsightsMainReducer from '../../reducers';
import * as fromAllDashboardsActions from '../../actions/all-dashboards.action';
import { TableauReport } from '../../models';

@Component({
  selector: 'pf-all-dashboards',
  templateUrl: './all-dashboards.component.html',
  styleUrls: ['./all-dashboards.component.scss']
})
export class AllDashboardsComponent implements OnInit, OnDestroy {

  loadingCompanyReports$: Observable<boolean>;
  loadingCompanyReportsSuccess$: Observable<boolean>;
  loadingCompanyReportsErrors$: Observable<boolean>;
  companyReports$: Observable<TableauReport[]>;

  companyReportsSubscription: Subscription;

  companyReports: TableauReport[];

  constructor(
    private store: Store<fromDataInsightsMainReducer.State>
  ) {
    this.loadingCompanyReports$ = this.store.select(fromDataInsightsMainReducer.getLoadingCompanyReports);
    this.loadingCompanyReportsSuccess$ = this.store.select(fromDataInsightsMainReducer.getLoadingCompanyReportsSuccess);
    this.loadingCompanyReportsErrors$ = this.store.select(fromDataInsightsMainReducer.getLoadingCompanyReportsError);
    this.companyReports$ = this.store.select(fromDataInsightsMainReducer.getCompanyReports);
  }

  ngOnInit() {
    this.companyReportsSubscription = this.companyReports$.subscribe(results => this.companyReports = results);

    this.store.dispatch(new fromAllDashboardsActions.GetCompanyReports());
  }

  ngOnDestroy() {
    this.companyReportsSubscription.unsubscribe();
  }
}
