import { Component, OnInit, HostListener, OnDestroy } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import * as fromDashboardReducer from '../../../reducers';
import * as fromDashboardActions from '../../../actions/dashboard.actions';

import { Feature } from '../../../models';
import { Router } from '@angular/router';

@Component({
  selector: 'pf-dashboard-page',
  templateUrl: './dashboard.page.html',
  styleUrls: [ './dashboard.page.scss' ]
})
export class DashboardPageComponent implements OnInit {
  features$: Observable<Feature[]>;
  loadingError$: Observable<boolean>;

  constructor(private store: Store<fromDashboardReducer.State>, private router: Router) {
    this.loadingError$ = this.store.select(fromDashboardReducer.getFeaturesLoadingError);
    this.features$ = this.store.select(fromDashboardReducer.getFeatures);
  }

  @HostListener('window:pendo-event', ['$event'])
    onPendoEvent(event) {
      this.store.dispatch(new fromDashboardActions.SendingInAppMarketingEmail(event.detail));

      if (event.detail.action === 'Learn More') {
        this.router.navigate([`/marketing/${event.detail.path}`]);
      }
  }

  ngOnInit() {
    this.store.dispatch(new fromDashboardActions.LoadingFeatures());
  }

  handleFeaturesReload() {
    this.store.dispatch(new fromDashboardActions.LoadingFeatures());
  }
}
