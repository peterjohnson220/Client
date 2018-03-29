import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import { Exchange, ExchangeRequestTypeEnum } from 'libs/models';

import * as fromExchangeDashboardReducer from '../../../reducers';
import * as fromExchangeDashboardActions from '../../../actions/exchange-dashboard.actions';
import * as fromExchangeRequestActions from '../../../actions/exchange-request.actions';

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
    private store: Store<fromExchangeDashboardReducer.State>
  ) {
    this.exchange$ = this.store.select(fromExchangeDashboardReducer.getExchange);
    this.sidebarVisible$ = this.store.select(fromExchangeDashboardReducer.getExchangeDashboardSidebarVisible);
    this.exchangeId = this.route.snapshot.params.id;
  }

  manageJobsClick(): void {
    this.router.navigate([ 'exchange/job-mapping', this.exchangeId ]);
  }

  referCompanyClick(): void {
    this.store.dispatch(new fromExchangeRequestActions.OpenExchangeRequestModal(ExchangeRequestTypeEnum.ReferPayfactorsCompany));
  }

  ngOnInit() {
    this.store.dispatch(new fromExchangeDashboardActions.CloseSidebar());
  }
}
