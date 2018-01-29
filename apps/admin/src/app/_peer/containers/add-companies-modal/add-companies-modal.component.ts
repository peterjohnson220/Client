import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { GridDataResult, PageChangeEvent, RowArgs, RowClassArgs } from '@progress/kendo-angular-grid';
import { SortDescriptor, State } from '@progress/kendo-data-query';

import { InputDebounceComponent } from 'libs/forms/components';
import { AddExchangeCompaniesRequest } from 'libs/models/peer/index';
import { PfValidators } from 'libs/forms/validators';
import { GridTypeEnum } from 'libs/models/common';
import * as fromGridActions from 'libs/core/actions/grid.actions';

import * as fromAvailableCompaniesActions from '../../actions/available-companies.actions';
import * as fromExchangeCompaniesActions from '../../actions/exchange-companies.actions';
import * as fromPeerAdminReducer from '../../reducers';

@Component({
  selector: 'pf-add-companies-modal',
  templateUrl: './add-companies-modal.component.html',
  styleUrls: ['./add-companies-modal.component.scss']
})
export class AddCompaniesModalComponent implements OnInit, OnDestroy {
  availableCompaniesLoading$: Observable<boolean>;
  availableCompaniesLoadingError$: Observable<boolean>;
  addCompaniesModalOpen$: Observable<boolean>;
  addingCompanies$: Observable<boolean>;
  addingCompaniesError$: Observable<boolean>;
  view$: Observable<GridDataResult>;
  addCompaniesModalOpenSubscription: Subscription;
  addCompaniesErrorSubscription: Subscription;
  addCompaniesForm: FormGroup;
  gridState$: Observable<State>;
  attemptedSubmit = false;
  selections: number[] = [];
  selections$: Observable<number[]>;
  selectionsSubscription: Subscription;
  exchangeId: number;
  searchTerm: string;

  constructor(
    private store: Store<fromPeerAdminReducer.State>,
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) {
    this.availableCompaniesLoading$ = this.store.select(fromPeerAdminReducer.getAvailableCompaniesLoading);
    this.availableCompaniesLoadingError$ = this.store.select(fromPeerAdminReducer.getAvailableCompaniesLoadingError);
    this.view$ = this.store.select(fromPeerAdminReducer.getAvailableCompaniesGrid);
    this.addCompaniesModalOpen$ = this.store.select(fromPeerAdminReducer.getAddExchangeCompaniesModalOpen);
    this.addingCompanies$ = this.store.select(fromPeerAdminReducer.getExchangeCompaniesAdding);
    this.addingCompaniesError$ = this.store.select(fromPeerAdminReducer.getExchangeCompaniesAddingError);
    this.gridState$ = this.store.select(fromPeerAdminReducer.getAvailableCompaniesGridState);
    this.selections$ = this.store.select(fromPeerAdminReducer.getAvailableCompaniesGridSelections);
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
  get selectionsControl() { return this.addCompaniesForm.get('selections'); }

  createForm(): void {
    this.addCompaniesForm = this.fb.group({
      'selections': [[], [PfValidators.selectionRequired]]
    });
  }

  // Modal events
  handleFormSubmit(): void {
    this.attemptedSubmit = true;
    const addCompaniesRequest: AddExchangeCompaniesRequest = {
      ExchangeId: this.exchangeId,
      CompanyIds: this.selections
    };
    this.store.dispatch(new fromExchangeCompaniesActions.AddingExchangeCompanies(addCompaniesRequest));
  }

  handleModalDismissed(): void {
    this.attemptedSubmit = false;
    this.searchTerm = '';
    this.store.dispatch(new fromExchangeCompaniesActions.CloseAddExchangeCompaniesModal);
    this.store.dispatch(new fromGridActions.ResetGrid(GridTypeEnum.AvailableCompanies));
  }

  // Grid
  selectionKey(context: RowArgs): number {
    return context.dataItem.CompanyId;
  }

  updateSearchFilter(newSearchTerm: string) {
    this.store.dispatch(new fromGridActions.UpdateFilter(
      GridTypeEnum.AvailableCompanies,
      {columnName: 'CompanyName', value: newSearchTerm}
    ));
    this.loadAvailableCompanies();
  }

  handlePageChange(event: PageChangeEvent): void {
    this.store.dispatch(new fromGridActions.PageChange(GridTypeEnum.AvailableCompanies, event));
    this.loadAvailableCompanies();
  }

  handleSortChange(sort: SortDescriptor[]) {
    this.store.dispatch(new fromGridActions.SortChange(GridTypeEnum.AvailableCompanies, sort));
    this.loadAvailableCompanies();
  }

  handleCellClick(event: any): void {
    if (event.dataItem.InExchange) {
      return;
    }
    const selectedCompanyId = event.dataItem.CompanyId;
    this.store.dispatch(new fromGridActions.ToggleRowSelection(GridTypeEnum.AvailableCompanies, selectedCompanyId));
    this.selectionsControl.markAsTouched();
  }

  rowClass(context: RowClassArgs): string {
     return context.dataItem.InExchange ? 'row-disabled' : '';
  }

  // Lifecycle
  ngOnInit() {
    this.addCompaniesModalOpenSubscription = this.addCompaniesModalOpen$.subscribe(isOpen => {
      if (isOpen) {
        this.loadAvailableCompanies();
      }
    });
    this.addCompaniesErrorSubscription = this.addingCompaniesError$.subscribe(error => {
      if (error) {
        this.selectionsControl.setErrors({'error': 'There was an error adding the selected companies.'});
      }
    });
    this.selectionsSubscription = this.selections$.subscribe(selections => {
      this.selections = selections;
    });
  }

  ngOnDestroy() {
    this.addCompaniesModalOpenSubscription.unsubscribe();
    this.addCompaniesErrorSubscription.unsubscribe();
    this.selectionsSubscription.unsubscribe();
  }

  // Helper methods
  loadAvailableCompanies(): void {
    this.gridState$.take(1).subscribe(gridState => {
      this.store.dispatch(new fromAvailableCompaniesActions.LoadingAvailableCompanies(
        {
          exchangeId: this.exchangeId,
          listState: gridState
        }
      ));
    });
  }
}
