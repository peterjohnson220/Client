import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

import { Store } from '@ngrx/store';

import { Observable } from 'rxjs/Observable';

import { PricingMatchEntityTypes } from 'libs/constants';

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

  @Input() entityType: PricingMatchEntityTypes;
  @Input() entityId: any;
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

    if ((changes['entityId'] && changes['entityId'].currentValue) &&
      (changes['entityType'] && changes['entityType'].currentValue) &&
      (changes['matchType'] && changes['matchType'].currentValue)
    ) {
      this.store.dispatch(new fromPricingMatchActions.LoadPricingMatch(
        {
          entityId: changes['entityId'].currentValue,
          entityType: changes['entityType'].currentValue,
          matchType: changes['matchType'].currentValue
        }));
    }
  }
}
