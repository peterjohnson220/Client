import { Component, OnDestroy, OnInit } from '@angular/core';

import { ActionsSubject, Store } from '@ngrx/store';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { ofType } from '@ngrx/effects';

import { AsyncStateObj } from 'libs/models/state';
import { PricingApiService } from 'libs/data/payfactors-api';

import * as fromJobsPageReducer from '../../reducers';
import * as fromModifyPricingsActions from '../../actions/modify-pricings.actions';
import { DeleteMatchModalData, MarketDataJobPricing, MarketDataJobPricingMatch } from '../../models';

@Component({
  selector: 'pf-delete-match-modal',
  templateUrl: './delete-match-modal.component.html'
})
export class DeleteMatchModalComponent implements OnInit, OnDestroy {
  modalData$: Observable<DeleteMatchModalData>;
  deletingPricingMatch$: Observable<AsyncStateObj<boolean>>;

  modalDataSubscription: Subscription;
  deletingPricingMatchSuccessSubscription: Subscription;

  showModal = new BehaviorSubject<boolean>(false);
  showModal$ = this.showModal.asObservable();

  previousPricingEffectiveDate: any = null;
  modalData: DeleteMatchModalData;
  jobPricing: MarketDataJobPricing;
  jobPricingMatch: MarketDataJobPricingMatch;

  constructor(
    private store: Store<fromJobsPageReducer.State>,
    private pricingApiService: PricingApiService,
    private actionsSubject: ActionsSubject
  ) {
    this.deletingPricingMatch$ = this.store.select(fromJobsPageReducer.getDeletingPricingMatch);
    this.modalData$ = this.store.select(fromJobsPageReducer.getDeleteMatchModalData);
  }

  ngOnInit(): void {
    this.modalDataSubscription = this.modalData$.subscribe(data => {
      this.modalData = data;
      if (this.modalData) {
        this.jobPricing = this.modalData.JobPricing;
        this.jobPricingMatch = this.modalData.JobPricingMatch;
        if (this.modalData.PricingMatchesCount !== 1) {
          this.openModal();
        } else {
          this.getPreviousPricingEffectiveDate();
        }
      }
    });
    this.deletingPricingMatchSuccessSubscription = this.actionsSubject
      .pipe(ofType(fromModifyPricingsActions.DELETING_PRICING_MATCH_SUCCESS))
      .subscribe(data => this.handleDismiss());
  }

  ngOnDestroy(): void {
    this.modalDataSubscription.unsubscribe();
    this.deletingPricingMatchSuccessSubscription.unsubscribe();
  }

  handleSubmit(): void {
    if (!this.modalData) {
      return;
    }
    const jobPayMarketMetaData = `${this.jobPricing.JobId}_${this.jobPricing.PayMarketId}`;
    const request = {
      MatchId: this.jobPricingMatch.PricingMatchId,
      JobPayMarketMetaData: jobPayMarketMetaData
    };
    if (this.modalData.PricingMatchesCount !== 1) {
      this.store.dispatch(new fromModifyPricingsActions.DeletingPricingMatch(request));
    } else {
      this.store.dispatch(new fromModifyPricingsActions.DeletePricingAndMatch(request));
    }
  }

  handleDismiss(): void {
    this.showModal.next(false);
    this.store.dispatch(new fromModifyPricingsActions.SetDeleteMatchModalData(null));
  }

  private openModal(): void {
    this.showModal.next(true);
    this.store.dispatch(new fromModifyPricingsActions.ResetModifyPricingsModals());
  }

  private getPreviousPricingEffectiveDate(): void {
    this.pricingApiService.getPreviousPricingEffectiveDate(this.jobPricingMatch.PricingMatchId).subscribe(response => {
      this.previousPricingEffectiveDate = response;
      this.openModal();
    });
  }

}
