import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { GridDataResult, PageChangeEvent, RowArgs, RowClassArgs } from '@progress/kendo-angular-grid';
import { SortDescriptor, State } from '@progress/kendo-data-query';

import { KendoGridFilterHelper } from 'libs/common/core/helpers';
import { InputDebounceComponent } from 'libs/forms/components';
import { AddExchangeJobsRequest } from 'libs/models/peer/index';
import { PfValidators } from 'libs/forms/validators';

import * as fromAvailableJobsActions from '../../actions/available-jobs.actions';
// TODO: import * as fromExchangeJobsActions from '../../actions/exchange-jobs.actions';
import * as fromPeerAdminReducer from '../../reducers';

@Component({
  selector: 'pf-add-jobs-modal',
  templateUrl: './add-jobs-modal.component.html',
  styleUrls: ['./add-jobs-modal.component.scss']
})
export class AddJobsModalComponent implements OnInit, OnDestroy {
  @ViewChild(InputDebounceComponent) debouncedSearchTerm: InputDebounceComponent;
  availableJobsLoading$: Observable<boolean>;
  availableJobsLoadingError$: Observable<boolean>;
  addJobsModalOpen$: Observable<boolean>;
  addingJobs$: Observable<boolean>;
  addingJobsError$: Observable<boolean>;
  view$: Observable<GridDataResult>;
  addJobsModalOpenSubscription: Subscription;
  addJobsErrorSubscription: Subscription;
  addJobsForm: FormGroup;
  gridState: State = { skip: 0, take: 10 };
  attemptedSubmit = false;
  selections: number[] = [];
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

    this.exchangeId = this.route.snapshot.params.id;
    this.createForm();
  }

  get primaryButtonText(): string {
    const numberOfSelections = this.selections ? this.selections.length : 0;
    return `Add (${numberOfSelections})`;
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
    // TODO: USE fromExchangeJobsActions when available
    this.store.dispatch(new fromAvailableJobsActions.AddingExchangeJobs(addJobsRequest));
  }

  handleModalDismissed(): void {
    this.attemptedSubmit = false;
    // TODO: USE fromExchangeJobsActions when available
    this.store.dispatch(new fromAvailableJobsActions.CloseAddExchangeJobsModal);
    this.selections = [];
    // we have to do this because for some reason setting searchTerm to empty doesn't propagate to the input.
    this.debouncedSearchTerm.setSilently('');
    KendoGridFilterHelper.clearFilters(this.gridState);
    this.gridState.skip = 0;
    this.gridState.sort = [];
  }

  // Grid
  selectionKey(context: RowArgs): number {
    return context.dataItem.MDJobsBaseId;
  }

  updateSearchFilter(newSearchTerm: string) {
    this.gridState.skip = 0;
    KendoGridFilterHelper.updateFilter('JobTitle', newSearchTerm, this.gridState);
    this.loadAvailableJobs();
  }

  pageChange(event: PageChangeEvent): void {
    this.gridState.skip = event.skip;
    this.loadAvailableJobs();
  }

  handleSortChanged(sort: SortDescriptor[]) {
    this.gridState.skip = 0;
    this.gridState.sort = sort;
    this.loadAvailableJobs();
  }

  cellClick(event: any): void {
    if (event.dataItem.InExchange) {
      return;
    }
    const selectedMDJobsBaseId = event.dataItem.MDJobsBaseId;
    const availableJobSelected = this.selections.indexOf(selectedMDJobsBaseId) >= 0;
    if (availableJobSelected) {
      this.selections = this.selections.filter(selection => selection !== selectedMDJobsBaseId);
    } else {
      this.selections.push(selectedMDJobsBaseId);
    }
    this.selectionsControl.markAsTouched();
    this.selectionsControl.setValue(this.selections || []);
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
  }

  ngOnDestroy() {
    this.addJobsModalOpenSubscription.unsubscribe();
    this.addJobsErrorSubscription.unsubscribe();
  }

  // Helper methods
  loadAvailableJobs(): void {
    this.store.dispatch(new fromAvailableJobsActions.LoadingAvailableJobs(
      {
        exchangeId: this.exchangeId,
        listState: JSON.stringify(this.gridState)
      }
    ));
  }
}
