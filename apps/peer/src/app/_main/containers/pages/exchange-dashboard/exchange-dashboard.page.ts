import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import 'hammerjs';

import { Exchange, GetChartRequest, ChartItem, ExchangeRequestTypeEnum } from 'libs/models';

import * as fromPeerMainReducers from '../../../reducers';
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
  industryChartItems$: Observable<ChartItem[]>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<fromPeerMainReducers.State>
  ) {
    this.exchange$ = this.store.select(fromPeerMainReducers.getExchange);
    this.industryChartItems$ = this.store.select(fromPeerMainReducers.getExchangeDashboardIndustryChartItems);
    this.exchangeId = this.route.snapshot.params.id;
  }

  ngOnInit() {
    const getChartRequest: GetChartRequest = {
      ExchangeId: this.exchangeId,
      ChartType: 'Industry'
    };
    this.store.dispatch(new fromExchangeDashboardActions.LoadingChart(getChartRequest));
  }

  manageJobsClick(): void {
    this.router.navigate([ 'exchange/job-mapping', this.exchangeId ]);
  }

  referCompanyClick(): void {
    this.store.dispatch(new fromExchangeRequestActions.OpenExchangeRequestModal(ExchangeRequestTypeEnum.ReferPayfactorsCompany));
  }
}
