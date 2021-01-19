import { Component, Input, Output, OnChanges, SimpleChanges, EventEmitter, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { Observable, Subscription } from 'rxjs';

import { Store, ActionsSubject } from '@ngrx/store';
import { ofType } from '@ngrx/effects';

import { PricingInfo } from 'libs/models/payfactors-api';
import { AsyncStateObj } from 'libs/models';

import * as fromPricingDetailsActions from '../actions';
import * as fromPricingDetailsReducer from '../reducers';

import { PricingInfoComponent } from '../containers';

@Component({
  selector: 'pf-pricing-details',
  templateUrl: './pricing-details.component.html',
  styleUrls: ['./pricing-details.component.scss']
})
export class PricingDetailsComponent implements OnChanges, OnDestroy {

  @Input() showModal$: Observable<boolean>;

  @Input() pricingId;

  @Output() cancelChanges = new EventEmitter();
  @Output() saveSuccess = new EventEmitter();

  @ViewChild('pricingInfoContainer') pricingInfoContainer: ElementRef<PricingInfoComponent>;


  newStatus: string;

  loading$: Observable<boolean>;
  pricingInfo$: Observable<AsyncStateObj<PricingInfo>>;
  addToNewProject$: Observable<AsyncStateObj<boolean>>;
  savingPricing$: Observable<AsyncStateObj<boolean>>;
  newStatus$: Observable<string>;

  saveSuccessSubscription = new Subscription();

  constructor(private store: Store<fromPricingDetailsReducer.State>, private actionsSubject: ActionsSubject) {
    this.loading$ = this.store.select(fromPricingDetailsReducer.getLoading);
    this.pricingInfo$ = this.store.select(fromPricingDetailsReducer.getPricingInfo);
    this.addToNewProject$ = this.store.select(fromPricingDetailsReducer.getAddingToNewProject);
    this.savingPricing$ = this.store.select(fromPricingDetailsReducer.getSavingPricing);
    this.newStatus$ = this.store.select(fromPricingDetailsReducer.getNewStatus);

    this.saveSuccessSubscription = actionsSubject
      .pipe(ofType(fromPricingDetailsActions.SAVING_PRICING_SUCCESS))
      .subscribe(data => {
        this.store.dispatch(new fromPricingDetailsActions.ResetState());
        this.saveSuccess.emit();
      });

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['pricingId'] && changes['pricingId'].currentValue) {
      this.store.dispatch(new fromPricingDetailsActions.GetPricingInfo(changes['pricingId'].currentValue));
    }
  }

  ngOnDestroy(): void {
    this.saveSuccessSubscription.unsubscribe();
  }

  onCancelChanges() {
    this.store.dispatch(new fromPricingDetailsActions.ResetState());
    this.cancelChanges.emit();
  }

  savePricing() {
    this.store.dispatch(new fromPricingDetailsActions.SavingPricing(this.pricingId));
  }

}
