import { Component, Input, OnInit } from '@angular/core';

import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

import * as fromComphubMainReducer from '../../../reducers';
import * as fromMarketsCardActions from '../../../actions/markets-card.actions';
import * as fromComphubPageActions from '../../../actions/comphub-page.actions';
import * as fromAddPayMarketFormActions from '../../../actions/add-paymarket-form.actions';
import { PricingPaymarket, AddPayMarketFormData, MarketDataScope, CountryDataSet, MarketDataLocation,
  WorkflowContext } from '../../../models';
import { ComphubPages } from '../../../data';

@Component({
  selector: 'pf-markets-card',
  templateUrl: './markets.card.component.html',
  styleUrls: ['./markets.card.component.scss']
})
export class MarketsCardComponent implements OnInit {
  @Input() workflowContext: WorkflowContext;

  visiblePaymarkets$: Observable<PricingPaymarket[]>;
  loadingPaymarkets$: Observable<boolean>;
  loadingPaymarketsError$: Observable<boolean>;
  loadingMarketDataScopes$: Observable<boolean>;
  loadingLocations$: Observable<boolean>;
  marketDataLocations$: Observable<MarketDataLocation[]>;
  selectedPaymarket$: Observable<PricingPaymarket>;
  paymarkets$: Observable<PricingPaymarket[]>;

  addPayMarketFormOpen$: Observable<boolean>;
  savingPayMarket$: Observable<boolean>;
  savingPayMarketConflict$: Observable<boolean>;
  savingPayMarketError$: Observable<boolean>;
  marketDataScope$: Observable<MarketDataScope>;
  infoBannerOpen$: Observable<boolean>;
  showSkipButton$: Observable<boolean>;
  hideNewPaymarketButton$: Observable<boolean>;
  payMarketsFilter$: Observable<string>;

  comphubPages = ComphubPages;

  constructor(
    private store: Store<fromComphubMainReducer.State>
  ) {
    this.payMarketsFilter$ = this.store.select(fromComphubMainReducer.getPaymarketsFilter);
    this.visiblePaymarkets$ = this.store.select(fromComphubMainReducer.getVisiblePaymarkets);
    this.paymarkets$ = this.store.select(fromComphubMainReducer.getPaymarkets);
    this.loadingPaymarkets$ = this.store.select(fromComphubMainReducer.getLoadingPaymarkets);
    this.loadingPaymarketsError$ = this.store.select(fromComphubMainReducer.getLoadingPaymarketsError);
    this.selectedPaymarket$ = this.store.select(fromComphubMainReducer.getSelectedPaymarket);
    this.hideNewPaymarketButton$ = this.store.select(fromComphubMainReducer.getHideNewPaymarketsButton);
    this.loadingMarketDataScopes$ = this.store.select(fromComphubMainReducer.getMarketDataScopesLoading);
    this.loadingLocations$ = this.store.select(fromComphubMainReducer.getLoadingMarketDataLocations);
    this.marketDataLocations$ = this.store.select(fromComphubMainReducer.getMarketDataLocations);
  }

  ngOnInit() {
    this.addPayMarketFormOpen$ = this.store.select(fromComphubMainReducer.getAddPayMarketFormOpen);
    this.savingPayMarket$ = this.store.select(fromComphubMainReducer.getSavingPayMarket);
    this.savingPayMarketConflict$ = this.store.select(fromComphubMainReducer.getSavingPayMarketConflict);
    this.savingPayMarketError$ = this.store.select(fromComphubMainReducer.getSavingPayMarketError);
    this.marketDataScope$ = this.store.select(fromComphubMainReducer.getMarketDataScope);
    this.infoBannerOpen$ = this.store.select(fromComphubMainReducer.getInfoBannerOpen);
    this.showSkipButton$ = this.store.select(fromComphubMainReducer.getShowSkipButton);
  }

  handleSavePayMarket(formData: AddPayMarketFormData) {
    this.store.dispatch(new fromMarketsCardActions.SavePayMarket(formData));
  }

  handleLocationFilterChanged(searchTerm: string) {
    this.store.dispatch(new fromMarketsCardActions.GetMarketDataLocations(searchTerm));
  }

  handleSkipAddPayMarket() {
    this.store.dispatch(new fromComphubPageActions.NavigateToNextCard());
  }

  handleSearchChanged(searchTerm: string) {
    this.store.dispatch(new fromMarketsCardActions.SetPaymarketFilter(searchTerm));
  }

  handlePaymarketChecked(checkedPayMarket: PricingPaymarket) {
    this.store.dispatch(new fromMarketsCardActions.SetSelectedPaymarket(checkedPayMarket));
  }

  handleDismissInfoBanner() {
    this.store.dispatch(new fromAddPayMarketFormActions.CloseInfoBanner());
  }

  clearSearchValue() {
    this.handleSearchChanged('');
  }

  handleAddNewMarketClicked() {
    this.store.dispatch(new fromAddPayMarketFormActions.OpenForm());
  }

  handleCancelAddPayMarket() {
    this.store.dispatch(new fromAddPayMarketFormActions.CloseForm());
  }
}
