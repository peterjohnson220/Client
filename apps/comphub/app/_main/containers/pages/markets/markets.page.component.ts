import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

import * as fromComphubMainReducer from '../../../reducers';
import * as fromMarketsPageActions from '../../../actions/markets-page.actions';
import { PricingPaymarket, AddPayMarketModalData, MarketDataScope} from '../../../models';

@Component({
  selector: 'pf-markets-page',
  templateUrl: './markets.page.component.html',
  styleUrls: ['./markets.page.component.scss']
})
export class MarketsPageComponent implements OnInit {
  visiblePaymarkets$: Observable<PricingPaymarket[]>;
  loadingPaymarkets$: Observable<boolean>;
  loadingPaymarketsError$: Observable<boolean>;
  selectedPaymarketId$: Observable<number>;
  paymarkets$: Observable<PricingPaymarket[]>;

  addPayMarketModalOpen$: Observable<boolean>;
  savingPayMarket$: Observable<boolean>;
  savingPayMarketConflict$: Observable<boolean>;
  savingPayMarketError$: Observable<boolean>;
  marketDataScope$: Observable<MarketDataScope>;

  searchTerm: string;

  private readonly defaultCountryCode = 'USA';

  constructor(
    private store: Store<fromComphubMainReducer.State>
  ) {
    this.visiblePaymarkets$ = this.store.select(fromComphubMainReducer.getVisiblePaymarkets);
    this.paymarkets$ = this.store.select(fromComphubMainReducer.getPaymarkets);
    this.loadingPaymarkets$ = this.store.select(fromComphubMainReducer.getLoadingPaymarkets);
    this.loadingPaymarketsError$ = this.store.select(fromComphubMainReducer.getLoadingPaymarketsError);
    this.selectedPaymarketId$ = this.store.select(fromComphubMainReducer.getSelectedPaymarket);
  }

  ngOnInit() {
    this.store.dispatch(new fromMarketsPageActions.GetPaymarkets());
    this.store.dispatch(new fromMarketsPageActions.GetMarketDataScope(
      { countryCode: this.defaultCountryCode }
    ));
    this.addPayMarketModalOpen$ = this.store.select(fromComphubMainReducer.getAddPayMarketModalOpen);
    this.savingPayMarket$ = this.store.select(fromComphubMainReducer.getSavingPayMarket);
    this.savingPayMarketConflict$ = this.store.select(fromComphubMainReducer.getSavingPayMarketConflict);
    this.savingPayMarketError$ = this.store.select(fromComphubMainReducer.getSavingPayMarketError);
    this.marketDataScope$ = this.store.select(fromComphubMainReducer.getMarketDataScope);
  }

  handleSavePayMarket(modalData: AddPayMarketModalData) {
    this.store.dispatch(new fromMarketsPageActions.SavePayMarket(modalData));
  }

  handleSkipPayMarket() {
    this.store.dispatch(new fromMarketsPageActions.SkipPayMarket());
  }

  handleSearchChanged(searchTerm: string) {
    this.store.dispatch(new fromMarketsPageActions.SetPaymarketFilter(searchTerm));
  }

  handlePaymarketChecked(checkedPaymarketId: number) {
    this.store.dispatch(new fromMarketsPageActions.SetSelectedPaymarket(checkedPaymarketId));
  }

  clearSearchValue() {
    this.searchTerm = '';
    this.handleSearchChanged(this.searchTerm);
  }
}
