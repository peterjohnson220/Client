import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

import { Store } from '@ngrx/store';
import * as fromPricingHistoryChartActions from '../actions';
import * as fromPricingHistoryChartReducer from '../reducers';

@Component({
  selector: 'pf-pricings-history-chart',
  templateUrl: './pricings-history-chart.component.html',
  styleUrls: ['./pricings-history-chart.component.scss']
})
export class PricingsHistoryChartComponent implements OnInit, OnChanges {

  @Input() jobId: number;

  constructor(private store: Store<fromPricingHistoryChartReducer.State>) { }

  ngOnInit() {

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.jobId && changes.jobId.currentValue) {
      this.store.dispatch(new fromPricingHistoryChartActions.UpdateJobId(changes.jobId.currentValue));
      this.store.dispatch(new fromPricingHistoryChartActions.LoadPricedPayMarkets());
    }
  }


}
