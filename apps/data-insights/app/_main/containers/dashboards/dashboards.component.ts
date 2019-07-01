import { Component, OnInit, OnDestroy } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import * as fromDataInsightsMainReducer from '../../reducers';
import * as fromAllDashboardsActions from '../../actions/dashboards.actions';
import { Workbook } from '../../models';

@Component({
  selector: 'pf-dashboards',
  templateUrl: './dashboards.component.html',
  styleUrls: ['./dashboards.component.scss']
})
export class DashboardsComponent implements OnInit, OnDestroy {

  loadingCompanyReports$: Observable<boolean>;
  loadingCompanyReportsSuccess$: Observable<boolean>;
  loadingCompanyReportsErrors$: Observable<boolean>;
  companyReports$: Observable<Workbook[]>;

  companyReportsSubscription: Subscription;

  companyReports: Workbook[];
  dashboardViews: Array<string> = ['All Dashboards', 'Favorites'];
  selectedView = 'All Dashboards';

  constructor(
    private store: Store<fromDataInsightsMainReducer.State>
  ) {
    this.loadingCompanyReports$ = this.store.select(fromDataInsightsMainReducer.getLoadingCompanyReports);
    this.loadingCompanyReportsSuccess$ = this.store.select(fromDataInsightsMainReducer.getLoadingCompanyReportsSuccess);
    this.loadingCompanyReportsErrors$ = this.store.select(fromDataInsightsMainReducer.getLoadingCompanyReportsError);
    this.companyReports$ = this.store.select(fromDataInsightsMainReducer.getCompanyReports);
  }

  get anyFavorites() {
    return this.companyReports && this.companyReports.some(r => r.IsFavorite);
  }

  get isFavoritesOnly() {
    return this.selectedView === 'Favorites';
  }

  ngOnInit() {
    this.companyReportsSubscription = this.companyReports$.subscribe(results => this.companyReports = results);

    this.store.dispatch(new fromAllDashboardsActions.GetCompanyReports());
  }

  ngOnDestroy() {
    this.companyReportsSubscription.unsubscribe();
  }
}
