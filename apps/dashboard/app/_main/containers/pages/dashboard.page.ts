import { Component, OnInit } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import * as fromDashboardReducer from '../../reducers';
import * as fromDashboardActions from '../../actions/dashboard.actions';

import { Feature } from '../../models';

@Component({
  selector: 'pf-dashboard-page',
  templateUrl: './dashboard.page.html',
  styleUrls: [ './dashboard.page.scss' ]
})
export class DashboardPageComponent implements OnInit {
  loading$: Observable<boolean>;
  loadingError$: Observable<boolean>;
  features$: Observable<Feature[]>;

  constructor(private store: Store<fromDashboardReducer.State>) {
    this.loading$ = this.store.select(fromDashboardReducer.getFeaturesLoading);
    this.loadingError$ = this.store.select(fromDashboardReducer.getFeaturesLoadingError);
    this.features$ = this.store.select(fromDashboardReducer.getFeatures);

  }

  // Events
  handleFeaturesReload() {
    this.store.dispatch(new fromDashboardActions.LoadingFeatures());
  }

  // Lifecycle
  ngOnInit() {
    this.store.dispatch(new fromDashboardActions.LoadingFeatures());
  }
}
