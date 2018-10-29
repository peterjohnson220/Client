import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';

import { select, Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import {DataStateChangeEvent, GridDataResult, RowArgs, RowClassArgs} from '@progress/kendo-angular-grid';
import { State } from '@progress/kendo-data-query';
import * as cloneDeep from 'lodash.clonedeep';

import { GridTypeEnum } from 'libs/models/common';
import { PfValidators } from 'libs/forms/validators';
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

  exportDataCutsForm: FormGroup;
  gridState: State;
  selections: number[];
  attemptedSubmit = false;
  exchangeId: number;

  exportDataCutsModalOpenSubscription: Subscription;
  exportingJobsErrorSubscription: Subscription;
  gridStateSubscription: Subscription;
  selectionsSubscription: Subscription;

  constructor(
    private store: Store<fromPeerMapReducer.State>,
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) {
    this.exchangeCompanyJobsLoading$ = this.store.pipe(select(fromPeerMapReducer.getExchangeCompanyJobsLoading));
    this.exchangeCompanyJobsLoadingError$ = this.store.pipe(select(fromPeerMapReducer.getExchangeCompanyJobsLoadingError));
    this.view$ = this.store.pipe(select(fromPeerMapReducer.getExchangeCompanyJobsGridData));
    this.exportDataCutsModalOpen$ = this.store.pipe(select(fromPeerMapReducer.getExportDataCutsModalOpen));
    this.exportingDataCuts$ = this.store.pipe(select(fromPeerMapReducer.getDataCutsExporting));
    this.exportingDataCutsError$ = this.store.pipe(select(fromPeerMapReducer.getDataCutsExportingError));
    this.gridState$ = this.store.pipe(select(fromPeerMapReducer.getExchangeCompanyJobsGridState));
    this.selections$ = this.store.pipe(select(fromPeerMapReducer.getExchangeCompanyJobsGridSelections));

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

  createForm(): void {
    this.exportDataCutsForm = this.fb.group({
      'selections': [[], [PfValidators.selectionRequired]]
    });
  }

  // Modal events
  handleFormSubmit(): void {
    this.attemptedSubmit = true;
    this.store.dispatch(new fromExportDataCutsActions.ExportDataCuts);
  }

  handleModalDismissed(): void {
    this.attemptedSubmit = false;
    this.store.dispatch(new fromExportDataCutsActions.CloseExportDataCutsModal);
    this.store.dispatch(new fromGridActions.ResetGrid(GridTypeEnum.ExchangeCompanyJob));
  }

  // Grid
  getCellTitle(isInMapScope: boolean): string {
    return isInMapScope ? '' : 'There is no peer data for this job in the selected scope.';
  }

  selectionKey(context: RowArgs): number {
    return context.dataItem.ExchangeJobToCompanyJobId;
  }

  handleDataStateChange(state: DataStateChangeEvent): void {
    this.store.dispatch(new fromGridActions.UpdateGrid(GridTypeEnum.ExchangeCompanyJob, state));
    this.loadExchangeCompanyJobs();
  }

  handleCellClick(event: any): void {
    if (!event.dataItem.IsInMapScope) {
      return;
    }
    const selectedExchangeJobToCompanyJobIds = event.dataItem.ExchangeJobToCompanyJobId;
    this.store.dispatch(new fromGridActions.ToggleRowSelection(GridTypeEnum.ExchangeCompanyJob, selectedExchangeJobToCompanyJobIds));
    this.selectionsControl.markAsTouched();
  }

  rowClass(context: RowClassArgs): string {
    return !context.dataItem.IsInMapScope ? 'row-disabled' : '';
  }

  // Lifecycle
  ngOnInit() {
    this.exportDataCutsModalOpenSubscription = this.exportDataCutsModalOpen$.subscribe(isOpen => {
      if (isOpen) {
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
      this.selections = selections;
    });
  }

  ngOnDestroy() {
    this.exportDataCutsModalOpenSubscription.unsubscribe();
    this.exportingJobsErrorSubscription.unsubscribe();
    this.selectionsSubscription.unsubscribe();
    this.gridStateSubscription.unsubscribe();
  }

  // Helper methods
  loadExchangeCompanyJobs(): void {
    this.store.dispatch(new fromExchangeCompanyJobGridActions.LoadExchangeCompanyJobs);
  }
}
