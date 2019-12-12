import {Component, OnDestroy, OnInit} from '@angular/core';

import {select, Store} from '@ngrx/store';
import {Observable, Subscription} from 'rxjs';
import {DataStateChangeEvent, GridDataResult, SelectionEvent} from '@progress/kendo-angular-grid';
import {State} from '@progress/kendo-data-query';
import * as cloneDeep from 'lodash.clonedeep';

import {
  ExchangeJobComparison,
  FeatureAreaConstants,
  GenericKeyValue,
  GridTypeEnum,
  KendoDropDownItem,
  UiPersistenceSettingConstants
} from 'libs/models';
import * as fromGridActions from 'libs/core/actions/grid.actions';
import * as fromRootState from 'libs/state/state';
import { SettingsService } from 'libs/state/app-context/services';
import { Rates, RateType, Weights, WeightType } from 'libs/data/data-sets';

import * as fromExchangeJobComparisonGridActions from '../../actions/exchange-job-comparison-grid.actions';
import * as fromExchangeDashboardActions from '../../actions/exchange-dashboard.actions';
import * as fromUploadOrgDataActions from '../../actions/upload-org-data.actions';
import * as fromDashboardReducer from '../../reducers';

@Component({
  selector: 'pf-exchange-job-comparison-grid',
  templateUrl: './exchange-job-comparison-grid.component.html',
  styleUrls: ['./exchange-job-comparison-grid.component.scss']
})
export class ExchangeJobComparisonGridComponent implements OnInit, OnDestroy {
  loadingExchangeJobComparisons$: Observable<boolean>;
  loadingExchangeJobComparisonsError$: Observable<boolean>;
  exchangeJobComparisonsGridData$: Observable<GridDataResult>;
  exchangeJobComparisonsGridState$: Observable<State>;
  exchangeJobOrgsDetailVisible$: Observable<boolean>;
  persistedComparisonGridMarket$: Observable<string>;
  persistedComparisonGridRate$: Observable<string>;
  persistedComparisonGridWeightType$: Observable<string>;
  companyContext$: Observable<any>;

  exchangeJobOrgsDetailVisibleSubscription: Subscription;
  exchangeJobComparisonGridStateSubscription: Subscription;
  persistedComparisonGridMarketSubscription: Subscription;
  persistedComparisonGridRateSubscription: Subscription;
  persistedComparisonGridWeightTypeSubscription: Subscription;

  exchangeJobComparisonGridState: State;
  marketFilterOptions: GenericKeyValue<string, string>[] = [{Key: 'USA', Value: 'USA'}, {Key: 'ALL', Value: 'Global'}];
  selectedMarket = 'USA';
  selectedKeys: number[] = [];
  rates: KendoDropDownItem[] = Rates;
  weights: KendoDropDownItem[] = Weights;
  selectedRate: KendoDropDownItem = { Name: RateType.Annual, Value: RateType.Annual };
  selectedWeight: KendoDropDownItem = { Name: WeightType.Inc, Value: WeightType.Inc };

  constructor(
    private store: Store<fromDashboardReducer.State>,
    private settingsService: SettingsService
  ) {
    this.loadingExchangeJobComparisons$ = this.store.pipe(select(fromDashboardReducer.getExchangeJobComparisonsLoading));
    this.loadingExchangeJobComparisonsError$ = this.store.pipe(select(fromDashboardReducer.getExchangeJobComparisonsLoadingError));
    this.exchangeJobComparisonsGridData$ = this.store.pipe(select(fromDashboardReducer.getExchangeJobComparisonsGridData));
    this.exchangeJobComparisonsGridState$ = this.store.pipe(select(fromDashboardReducer.getExchangeJobComparisonsGridState));
    this.exchangeJobOrgsDetailVisible$ = this.store.pipe(select(fromDashboardReducer.getExchangeDashboardExchangeJobOrgsDetailVisible));
    this.companyContext$ = this.store.pipe(select(fromRootState.getCompanyContext));
    this.persistedComparisonGridMarket$ = this.settingsService.selectUiPersistenceSetting(
      FeatureAreaConstants.PeerDashboard,
      UiPersistenceSettingConstants.ComparisonMarketSelection,
      'string'
    );
    this.persistedComparisonGridRate$ = this.settingsService.selectUiPersistenceSetting(
      FeatureAreaConstants.PeerDashboard,
      UiPersistenceSettingConstants.ComparisonRateSelection,
      'string'
    );
    this.persistedComparisonGridWeightType$ = this.settingsService.selectUiPersistenceSetting(
      FeatureAreaConstants.PeerDashboard,
      UiPersistenceSettingConstants.ComparisonWeightSelection,
      'string'
    );
  }

  get isAnnualRate(): boolean {
    return this.selectedRate.Value === RateType.Annual;
  }

  get isIncWeighted(): boolean {
    return this.selectedWeight.Value === WeightType.Inc;
  }

  get companyBaseAverageField(): string {
    return this.isAnnualRate ? 'CompanyBaseAverage' : 'HourlyCompanyBaseAverage';
  }

  get exchangeBaseAverageField(): string {
    const exchangeBaseAverage: string = this.isAnnualRate ? 'ExchangeBaseAverage' : 'HourlyExchangeBaseAverage';
    return this.isIncWeighted ? exchangeBaseAverage : exchangeBaseAverage + 'Org';
  }

  get exchangeIndexField(): string {
    return this.isIncWeighted ? 'ExchangeIndex' : 'ExchangeIndexOrg';
  }

  get digitsInfo(): string {
    return this.isAnnualRate ? '1.1-1' : '1.2-2';
  }

  // Grid
  handleDataStateChange(state: DataStateChangeEvent): void {
    this.store.dispatch(new fromGridActions.UpdateGrid(GridTypeEnum.ExchangeJobComparison, state));
    this.store.dispatch(new fromExchangeJobComparisonGridActions.LoadExchangeJobComparisons({
      countryCode: this.selectedMarket
    }));
  }

  getExchangeIndexValue(exchangeIndex: number): string {
    return exchangeIndex + '%';
  }

  getExchangeIndexFontColorClass(exchangeIndex: number): string {
    if (exchangeIndex < 50) {
      return 'text-warning';
    }
    if (exchangeIndex >= 100) {
      return 'text-success';
    }
  }

  onSelectionChange(e: SelectionEvent) {
    const selection = e.selectedRows[0];
    if (!selection) {
      return;
    }

    const selectedExchangeJobComparison: ExchangeJobComparison = selection.dataItem;
    this.store.dispatch(new fromExchangeDashboardActions.LoadExchangeJobOrgs({
      selectedExchangeJobComparison,
      selectedMarket: this.selectedMarket
    }));
  }

  openUploadOrgDataModal() {
    this.store.dispatch(new fromUploadOrgDataActions.OpenUploadOrgDataModal());
  }

  handleMarketFilterChanged(countryCode: string) {
    this.selectedMarket = countryCode;
    this.store.dispatch(new fromExchangeJobComparisonGridActions.SelectComparisonMarket({newMarket: countryCode}));
    this.store.dispatch(new fromExchangeJobComparisonGridActions.LoadExchangeJobComparisons({
      countryCode: this.selectedMarket
    }));
    this.store.dispatch(new fromExchangeDashboardActions.CloseSidebar());
  }

  handleRateSelectionChange(item: KendoDropDownItem) {
    this.store.dispatch(new fromExchangeJobComparisonGridActions.SelectRate({newRate: item.Value}));
    this.store.dispatch(new fromGridActions.ResetGrid(GridTypeEnum.ExchangeJobComparison));
    this.store.dispatch(new fromExchangeJobComparisonGridActions.LoadExchangeJobComparisons({
      countryCode: this.selectedMarket
    }));
  }

  handleWeightingTypeChanged(item: KendoDropDownItem) {
    this.selectedWeight = Weights.find(w => w.Value === item.Value);
    this.store.dispatch(new fromExchangeJobComparisonGridActions.SelectWeight({newWeight: item.Value}));
    this.store.dispatch(new fromGridActions.ResetGrid(GridTypeEnum.ExchangeJobComparison));
    this.store.dispatch(new fromExchangeJobComparisonGridActions.LoadExchangeJobComparisons({
      countryCode: this.selectedMarket
    }));
  }

  // Lifecycle
  ngOnInit() {
    this.persistedComparisonGridRateSubscription = this.persistedComparisonGridRate$.subscribe(rate => {
      if (!!rate) {
        this.selectedRate = Rates.find(r => r.Value === rate);
      }
    });

    this.persistedComparisonGridWeightTypeSubscription = this.persistedComparisonGridWeightType$.subscribe( weight => {
      if (!!weight) {
        this.selectedWeight = Weights.find(w => w.Value === weight);
      }
    });

    this.persistedComparisonGridMarketSubscription = this.persistedComparisonGridMarket$.subscribe((market) => {
      this.selectedMarket = !!market ? market : 'USA';
    });

    this.exchangeJobComparisonGridStateSubscription = this.exchangeJobComparisonsGridState$.subscribe(gridState => {
      this.exchangeJobComparisonGridState = cloneDeep(gridState);
    });

    this.exchangeJobOrgsDetailVisibleSubscription = this.exchangeJobOrgsDetailVisible$.subscribe(ct => {
      if (!ct) {
        this.selectedKeys = [];
      }
    });
  }

  ngOnDestroy() {
    this.persistedComparisonGridMarketSubscription.unsubscribe();
    this.persistedComparisonGridRateSubscription.unsubscribe();
    this.exchangeJobComparisonGridStateSubscription.unsubscribe();
    this.exchangeJobOrgsDetailVisibleSubscription.unsubscribe();
  }
}
