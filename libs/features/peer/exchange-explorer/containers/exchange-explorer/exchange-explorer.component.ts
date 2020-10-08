import { Component, Input } from '@angular/core';

import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

import { PayMarket } from 'libs/models/paymarket';
import { SearchBase } from 'libs/features/search/containers/search-base';
import { ExchangeMapSummary } from 'libs/models/peer';
import { ExchangeJobExchangeDetail } from 'libs/features/peer/models';
import { SettingsService } from 'libs/state/app-context/services';
import { FeatureAreaConstants, UiPersistenceSettingConstants } from 'libs/models/common';
import { ComphubExchangeExplorerContextRequest } from 'libs/models/peer/requests/comphub-exchange-explorer-context-request.model';
import * as fromSearchReducer from 'libs/features/search/reducers';
import * as fromSearchResultsActions from 'libs/features/search/actions/search-results.actions';
import * as fromSearchFiltersActions from 'libs/features/search/actions/search-filters.actions';
import * as fromChildSearchFilterActions from 'libs/features/search/actions/child-filter.actions';
import * as fromSearchPageActions from 'libs/features/search/actions/search-page.actions';
import { SearchFeatureIds } from 'libs/features/search/enums/search-feature-ids';

import * as fromExchangeExplorerReducer from '../../reducers';
import * as fromExchangeExplorerContextInfoActions from '../../actions/exchange-explorer-context-info.actions';
import * as fromExchangeFilterContextActions from '../../actions/exchange-filter-context.actions';
import * as fromExchangeExplorerDataCutsActions from '../../actions/exchange-data-cut.actions';

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
  @Input() jobSelectorRequiresPayMarket = true;
  @Input() exchangeJobSelectorStatic = false;

  // Observables
  pageShown$: Observable<boolean>;
  limitToPayMarket$: Observable<boolean>;
  excludeIndirectJobMatches$: Observable<boolean>;
  hasAdditionalJobLevels$: Observable<boolean>;
  payMarket$: Observable<PayMarket>;
  mapSummary$: Observable<ExchangeMapSummary>;
  selectionsCount$: Observable<number>;
  exchangeJobFilterOptions$: Observable<ExchangeJobExchangeDetail[]>;
  selectedExchangeJobId$: Observable<number>;
  searchingChildFilters$: Observable<boolean>;

  exchangeId: number;
  companyJobId: number;
  cutGuid: string;
  exchangeJobId: number;

  constructor(
    private exchangeExplorerStore: Store<fromExchangeExplorerReducer.State>,
    protected store: Store<fromSearchReducer.State>,
    private settingsService: SettingsService
  ) {
    super(store, null, SearchFeatureIds.ExchangeExplorer, null);

    this.pageShown$ = this.store.pipe(select(fromSearchReducer.getPageShown));
    this.selectionsCount$ = this.store.pipe(select(fromSearchReducer.getOverallFilterSelectionsCount));
    this.searchingChildFilters$ = this.store.pipe(select(fromSearchReducer.getSearchingChildFilter));

    this.limitToPayMarket$ = this.exchangeExplorerStore.pipe(select(fromExchangeExplorerReducer.getFilterContextLimitToPayMarket));
    this.excludeIndirectJobMatches$ = this.exchangeExplorerStore.pipe(select(fromExchangeExplorerReducer.getFilterContextExcludeIndirectJobMatches));
    this.hasAdditionalJobLevels$ = this.exchangeExplorerStore.pipe(select(fromExchangeExplorerReducer.getFilterContextHasSimilarJobLevels));
    this.payMarket$ = this.exchangeExplorerStore.pipe(select(fromExchangeExplorerReducer.getExchangeExplorerPayMarket));
    this.mapSummary$ = this.exchangeExplorerStore.pipe(select(fromExchangeExplorerReducer.getPeerMapSummary));
    this.exchangeJobFilterOptions$ = this.exchangeExplorerStore.pipe(select(fromExchangeExplorerReducer.getExchangeJobFilterOptions));
    this.selectedExchangeJobId$ = this.exchangeExplorerStore.pipe(select(fromExchangeExplorerReducer.getSelectedExchangeJobId));
  }

  handleLimitToPayMarketToggled() {
    this.store.dispatch(new fromExchangeFilterContextActions.ToggleLimitToPayMarket());
  }

  handleIncludeAdditionalJobLevelsToggled() {
    this.store.dispatch(new fromExchangeFilterContextActions.ToggleExcludeIndirectJobMatches());
  }

  handleClearFilters() {
    this.store.dispatch(new fromSearchFiltersActions.ClearFilters());
  }

  onResetApp() {
    this.store.dispatch(new fromSearchResultsActions.ClearResults());
  }

  handleExchangeJobSelected(payload: {exchangeJobId: number, similarExchangeJobIds: number[]}): void {
    // We want to refresh the paymarket context if the exchange job is changed.
    if (!!this.companyJobId && !!this.companyPayMarketId) {
      const systemFilterRequest = {
        companyJobId: this.companyJobId,
        companyPayMarketId: this.companyPayMarketId,
        exchangeJobId: payload.exchangeJobId
      };
      this.store.dispatch(new fromExchangeExplorerContextInfoActions.RefreshPayMarketContext(systemFilterRequest));
    }
    if (!!this.companyJobId && !!this.cutGuid) {
      const systemFilterRequest = {
        companyJobId: this.companyJobId,
        exchangeJobId: payload.exchangeJobId,
        cutGuid: this.cutGuid,
      };
      this.store.dispatch(new fromExchangeExplorerContextInfoActions.RefreshPayMarketContext(systemFilterRequest));
    }
    this.store.dispatch(new fromExchangeFilterContextActions.SetExchangeJobSelection(payload));
  }

  handleMapClicked() {
    let searchingChildFilter = null;

    this.searchingChildFilters$.pipe(take(1)).subscribe(scf =>
    searchingChildFilter = scf);

    if (searchingChildFilter === true) {
      this.store.dispatch(new fromSearchPageActions.ToggleChildFilterSearch());
      this.store.dispatch(new fromChildSearchFilterActions.ClearChildFilter());
    }
  }

  onSetContext(payload: any) {
    if (!!payload.cutGuid && payload.cutGuid !== '') {
      const systemFilterRequest = {exchangeDataCutGuid: payload.cutGuid, companyJobId: payload.companyJobId};
      this.cutGuid = payload.cutGuid;
      this.store.dispatch(new fromExchangeExplorerDataCutsActions.LoadExchangeDataCut(systemFilterRequest));
      return;
    }
    this.companyJobId = payload.companyJobId;
    this.companyPayMarketId = payload.companyPayMarketId;
    if (payload.isExchangeSpecific) {
      this.exchangeId = payload.exchangeId;
      if (!!payload.exchangeJobId) {
        this.exchangeJobId = payload.exchangeJobId;
        const request: ComphubExchangeExplorerContextRequest = {
          ExchangeId : payload.exchangeId,
          ExchangeJobId : payload.exchangeJobId,
          CompanyPayMarketId : payload.companyPayMarketId
        };
        this.store.dispatch(new fromExchangeExplorerContextInfoActions.LoadContextInfo(request));
      } else {
        const defaultScopeId$ = this.settingsService.selectUiPersistenceSettingFromDictionary<string>(
          FeatureAreaConstants.PeerManageScopes, UiPersistenceSettingConstants.PeerDefaultExchangeScopes, payload.exchangeId
        );
        defaultScopeId$.pipe(take(1)).subscribe(s => {
          if (!!s) {
            this.store.dispatch(new fromExchangeFilterContextActions.SetExchangeScopeSelection(<any>{Id: s, ExchangeId: payload.exchangeId, IsDefault: true}));
          }
          this.store.dispatch(new fromExchangeExplorerContextInfoActions.LoadContextInfo({exchangeId: this.exchangeId, defaultScopeId: s}));
        });
      }
    } else {
      const systemFilterRequest = {
        companyJobId: payload.companyJobId,
        companyPayMarketId: payload.companyPayMarketId
      };
      this.store.dispatch(new fromExchangeExplorerContextInfoActions.LoadContextInfo(systemFilterRequest));
    }
  }
}
