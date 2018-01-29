import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { GridDataResult, PageChangeEvent, RowArgs, RowClassArgs } from '@progress/kendo-angular-grid';
import { SortDescriptor, State } from '@progress/kendo-data-query';

import { GridTypeEnum } from 'libs/models/common';
import { AddExchangeJobsRequest } from 'libs/models/peer/index';
import { PfValidators } from 'libs/forms/validators';
import * as fromGridActions from 'libs/core/actions/grid.actions';

import * as fromAvailableJobsActions from '../../actions/available-jobs.actions';
import * as fromExchangeJobsActions from '../../actions/exchange-jobs.actions';
import * as fromPeerAdminReducer from '../../reducers';

@Component({
  selector: 'pf-add-jobs-modal',
  templateUrl: './add-jobs-modal.component.html',
  styleUrls: ['./add-jobs-modal.component.scss']
})
export class AddJobsModalComponent implements OnInit, OnDestroy {
  availableJobsLoading$: Observable<boolean>;
  availableJobsLoadingError$: Observable<boolean>;
  addJobsModalOpen$: Observable<boolean>;
  addingJobs$: Observable<boolean>;
  addingJobsError$: Observable<boolean>;
  view$: Observable<GridDataResult>;
  addJobsModalOpenSubscription: Subscription;
  addJobsErrorSubscription: Subscription;
  addJobsForm: FormGroup;
  gridState$: Observable<State>;
  selections: number[];
  selections$: Observable<number[]>;
  selectionsSubscription: Subscription;
  attemptedSubmit = false;
  exchangeId: number;
  searchTerm: string;

  constructor(
    private store: Store<fromPeerAdminReducer.State>,
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) {
    this.availableJobsLoading$ = this.store.select(fromPeerAdminReducer.getAvailableJobsLoading);
    this.availableJobsLoadingError$ = this.store.select(fromPeerAdminReducer.getAvailableJobsLoadingError);
    this.view$ = this.store.select(fromPeerAdminReducer.getAvailableJobsGrid);
    this.addJobsModalOpen$ = this.store.select(fromPeerAdminReducer.getAddExchangeJobsModalOpen);
    this.addingJobs$ = this.store.select(fromPeerAdminReducer.getExchangeJobsAdding);
    this.addingJobsError$ = this.store.select(fromPeerAdminReducer.getExchangeJobsAddingError);
    this.gridState$ = this.store.select(fromPeerAdminReducer.getAvailableJobsGridState);
    this.selections$ = this.store.select(fromPeerAdminReducer.getAvailableJobsGridSelections);

    this.exchangeId = this.route.snapshot.params.id;
    this.createForm();
  }

  get primaryButtonText() {
    const numOfSelections = this.selections ? this.selections.length : 0;
    return `Add (${numOfSelections})`;
  }
  get primaryButtonTextSubmitting() {
    const numOfSelections = this.selections ? this.selections.length : 0;
    return `Adding (${numOfSelections})`;
  }
  get selectionsControl() { return this.addJobsForm.get('selections'); }

  createForm(): void {
    this.addJobsForm = this.fb.group({
      'selections': [[], [PfValidators.selectionRequired]]
    });
  }

  // Modal events
  handleFormSubmit(): void {
    this.attemptedSubmit = true;
    const addJobsRequest: AddExchangeJobsRequest = {
      ExchangeId: this.exchangeId,
      MDJobsBaseIds: this.selections
    };
    this.store.dispatch(new fromExchangeJobsActions.AddingExchangeJobs(addJobsRequest));
  }

  handleModalDismissed(): void {
    this.attemptedSubmit = false;
    this.searchTerm = '';
    this.store.dispatch(new fromExchangeJobsActions.CloseAddExchangeJobsModal);
    this.store.dispatch(new fromGridActions.ResetGrid(GridTypeEnum.AvailableJobs));
  }

  // Grid
  selectionKey(context: RowArgs): number {
    return context.dataItem.MDJobsBaseId;
  }

  updateSearchFilter(newSearchTerm: string) {
    this.store.dispatch(new fromGridActions.UpdateFilter(
      GridTypeEnum.AvailableJobs,
      {columnName: 'JobTitle', value: newSearchTerm}
      ));
    this.loadAvailableJobs();
  }

  handlePageChange(event: PageChangeEvent): void {
    this.store.dispatch(new fromGridActions.PageChange(GridTypeEnum.AvailableJobs, event));
    this.loadAvailableJobs();
  }

  handleSortChange(sort: SortDescriptor[]) {
    this.store.dispatch(new fromGridActions.SortChange(GridTypeEnum.AvailableJobs, sort));
    this.loadAvailableJobs();
  }

  handleCellClick(event: any): void {
    if (event.dataItem.InExchange) {
      return;
    }
    const selectedMDJobsBaseId = event.dataItem.MDJobsBaseId;
    this.store.dispatch(new fromGridActions.ToggleRowSelection(GridTypeEnum.AvailableJobs, selectedMDJobsBaseId));
    this.selectionsControl.markAsTouched();
  }

  rowClass(context: RowClassArgs): string {
     return context.dataItem.InExchange ? 'row-disabled' : '';
  }

  // Lifecycle
  ngOnInit() {
    this.addJobsModalOpenSubscription = this.addJobsModalOpen$.subscribe(isOpen => {
      if (isOpen) {
        this.loadAvailableJobs();
      }
    });
    this.addJobsErrorSubscription = this.addingJobsError$.subscribe(error => {
      if (error) {
        this.selectionsControl.setErrors({'error': 'There was an error adding the selected jobs.'});
      }
    });
    this.selectionsSubscription = this.selections$.subscribe(selections => {
      this.selections = selections;
    });
  }

  ngOnDestroy() {
    this.addJobsModalOpenSubscription.unsubscribe();
    this.addJobsErrorSubscription.unsubscribe();
    this.selectionsSubscription.unsubscribe();
  }

  // Helper methods
  loadAvailableJobs(): void {
    this.gridState$.take(1).subscribe(gridState => {
      this.store.dispatch(new fromAvailableJobsActions.LoadingAvailableJobs(
        {
          exchangeId: this.exchangeId,
          listState: gridState
        }
      ));
    });
  }
}
