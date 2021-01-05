import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

import { Store } from '@ngrx/store';

import { Observable } from 'rxjs/Observable';

import { PricingMatchTypes } from '../constants';
import * as fromPricingMatchActions from '../actions';
import * as fromPricingMatchReducer from '../reducers';

@Component({
  selector: 'pf-pricing-match',
  templateUrl: './pricing-match.component.html',
  styleUrls: ['./pricing-match.component.scss']
})
export class PricingMatchComponent implements OnChanges {
  @Input() pricingId: number;
  @Input() matchId: number;
  @Input() matchType: string;

  pricingMatchTypes = PricingMatchTypes;
  loading$: Observable<boolean>;
  showError$: Observable<boolean>;
  pricingMatch$: any;

  constructor(private store: Store<fromPricingMatchReducer.State>) {
    this.loading$ = this.store.select(fromPricingMatchReducer.getLoading);
    this.showError$ = this.store.select(fromPricingMatchReducer.getHasError);
    this.pricingMatch$ = this.store.select(fromPricingMatchReducer.getPricingMatch);
    this.pricingMatchTypes = PricingMatchTypes;
  }

  ngOnChanges(changes: SimpleChanges) {
    this.store.dispatch(new fromPricingMatchActions.ClearState());
    if ((changes['matchId'] && changes['matchId'].currentValue) &&
      (changes['matchType'] && changes['matchType'].currentValue)
    ) {
      this.store.dispatch(new fromPricingMatchActions.LoadPricingMatch(
        {
          pricingMatchId: changes['matchId'].currentValue,
          matchType: changes['matchType'].currentValue
        }));
    }
  }
}
