import { Component, Input } from '@angular/core';

import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { PayMarket } from 'libs/models/paymarket';
import { SearchBase } from 'libs/features/search/containers/search-base';
import { ExchangeMapSummary } from 'libs/models/peer';
import * as fromSearchReducer from 'libs/features/search/reducers';
import * as fromSearchResultsActions from 'libs/features/search/actions/search-results.actions';

import * as fromExchangeExplorerReducer from '../../reducers';
import * as fromExchangeExplorerContextInfoActions from '../../actions/exchange-explorer-context-info.actions';
import * as fromExchangeFilterContextActions from '../../actions/exchange-filter-context.actions';

@Component({
  selector: 'pf-exchange-explorer',
  templateUrl: './exchange-explorer.component.html',
  styleUrls: ['./exchange-explorer.component.scss']
})
export class ExchangeExplorerComponent extends SearchBase {
  @Input() companyPayMarketId: number;
  @Input() shouldShowPayMarketBoundsFilter = true;
  @Input() shouldShowExcludeIndirectJobMatchesFilter = true;
  @Input() shouldShowExchangeScopeSelector = true;

  // Observables
  pageShown$: Observable<boolean>;
  limitToPayMarket$: Observable<boolean>;
  excludeIndirectJobMatches$: Observable<boolean>;
  hasAdditionalJobLevels$: Observable<boolean>;
  payMarket$: Observable<PayMarket>;
  mapSummary$: Observable<ExchangeMapSummary>;
  selectionsCount$: Observable<number>;
  exchangeJobTitles$: Observable<string[]>;

  exchangeId: number;

  constructor(
    private exchangeExplorerStore: Store<fromExchangeExplorerReducer.State>,
    protected store: Store<fromSearchReducer.State>
  ) {
    super(store);

    this.pageShown$ = this.store.pipe(select(fromSearchReducer.getPageShown));
    // TODO: Get Selection Count here instead
    this.selectionsCount$ = this.store.pipe(select(fromSearchReducer.getSingledFilterSelectionCount));

    this.limitToPayMarket$ = this.exchangeExplorerStore.pipe(select(fromExchangeExplorerReducer.getFilterContextLimitToPayMarket));
    this.excludeIndirectJobMatches$ = this.exchangeExplorerStore.pipe(
      select(fromExchangeExplorerReducer.getFilterContextExcludeIndirectJobMatches)
    );
    this.hasAdditionalJobLevels$ = this.exchangeExplorerStore.pipe(select(fromExchangeExplorerReducer.getFilterContextHasSimilarJobLevels));
    this.payMarket$ = this.exchangeExplorerStore.pipe(select(fromExchangeExplorerReducer.getExchangeExplorerPayMarket));
    this.mapSummary$ = this.exchangeExplorerStore.pipe(select(fromExchangeExplorerReducer.getPeerMapSummary));
    this.exchangeJobTitles$ = this.exchangeExplorerStore.pipe(select(fromExchangeExplorerReducer.getFilterContextExchangeJobTitles));
  }

  handleLimitToPayMarketToggled() {
    this.store.dispatch(new fromExchangeFilterContextActions.ToggleLimitToPayMarket());
  }

  handleIncludeAdditionalJobLevelsToggled() {
    this.store.dispatch(new fromExchangeFilterContextActions.ToggleExcludeIndirectJobMatches());
  }


  onResetApp() {
    this.store.dispatch(new fromSearchResultsActions.ClearResults());
    // TODO: Other stuff?

  }

  onSetContext(payload: any) {
    this.companyPayMarketId = payload.companyPayMarketId;
    if (payload.isExchangeSpecific) {
      this.exchangeId = payload.exchangeId;
      this.store.dispatch(new fromExchangeFilterContextActions.LimitToExchange(this.exchangeId));
      this.store.dispatch(new fromExchangeExplorerContextInfoActions.LoadContextInfo({exchangeId: this.exchangeId}));
    } else {
      const systemFilterRequest = {
        companyJobId: payload.companyJobId,
        companyPayMarketId: payload.companyPayMarketId
      };
      this.store.dispatch(new fromExchangeExplorerContextInfoActions.LoadContextInfo(systemFilterRequest));
    }
  }
}
