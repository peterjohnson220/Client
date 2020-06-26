import {Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewEncapsulation} from '@angular/core';
import * as fromPricingMatchActions from '../actions';
import * as fromPricingMatchReducer from '../reducers';


import {Store} from '@ngrx/store';
import {Observable} from 'rxjs/Observable';
import {PricingMatchTypes} from '../constants';

@Component({
  selector: 'pf-pricing-match',
  templateUrl: './pricing-match.component.html',
  styleUrls: ['./pricing-match.component.scss']
})
export class PricingMatchComponent implements OnInit, OnChanges {
  @Input() pricingId: number;
  @Input() filterGUID: string;
  @Input() surveyId: number;
  @Input() slottedCompanyJobId: number;
  @Input() mDJobId: number;
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

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    this.store.dispatch(new fromPricingMatchActions.ClearState());
    if (changes['filterGUID'] && changes['filterGUID'].currentValue) {
      this.store.dispatch(new fromPricingMatchActions.LoadPeerMatch(changes['filterGUID'].currentValue));
    }
    if (changes['surveyId'] && changes['surveyId'].currentValue) {
      this.store.dispatch(new fromPricingMatchActions.LoadSurveyMatch(changes['surveyId'].currentValue));
    }
    if (changes['slottedCompanyJobId'] && changes['slottedCompanyJobId'].currentValue) {
      this.store.dispatch(new fromPricingMatchActions.LoadSlottedCompanyJobMatch(changes['slottedCompanyJobId'].currentValue));
    }
    if (changes['mDJobId'] && changes['mDJobId'].currentValue && changes['pricingId'] && changes['pricingId'].currentValue) {
      this.store.dispatch(new fromPricingMatchActions.LoadMdJobMatch(changes['mDJobId'].currentValue, changes['pricingId'].currentValue));
    }
  }
}
