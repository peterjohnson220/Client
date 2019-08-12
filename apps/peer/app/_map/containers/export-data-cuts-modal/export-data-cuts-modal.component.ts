import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';

import { select, Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { DataStateChangeEvent, GridDataResult, RowArgs, RowClassArgs, SelectAllCheckboxState } from '@progress/kendo-angular-grid';
import { State } from '@progress/kendo-data-query';
import * as cloneDeep from 'lodash.clonedeep';

import { FeatureAreaConstants, GridTypeEnum, UiPersistenceSettingConstants } from 'libs/models/common';
import { PfValidators } from 'libs/forms/validators';
import { KendoDropDownItem } from 'libs/models/kendo';
import { Rates, RateType } from 'libs/data/data-sets';
import { SettingsService } from 'libs/state/app-context/services';
import * as fromGridActions from 'libs/core/actions/grid.actions';

import * as fromExchangeCompanyJobGridActions from '../../actions/exchange-company-job-grid.actions';
import * as fromExportDataCutsActions from '../../actions/export-data-cuts.actions';
import * as fromPeerMapReducer from '../../reducers';

@Component({
  selector: 'pf-export-data-cuts-modal',
  templateUrl: './export-data-cuts-modal.component.html',
  styleUrls: ['./export-data-cuts-modal.component.scss']
})
export class ExportDataCutsModalComponent implements OnInit, OnDestroy {
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

  exportDataCutsModalOpenSubscription: Subscription;
  persistedRateForExportSubscription: Subscription;
  exportingJobsErrorSubscription: Subscription;
  gridDataResultSubscription: Subscription;
  gridStateSubscription: Subscription;
  selectionsSubscription: Subscription;
  allIdsSubscription: Subscription;

  gridDataResult: GridDataResult;
  gridState: State;
  selections: number[] = [];
  exportDataCutsForm: FormGroup;
  attemptedSubmit = false;
  exchangeId: number;
  total = 0;
  pageSizes = [];
  allIds: number[] = [];
  rates: KendoDropDownItem[] = Rates;
  selectedRate: KendoDropDownItem = { Name: RateType.Annual, Value: RateType.Annual };

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
    this.persistedRateForExport$ = this.settingsService.selectUiPersistenceSetting(
      FeatureAreaConstants.PeerManageScopes,
      UiPersistenceSettingConstants.ExchangeDataCutsExportRateSelection,
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
    const numOfSelections = this.selections ? this.selections.length : 0;
    return `Exporting (${numOfSelections})...`;
  }
  get selectionsControl() { return this.exportDataCutsForm.get('selections'); }
  get selectedRateControl() { return this.exportDataCutsForm.get('selectedRate'); }
  get pageEntityIds(): number[] {
    const gridDataResult = this.gridDataResult;
    return !!gridDataResult ? this.gridDataResult.data.filter(item => item.IsInMapScope)
      .map(item => item.ExchangeJobToCompanyJobId) : [];
  }
  get selectAllDisabled(): boolean { return this.pageEntityIds.length === 0; }

  createForm(): void {
    this.exportDataCutsForm = this.fb.group({
      'selections': [[], [PfValidators.selectionRequired]],
      'selectedRate': [this.selectedRate]
    });
  }

  // Modal events
  handleFormSubmit(): void {
    this.attemptedSubmit = true;
    this.store.dispatch(new fromExportDataCutsActions.ExportDataCuts({selectedRate: this.selectedRate.Value}));
  }

  handleModalDismissed(): void {
    this.attemptedSubmit = false;
    this.store.dispatch(new fromExportDataCutsActions.CloseExportDataCutsModal);
    this.store.dispatch(new fromGridActions.ResetGrid(GridTypeEnum.ExchangeCompanyJob));
  }

  // Grid
  getCellTitle(isInMapScope: boolean, fieldValue: string): string {
    const scopeMessage = isInMapScope ? '' : ' - There is no peer data for this job in the selected scope.';
    return fieldValue + scopeMessage;
  }

  selectionKey(context: RowArgs): number {
    return !!context.dataItem ? context.dataItem.ExchangeJobToCompanyJobId : 0;
  }

  handlePageDropDownChanged(state: any, dropDownValue: number) {
    state.take = dropDownValue;
    state.skip = 0;
    this.handleDataStateChange(state);
  }

  handleDataStateChange(state: DataStateChangeEvent): void {
    this.store.dispatch(new fromGridActions.UpdateGrid(GridTypeEnum.ExchangeCompanyJob, state));
    this.loadExchangeCompanyJobs();
  }

  handleCellClick(event: any): void {
    if (!event.dataItem.IsInMapScope) {
      return;
    }

    const selectedExchangeJobToCompanyJobId = event.dataItem.ExchangeJobToCompanyJobId;
    this.store.dispatch(new fromGridActions.ToggleRowSelection(
      GridTypeEnum.ExchangeCompanyJob,
      selectedExchangeJobToCompanyJobId,
      this.pageEntityIds)
    );
  }

  rowClass(context: RowClassArgs): string {
    return !context.dataItem.IsInMapScope ? 'row-disabled' : '';
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

  // Lifecycle
  ngOnInit() {
    this.persistedRateForExportSubscription = this.persistedRateForExport$.subscribe(rate => {
      if (!!rate) {
        this.selectedRate = Rates.find(r => r.Value === rate);
      }
    });
    this.exportDataCutsModalOpenSubscription = this.exportDataCutsModalOpen$.subscribe(isOpen => {
      if (isOpen) {
        this.selectedRateControl.setValue(this.selectedRate);
        this.loadExchangeCompanyJobs();
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
        this.pageSizes = [
          {text: '10', value: 10},
          {text: '25', value: 25},
          {text: '50', value: 50},
          {text: '100', value: 100}
        ];
        this.total = gridDataResult.total;
      }
      this.store.dispatch(new fromGridActions.SetSelectAllState(GridTypeEnum.ExchangeCompanyJob, this.pageEntityIds));
    });

    this.allIdsSubscription = this.allIds$.subscribe(ids => {
      this.allIds = ids;
    });
  }

  ngOnDestroy() {
    this.exportDataCutsModalOpenSubscription.unsubscribe();
    this.exportingJobsErrorSubscription.unsubscribe();
    this.selectionsSubscription.unsubscribe();
    this.gridStateSubscription.unsubscribe();
    this.gridDataResultSubscription.unsubscribe();
    this.allIdsSubscription.unsubscribe();
  }

  // Helper methods
  loadExchangeCompanyJobs(): void {
    this.store.dispatch(new fromExchangeCompanyJobGridActions.LoadExchangeCompanyJobs);
    this.store.dispatch(new fromExchangeCompanyJobGridActions.LoadExchangeCompanyJobsIds);
  }
}
