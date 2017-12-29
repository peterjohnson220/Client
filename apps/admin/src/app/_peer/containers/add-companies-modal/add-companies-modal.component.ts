import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import {
  GridDataResult, PageChangeEvent, RowArgs, RowClassArgs
} from '@progress/kendo-angular-grid';
import { SortDescriptor, State } from '@progress/kendo-data-query';

import { AddExchangeCompaniesRequest } from 'libs/models/peer/index';
import { GridFilterService } from 'libs/shared/grid';
import { PfValidators } from 'libs/forms/validators';
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
  gridState: State = { skip: 0, take: 5 };
  attemptedSubmit = false;
  selections: number[] = [];
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

    this.exchangeId = this.route.snapshot.params.id;
    this.createForm();
  }

  get primaryButtonText(): string {
    const numberOfSelections = this.selections ? this.selections.length : 0;
    return `Add (${numberOfSelections})`;
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
    this.store.dispatch(new fromExchangeCompaniesActions.CloseAddExchangeCompaniesModal);
    this.selections = [];
  }

  // Grid
  selectionKey(context: RowArgs): number {
    return context.dataItem.CompanyId;
  }

  updateSearchFilter(newSearchTerm: string) {
    this.gridState.skip = 0;
    GridFilterService.updateFilter('CompanyName', newSearchTerm, this.gridState);
    this.loadAvailableCompanies();
  }

  handleAvailableCompaniesGridReload() {
    this.loadAvailableCompanies();
  }

  pageChange(event: PageChangeEvent): void {
    this.gridState.skip = event.skip;
    this.loadAvailableCompanies();
  }

  handleSortChanged(sort: SortDescriptor[]) {
    this.gridState.skip = 0;
    this.gridState.sort = sort;
    this.loadAvailableCompanies();
  }

  cellClick(event: any): void {
    if (event.dataItem.InExchange) {
      return;
    }
    const selectedCompanyId = event.dataItem.CompanyId;
    const companySelected = this.selections.indexOf(selectedCompanyId) >= 0;
    if (companySelected) {
      this.selections = this.selections.filter(selection => selection !== selectedCompanyId);
    } else {
      this.selections.push(selectedCompanyId);
    }
    this.selectionsControl.markAsTouched();
    this.selectionsControl.setValue(this.selections || []);
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
  }

  ngOnDestroy() {
    this.addCompaniesModalOpenSubscription.unsubscribe();
    this.addCompaniesErrorSubscription.unsubscribe();
  }

  // Private Methods
  private loadAvailableCompanies(): void {
    this.store.dispatch(new fromAvailableCompaniesActions.LoadingAvailableCompanies(
      {
        exchangeId: this.exchangeId,
        listState: JSON.stringify(this.gridState)
      }
    ));
  }
}
