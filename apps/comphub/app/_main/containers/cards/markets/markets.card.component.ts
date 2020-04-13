import { Component, OnInit } from '@angular/core';

import { forkJoin, Observable, Subscription } from 'rxjs';
import { filter, take } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import * as fromRootReducer from 'libs/state/state';
import { QuickPriceType } from 'libs/constants';
import { UserContext } from 'libs/models/security';

import * as fromComphubMainReducer from '../../../reducers';
import * as fromMarketsCardActions from '../../../actions/markets-card.actions';
import * as fromComphubPageActions from '../../../actions/comphub-page.actions';
import * as fromAddPayMarketFormActions from '../../../actions/add-paymarket-form.actions';
import { PricingPaymarket, AddPayMarketFormData, MarketDataScope, MarketDataLocation, WorkflowContext } from '../../../models';
import { ComphubPages } from '../../../data';

@Component({
  selector: 'pf-markets-card',
  templateUrl: './markets.card.component.html',
  styleUrls: ['./markets.card.component.scss']
})
export class MarketsCardComponent implements OnInit {
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
  userContext$: Observable<UserContext>;
  workflowContext$: Observable<WorkflowContext>;

  workflowContextSub: Subscription;

  workflowContext: WorkflowContext;
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
    this.userContext$ = this.store.select(fromRootReducer.getUserContext);
    this.workflowContext$ = this.store.select(fromComphubMainReducer.getWorkflowContext);
  }

  ngOnInit() {
    this.addPayMarketFormOpen$ = this.store.select(fromComphubMainReducer.getAddPayMarketFormOpen);
    this.savingPayMarket$ = this.store.select(fromComphubMainReducer.getSavingPayMarket);
    this.savingPayMarketConflict$ = this.store.select(fromComphubMainReducer.getSavingPayMarketConflict);
    this.savingPayMarketError$ = this.store.select(fromComphubMainReducer.getSavingPayMarketError);
    this.marketDataScope$ = this.store.select(fromComphubMainReducer.getMarketDataScope);
    this.infoBannerOpen$ = this.store.select(fromComphubMainReducer.getInfoBannerOpen);
    this.showSkipButton$ = this.store.select(fromComphubMainReducer.getShowSkipButton);

    this.workflowContextSub = this.workflowContext$.subscribe(wfc => this.workflowContext = wfc);

    this.setupDefaultPayMarket();
  }

  setupDefaultPayMarket() {
    forkJoin([this.getPayMarketsLoaded(), this.getUserContextLoaded(), this.getWorkflowContextLoaded()])
      .subscribe(([payMarkets, userContext, workflowContext]) => {
        this.setDefaultPayMarketSelection(payMarkets, userContext, workflowContext);
      });
  }

  getPayMarketsLoaded(): Observable<PricingPaymarket[]> {
    return this.paymarkets$.pipe(
      filter(f => !!f && f.length > 0),
      take(1)
    );
  }

  getUserContextLoaded(): Observable<UserContext> {
    return this.userContext$.pipe(
      filter(f => !!f),
      take(1)
    );
  }

  getWorkflowContextLoaded(): Observable<WorkflowContext> {
    return this.workflowContext$.pipe(
      filter(f => !!f),
      take(1)
    );
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
    this.store.dispatch(new fromMarketsCardActions.SetSelectedPaymarket(
                              {paymarket: checkedPayMarket, initialLoad: false, quickPriceType: this.workflowContext.quickPriceType}));
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

  setDefaultPayMarketSelection(paymarkets: PricingPaymarket[], userContext: UserContext, workflowContext: WorkflowContext) {
    if (workflowContext.quickPriceType === QuickPriceType.PEER) {
      this.store.dispatch(new fromMarketsCardActions.HideAddNewPaymarketButton());
      let userDefaultPaymarketSet = false;
      for (const pp of paymarkets) {
        if (pp.CompanyPayMarketId === userContext.DefaultPayMarketId) {
          this.store.dispatch(new fromMarketsCardActions.SetSelectedPaymarket(
            {paymarket: pp, initialLoad: true, quickPriceType: workflowContext.quickPriceType}));
          userDefaultPaymarketSet = true;
          break;
        }
      }
      if (!userDefaultPaymarketSet) {
        this.store.dispatch(new fromMarketsCardActions.SetSelectedPaymarket(
          {paymarket: null, initialLoad: true, quickPriceType: workflowContext.quickPriceType}));
      }
    }
  }
}
