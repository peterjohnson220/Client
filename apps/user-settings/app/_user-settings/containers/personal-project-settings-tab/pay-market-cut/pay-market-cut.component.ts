import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';

import { select, Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import cloneDeep from 'lodash/cloneDeep';

import { PayMarket, PayMarketCut } from 'libs/models/paymarket';
import { AsyncStateObj } from 'libs/models/state';

import * as fromUserSettingsReducer from '../../../reducers';
import * as fromPayMarketDefaultSettingsActions from '../../../actions/paymarket-default-settings.actions';

@Component({
  selector: 'pf-pay-market-cut',
  templateUrl: './pay-market-cut.component.html',
  styleUrls: ['./pay-market-cut.component.scss']
})
export class PayMarketCutComponent implements OnChanges, OnInit, OnDestroy {
  @Input() payMarket: PayMarket;

  payMarketCuts$: Observable<AsyncStateObj<PayMarketCut[]>>;

  payMarketCutsSubscription: Subscription;

  gridHeaderStyle = {
    'background-color': '#fff',
    'font-weight': '500'
  };

  isEditingCutValue: boolean;
  payMarketCuts: PayMarketCut[];
  defaultMarketCuts: PayMarketCut[];

  constructor(
    private store: Store<fromUserSettingsReducer.State>
  ) {
    this.payMarketCuts$ = this.store.pipe(select(fromUserSettingsReducer.getPayMarketCuts));
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes?.payMarket?.currentValue?.CompanyPayMarketId) {
      const payMarketId = changes.payMarket.currentValue.CompanyPayMarketId;
      this.store.dispatch(new fromPayMarketDefaultSettingsActions.GetPayMarketCuts({ payMarketId }));
    } else if (changes?.payMarket?.previousValue) {
      this.store.dispatch(new fromPayMarketDefaultSettingsActions.ClearPayMarketCuts());
    }
  }

  ngOnInit(): void {
    this.payMarketCutsSubscription = this.payMarketCuts$.subscribe(asyncObj => {
      if (asyncObj?.obj) {
        this.payMarketCuts = cloneDeep(asyncObj.obj);
        this.defaultMarketCuts = cloneDeep(asyncObj.obj);
      }
    });
  }

  ngOnDestroy(): void {
    this.payMarketCutsSubscription.unsubscribe();
  }

  handlePayMarketCutValueChange(): void {
    this.isEditingCutValue = true;
  }

  resetToDefault(): void {
    this.payMarketCuts = this.defaultMarketCuts;
  }

  handleSaveClicked(): void {
    this.store.dispatch(new fromPayMarketDefaultSettingsActions.SavePayMarketCuts({
      payMarketId: this.payMarket.CompanyPayMarketId,
      dataCuts: this.payMarketCuts
    }));
    this.isEditingCutValue = false;
  }
}
