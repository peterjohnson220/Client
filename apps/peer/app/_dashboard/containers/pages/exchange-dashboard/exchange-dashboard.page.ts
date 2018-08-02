import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import { ExchangeRequestTypeEnum, Exchange } from 'libs/models';

import * as fromExchangeDashboardActions from '../../../actions/exchange-dashboard.actions';
import * as fromExchangeRequestActions from '../../../../shared/actions/exchange-request.actions';
import * as fromPeerDashboardReducer from '../../../reducers';
import * as fromSharedPeerReducer from '../../../../shared/reducers';

@Component({
  selector: 'pf-exchange-dashboard-page',
  templateUrl: './exchange-dashboard.page.html',
  styleUrls: ['./exchange-dashboard.page.scss']
})
export class ExchangeDashboardPageComponent implements OnInit, OnDestroy {
  sidebarVisible$: Observable<boolean>;
  mapHasData$: Observable<boolean>;
  mapHasDataError$: Observable<boolean>;
  exchange$: Observable<Exchange>;
  exchangeSubscription: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<fromPeerDashboardReducer.State>
  ) {
    this.sidebarVisible$ = this.store.select(fromPeerDashboardReducer.getExchangeDashboardSidebarVisible);
    this.mapHasData$ = this.store.select(fromPeerDashboardReducer.getExchangeDashboardMapHasData);
    this.mapHasDataError$ = this.store.select(fromPeerDashboardReducer.getExchangeDashboardMapHasDataError);
    this.exchange$ = this.store.select(fromSharedPeerReducer.getExchange);
  }

  manageJobsClick(): void {
    this.router.navigate(['manage'], { relativeTo: this.route });
  }

  referCompanyClick(): void {
    this.store.dispatch(new fromExchangeRequestActions.OpenExchangeRequestModal(ExchangeRequestTypeEnum.ReferPayfactorsCompany));
  }

  mapClick(): void {
    this.router.navigate(['map'], { relativeTo: this.route });
  }

  getTitle(hasData: boolean, hasDataError: boolean): string {
    if (hasDataError) { return 'Failed to get map data'; }
    if (!hasData) { return 'No exchange map data available'; }
    return '';
  }

  // Lifecycle
  ngOnInit() {
    this.store.dispatch(new fromExchangeDashboardActions.CloseSidebar());

    this.exchangeSubscription = this.exchange$.subscribe(ex =>
      this.store.dispatch(new fromExchangeDashboardActions.LoadMapCount(ex.ExchangeId))
    );
  }

  ngOnDestroy() {
    this.exchangeSubscription.unsubscribe();
  }
}
