import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Store } from '@ngrx/store';

import { annualDisplay, compRate } from 'libs/core/pipes';
import { ExchangeJobDailyNatAvgOrg50thDetails } from 'libs/models/payfactors-api/';

import * as nationalAverageReducer from '../../reducers';

@Component({
  selector: 'pf-org-weighted-nat-avg-card',
  templateUrl: './org-weighted-nat-avg-card.component.html',
  styleUrls: ['./org-weighted-nat-avg-card.component.scss']
})

export class OrgWeightedNatAvgCardComponent implements OnChanges {
  @Input() exchangeJobId: number;
  @Input() showPlaceholderCard: false;

  annualDisplay: annualDisplay = annualDisplay.full;
  nationalAverage: ExchangeJobDailyNatAvgOrg50thDetails;

  get compRate(): compRate {
    return !!this.nationalAverage.Rate && this.nationalAverage.Rate === compRate.hourly.toString() ? compRate.hourly : compRate.annual;
  }

  constructor(private store: Store<nationalAverageReducer.State>) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['exchangeJobId'] && changes['exchangeJobId'].currentValue) {
      this.store.select(nationalAverageReducer.getExchangeJobNationalAverages).subscribe(averages => {
        this.nationalAverage = averages.find(a => a.ExchangeJobId === changes['exchangeJobId'].currentValue);
      });
    }
  }
}
