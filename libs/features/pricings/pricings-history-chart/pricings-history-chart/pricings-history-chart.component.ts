import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';

import { AsyncStateObj } from 'libs/models';
import { PricedPayMarkets } from 'libs/models/payfactors-api';

import * as fromPricingHistoryChartActions from '../actions';
import * as fromPricingHistoryChartReducer from '../reducers';

@Component({
  selector: 'pf-pricings-history-chart',
  templateUrl: './pricings-history-chart.component.html',
  styleUrls: ['./pricings-history-chart.component.scss']
})
export class PricingsHistoryChartComponent implements OnInit, OnChanges {

  @Input() jobId: number;

  pricedPayMarkets$: Observable<AsyncStateObj<PricedPayMarkets[]>>;

  constructor(private store: Store<fromPricingHistoryChartReducer.State>) { }

  ngOnInit() {
    this.pricedPayMarkets$ = this.store.select(fromPricingHistoryChartReducer.getPricedPayMarkets);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.jobId && changes.jobId.currentValue) {
      this.store.dispatch(new fromPricingHistoryChartActions.UpdateJobId(changes.jobId.currentValue));
      this.store.dispatch(new fromPricingHistoryChartActions.InitPricingHistoryChart());
    }
  }


}
