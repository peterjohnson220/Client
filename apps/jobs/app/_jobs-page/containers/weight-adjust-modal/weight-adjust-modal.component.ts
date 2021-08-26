import { Component, OnDestroy, OnInit } from '@angular/core';

import { ActionsSubject, Store } from '@ngrx/store';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { ofType } from '@ngrx/effects';

import { UpdatePricingMatchRequest } from 'libs/models/payfactors-api/pricings';
import { AsyncStateObj } from 'libs/models';

import * as fromJobsPageReducer from '../../reducers';
import * as fromModifyPricingsActions from '../../actions/modify-pricings.actions';
import { MarketDataJobPricingMatch } from '../../models';
import { PageViewIds } from '../../constants';

@Component({
  selector: 'pf-weight-adjust-modal',
  templateUrl: './weight-adjust-modal.component.html',
  styleUrls: ['./weight-adjust-modal.component.scss']
})
export class WeightAdjustModalComponent implements OnInit, OnDestroy {
  updatingPricingMatch$: Observable<AsyncStateObj<boolean>>;

  showWeightAdjustModal: BehaviorSubject<boolean>;
  showWeightAdjustModal$: Observable<boolean>;

  updatingPricingMatchSubscription: Subscription;

  selectedMatch: MarketDataJobPricingMatch;
  canModifyMatch: boolean;
  permissionMessage: string;
  weight: number;
  adjustment: number;

  constructor(
    private store: Store<fromJobsPageReducer.State>,
    private actionsSubject: ActionsSubject
  ) {
    this.showWeightAdjustModal = new BehaviorSubject<boolean>(false);
    this.showWeightAdjustModal$ = this.showWeightAdjustModal.asObservable();
    this.updatingPricingMatch$ = this.store.select(fromJobsPageReducer.getUpdatingPricingMatch);
  }

  ngOnInit(): void {
    this.updatingPricingMatchSubscription = this.actionsSubject
      .pipe(ofType(fromModifyPricingsActions.UPDATING_PRICING_MATCH_SUCCESS))
      .subscribe(data => this.handleDismiss());
  }

  ngOnDestroy(): void {
    this.updatingPricingMatchSubscription.unsubscribe();
  }

  open(pricingMatch: MarketDataJobPricingMatch, canModifyMatch: boolean, permissionMessage: string): void {
    this.selectedMatch = pricingMatch;
    this.canModifyMatch = canModifyMatch;
    this.permissionMessage = permissionMessage;
    this.weight = this.selectedMatch.Weight ?? 1;
    this.adjustment = this.selectedMatch.Adjustment ?? 0;
    this.showWeightAdjustModal.next(true);
  }

  handleDismiss(): void {
    if (!this.selectedMatch) {
      return;
    }
    this.showWeightAdjustModal.next(false);
    this.selectedMatch = null;
  }

  handleSubmit(): void {
    const request: UpdatePricingMatchRequest = {
      MatchId: this.selectedMatch.PricingMatchId,
      MatchWeight: this.weight ?? 1,
      MatchAdjustment: this.adjustment ?? 0,
      SurveyDataId: null,
      ExchangeDataCutId: null
    };
    const pricingId = this.selectedMatch.PricingId;
    const matchesGridPageViewId = `${PageViewIds.PricingMatches}_${pricingId}`;
    this.store.dispatch(new fromModifyPricingsActions.UpdatingPricingMatch(request, pricingId, matchesGridPageViewId));
  }
}
