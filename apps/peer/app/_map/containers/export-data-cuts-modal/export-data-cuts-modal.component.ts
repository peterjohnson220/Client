import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';

import { select, Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { DataStateChangeEvent, GridDataResult, RowArgs, SelectAllCheckboxState } from '@progress/kendo-angular-grid';
import { State } from '@progress/kendo-data-query';
import cloneDeep from 'lodash/cloneDeep';

import { Currency, FeatureAreaConstants, GenericMenuItem, GridTypeEnum, UiPersistenceSettingConstants } from 'libs/models/common';
import { PfValidators } from 'libs/forms/validators';
import { KendoDropDownItem } from 'libs/models/kendo';
import { Rates, RateType, Weights, WeightType, WeightTypeDisplayLabeled } from 'libs/data/data-sets';
import { SettingsService } from 'libs/state/app-context/services';
import * as fromGridActions from 'libs/core/actions/grid.actions';

import * as fromExchangeCompanyJobGridActions from '../../actions/exchange-company-job-grid.actions';
import * as fromExportDataCutsActions from '../../actions/export-data-cuts.actions';
import * as fromPeerMapReducer from '../../reducers';
import { ExportDataCutsContext } from '../../models';

@Component({
  selector: 'pf-export-data-cuts-modal',
  templateUrl: './export-data-cuts-modal.component.html',
  styleUrls: ['./export-data-cuts-modal.component.scss']
})
export class ExportDataCutsModalComponent implements OnInit, OnDestroy {
  @Input() context: ExportDataCutsContext;

  exchangeCompanyJobsLoading$: Observable<boolean>;
  exchangeCompanyJobsLoadingError$: Observable<boolean>;
  exportDataCutsModalOpen$: Observable<boolean>;
  exportingDataCuts$: Observable<boolean>;
  exportingDataCutsError$: Observable<boolean>;
  view$: Observable<GridDataResult>;
  gridState$: Observable<State>;
  selections$: Observable<number[]>;
  selectAllState$: Observable<SelectAllCheckboxState>;
  allIds$: Observable<number[]>;
  persistedRateForExport$: Observable<string>;
  persistedWeightingTypeForExport$: Observable<string>;
  currencies$: Observable<Currency[]>;

  exportDataCutsModalOpenSubscription: Subscription;
  persistedRateForExportSubscription: Subscription;
  persistedWeightingTypeForExportSubscription: Subscription;
  exportingJobsErrorSubscription: Subscription;
  gridDataResultSubscription: Subscription;
  gridStateSubscription: Subscription;
  selectionsSubscription: Subscription;
  allIdsSubscription: Subscription;
  currenciesSubscription: Subscription;

  gridDataResult: GridDataResult;
  gridState: State;
  selections: number[] = [];
  exportDataCutsForm: FormGroup;
  attemptedSubmit = false;
  exchangeId: number;
  total = 0;
  allIds: number[] = [];
  rates: KendoDropDownItem[] = Rates;
  selectedRate: KendoDropDownItem = { Name: RateType.Annual, Value: RateType.Annual };
  selectedCurrency: Currency = { CurrencyCode: 'USD', CurrencyName: 'United States Dollar', CurrencyDisplay: 'USD - United States Dollar'};
  currencies: Currency[];
  filteredCurrencies: Currency[];
  scopesToExportOptions: GenericMenuItem[] = [];
  selectedScopesToExport: GenericMenuItem[] = [];
  selectedWeightingType: KendoDropDownItem = { Name: WeightTypeDisplayLabeled.Inc, Value: WeightType.Inc };
  readonly currentMapViewOptionValue = 'Current Map View';

  constructor(
    private store: Store<fromPeerMapReducer.State>,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private settingsService: SettingsService
  ) {
    this.exchangeCompanyJobsLoading$ = this.store.pipe(select(fromPeerMapReducer.getExchangeCompanyJobsLoading));
    this.exchangeCompanyJobsLoadingError$ = this.store.pipe(select(fromPeerMapReducer.getExchangeCompanyJobsLoadingError));
    this.view$ = this.store.pipe(select(fromPeerMapReducer.getExchangeCompanyJobsGridData));
    this.exportDataCutsModalOpen$ = this.store.pipe(select(fromPeerMapReducer.getExportDataCutsModalOpen));
    this.exportingDataCuts$ = this.store.pipe(select(fromPeerMapReducer.getDataCutsExporting));
    this.exportingDataCutsError$ = this.store.pipe(select(fromPeerMapReducer.getDataCutsExportingError));
    this.gridState$ = this.store.pipe(select(fromPeerMapReducer.getExchangeCompanyJobsGridState));
    this.selections$ = this.store.pipe(select(fromPeerMapReducer.getExchangeCompanyJobsGridSelections));
    this.selectAllState$ = this.store.pipe(select(fromPeerMapReducer.getExchangeCompanyJobsGridSelectAllState));
    this.allIds$ = this.store.pipe(select(fromPeerMapReducer.getExchangeCompanyJobsAllIds));
    this.currencies$ = this.store.pipe(select(fromPeerMapReducer.getExportDataCutsModalCurrencies));
    this.persistedRateForExport$ = this.settingsService.selectUiPersistenceSetting(
      FeatureAreaConstants.PeerManageScopes,
      UiPersistenceSettingConstants.ExchangeDataCutsExportRateSelection,
      'string'
    );
    this.persistedWeightingTypeForExport$ = this.settingsService.selectUiPersistenceSetting(
      FeatureAreaConstants.PeerManageScopes,
      UiPersistenceSettingConstants.ExchangeDataCutsExportWeightingTypeSelection,
      'string'
    );

    this.exchangeId = this.route.parent.snapshot.params.id;
    this.createForm();
  }

  get primaryButtonText() {
    const numOfSelections = this.selections ? this.selections.length : 0;
    return `Export (${numOfSelections})`;
  }
  get primaryButtonTextSubmitting() {
    return `Exporting...`;
  }
  get selectionsControl() { return this.exportDataCutsForm.get('selections'); }
  get selectedRateControl() { return this.exportDataCutsForm.get('selectedRate'); }
  get selectedCurrencyControl() { return this.exportDataCutsForm.get('selectedCurrency'); }
  get pageEntityIds(): number[] {
    const gridDataResult = this.gridDataResult;
    return !!gridDataResult ? this.gridDataResult.data.map(item => item.ExchangeJobToCompanyJobId) : [];
  }
  get selectAllDisabled(): boolean { return this.pageEntityIds.length === 0; }

  createForm(): void {
    this.exportDataCutsForm = this.fb.group({
      'selections': [[], [PfValidators.selectionRequired]],
      'selectedRate': [this.selectedRate],
      'selectedCurrency': [this.selectedCurrency],
      'scopes': [[], [PfValidators.selectionRequired]]
    });
  }

  // Modal events
  handleFormSubmit(): void {
    this.attemptedSubmit = true;
    const payload = {
        selectedRate: this.selectedRate.Value,
        scopes: this.selectedScopesToExport.filter(s => s.Value !== this.currentMapViewOptionValue).map(s => Number(s.Value)),
        exportCurrentMap: this.selectedScopesToExport.some(s => s.Value === this.currentMapViewOptionValue),
        selectedWeightingType: this.selectedWeightingType.Value,
        selectedCurrency: this.selectedCurrency.CurrencyCode
      };

    this.store.dispatch(new fromExportDataCutsActions.ExportDataCuts(payload));
  }

  handleModalDismissed(): void {
    this.attemptedSubmit = false;
    this.scopesToExportOptions = [];
    this.store.dispatch(new fromExportDataCutsActions.CloseExportDataCutsModal);
    this.store.dispatch(new fromGridActions.ResetGrid(GridTypeEnum.ExchangeCompanyJob));
  }

  // Grid
  selectionKey(context: RowArgs): number {
    return !!context.dataItem ? context.dataItem.ExchangeJobToCompanyJobId : 0;
  }

  handleDataStateChange(state: DataStateChangeEvent): void {
    this.store.dispatch(new fromGridActions.UpdateGrid(GridTypeEnum.ExchangeCompanyJob, state));
    this.loadExchangeCompanyJobs();
  }

  handleCellClick(event: any): void {
    const selectedExchangeJobToCompanyJobId = event.dataItem.ExchangeJobToCompanyJobId;
    this.store.dispatch(new fromGridActions.ToggleRowSelection(
      GridTypeEnum.ExchangeCompanyJob,
      selectedExchangeJobToCompanyJobId,
      this.pageEntityIds)
    );
  }

  onSelectAllChange(checkedState: SelectAllCheckboxState) {
    this.store.dispatch(new fromGridActions.ToggleSelectAll(GridTypeEnum.ExchangeCompanyJob, this.pageEntityIds));
  }

  isChecked(exchangeJobToCompanyJobId: number): boolean {
    return this.selections.indexOf(exchangeJobToCompanyJobId) > -1;
  }

  onCbClick(exchangeJobToCompanyJobId: number) {
    this.store.dispatch(new fromGridActions.ToggleRowSelection(
      GridTypeEnum.ExchangeCompanyJob,
      exchangeJobToCompanyJobId,
      this.pageEntityIds)
    );
  }

  onSelectAllClick(event: any) {
    if (!this.allIds || !this.allIds.length) {
      return;
    }

    this.store.dispatch(new fromGridActions.SetSelections(GridTypeEnum.ExchangeCompanyJob, this.allIds, this.pageEntityIds));
  }

  onClearAllClick(event: any) {
    this.store.dispatch(new fromGridActions.SetSelections(GridTypeEnum.ExchangeCompanyJob, [], this.pageEntityIds));
  }

  handleRateSelectionChange(item: KendoDropDownItem) {
    this.selectedRate = item;
    this.store.dispatch(new fromExportDataCutsActions.SelectRate({newRate: item.Value}));
  }

  handleWeightingTypeChanged(item: KendoDropDownItem) {
    this.selectedWeightingType = item;
    this.store.dispatch(new fromExportDataCutsActions.SelectWeightingType({newWeightingType: item.Value}));
  }

  handleCurrencySelectionChange(item: Currency) {
    this.selectedCurrency = item;
  }

  handleFilter(value) {
    this.filteredCurrencies = this.currencies.filter((s) =>
      s.CurrencyDisplay.toLowerCase().indexOf(value.toLowerCase()) !== -1);
  }

  // Lifecycle
  ngOnInit() {
    this.store.dispatch(new fromExportDataCutsActions.LoadCurrencies());
    this.persistedRateForExportSubscription = this.persistedRateForExport$.subscribe(rate => {
      if (!!rate) {
        this.selectedRate = Rates.find(r => r.Value === rate);
      }
    });
    this.persistedWeightingTypeForExportSubscription = this.persistedWeightingTypeForExport$.subscribe(weightingType => {
      if (!!weightingType) {
        this.selectedWeightingType = Weights.find(w => w.Value === weightingType);
      }
    });
    this.exportDataCutsModalOpenSubscription = this.exportDataCutsModalOpen$.subscribe(isOpen => {
      if (isOpen) {
        this.selectedRateControl.setValue(this.selectedRate);
        this.selectedCurrencyControl.setValue(this.selectedCurrency);
        this.loadExchangeCompanyJobs();
        this.buildScopeSelectorOptions();
      }
    });
    this.exportingJobsErrorSubscription = this.exportingDataCutsError$.subscribe(error => {
      if (error) {
        this.selectionsControl.setErrors({'error': 'There was an error adding the selected jobs.'});
      }
    });
    this.gridStateSubscription = this.gridState$.subscribe(gridState => {
      this.gridState = cloneDeep(gridState);
    });
    this.selectionsSubscription = this.selections$.subscribe(selections => {
      this.selections = cloneDeep(selections);
      this.selectionsControl.markAsTouched();
    });
    this.gridDataResultSubscription = this.view$.subscribe(gridDataResult => {
      this.gridDataResult = gridDataResult;
      if (gridDataResult.total > this.total) {
        this.total = gridDataResult.total;
      }
      this.store.dispatch(new fromGridActions.SetSelectAllState(GridTypeEnum.ExchangeCompanyJob, this.pageEntityIds));
    });
    this.allIdsSubscription = this.allIds$.subscribe(ids => {
      this.allIds = ids;
    });
    this.currenciesSubscription = this.currencies$.subscribe(c => {
      this.currencies = c;
      this.filteredCurrencies = c;
    });
  }

  ngOnDestroy() {
    this.exportDataCutsModalOpenSubscription.unsubscribe();
    this.exportingJobsErrorSubscription.unsubscribe();
    this.selectionsSubscription.unsubscribe();
    this.gridStateSubscription.unsubscribe();
    this.gridDataResultSubscription.unsubscribe();
    this.allIdsSubscription.unsubscribe();
    this.persistedWeightingTypeForExportSubscription.unsubscribe();
    this.persistedRateForExportSubscription.unsubscribe();
    this.currenciesSubscription.unsubscribe();
  }

  // Helper methods
  loadExchangeCompanyJobs(): void {
    this.store.dispatch(new fromExchangeCompanyJobGridActions.LoadExchangeCompanyJobs);
    this.store.dispatch(new fromExchangeCompanyJobGridActions.LoadExchangeCompanyJobsIds);
  }

  private buildScopeSelectorOptions(): void {
    this.selectedScopesToExport = [];
    this.scopesToExportOptions = [];
    const currentMapViewOption = {
      DisplayName: this.currentMapViewOptionValue,
      Value: this.currentMapViewOptionValue,
      IsSelected: true,
      FeaturedOption: true
    };

    if (!this.context.selectedExchangeScope) {
      this.selectedScopesToExport = [currentMapViewOption];
      this.scopesToExportOptions = [currentMapViewOption];
    }

    this.context.exchangeScopeItems.map(si => {
      const isSelectedScopeFromContext = !!this.context.selectedExchangeScope
        ? this.context.selectedExchangeScope.ExchangeScopeId === si.ExchangeScopeId
        : false;
      const selectorOption = {
        DisplayName: si.Name,
        IsSelected: isSelectedScopeFromContext,
        Value: si.ExchangeScopeId.toString()
      };

      this.scopesToExportOptions.push(selectorOption);

      if (isSelectedScopeFromContext) {
        this.selectedScopesToExport.push(selectorOption);
      }
    });
  }
}
