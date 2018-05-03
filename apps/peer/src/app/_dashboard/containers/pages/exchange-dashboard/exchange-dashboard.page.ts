import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import { Exchange, ExchangeRequestTypeEnum } from 'libs/models';

import * as fromExchangeDashboardActions from '../../../actions/exchange-dashboard.actions';
import * as fromExchangeRequestActions from '../../../../shared/actions/exchange-request.actions';
import * as fromPeerDashboardReducer from '../../../reducers';
import * as fromSharedPeerReducer from '../../../../shared/reducers';

@Component({
  selector: 'pf-exchange-dashboard-page',
  templateUrl: './exchange-dashboard.page.html',
  styleUrls: ['./exchange-dashboard.page.scss']
})
export class ExchangeDashboardPageComponent implements OnInit {
  exchangeId: number;
  exchange$: Observable<Exchange>;
  sidebarVisible$: Observable<boolean>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<fromPeerDashboardReducer.State>,
    private sharedPeerStore: Store<fromSharedPeerReducer.State>
  ) {
    this.exchange$ = this.sharedPeerStore.select(fromSharedPeerReducer.getExchange);
    this.sidebarVisible$ = this.store.select(fromPeerDashboardReducer.getExchangeDashboardSidebarVisible);
    this.exchangeId = this.route.snapshot.params.id;
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

  ngOnInit() {
    this.store.dispatch(new fromExchangeDashboardActions.CloseSidebar());
  }
}
