import { Component, OnInit } from '@angular/core';

import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { DropDownFilterSettings } from '@progress/kendo-angular-dropdowns';

import { PayMarket } from 'libs/models/paymarket';
import { AsyncStateObj } from 'libs/models/state';

import * as fromUserSettingsReducer from '../../../reducers';
import * as fromPayMarketDefaultSettingsActions from '../../../actions/paymarket-default-settings.actions';

@Component({
  selector: 'pf-pay-market-default-settings',
  templateUrl: './pay-market-default-settings.component.html',
  styleUrls: ['./pay-market-default-settings.component.scss']
})
export class PayMarketDefaultSettingsComponent implements OnInit {
  payMarkets$: Observable<AsyncStateObj<PayMarket[]>>;

  filterSettings: DropDownFilterSettings = {
    caseSensitive: false,
    operator: 'contains'
  };
  selectedPayMarket: PayMarket;

  constructor(
    private store: Store<fromUserSettingsReducer.State>
  ) {
    this.payMarkets$ = this.store.pipe(select(fromUserSettingsReducer.getAccessiblePayMarkets));
  }

  ngOnInit(): void {
    this.store.dispatch(new fromPayMarketDefaultSettingsActions.GetPayMarkets());
  }
}
