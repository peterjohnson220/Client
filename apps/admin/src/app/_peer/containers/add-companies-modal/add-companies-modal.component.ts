import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import {
  GridDataResult, PageChangeEvent, RowArgs, RowClassArgs
} from '@progress/kendo-angular-grid';
import { SortDescriptor, State } from '@progress/kendo-data-query';

import { AddExchangeCompaniesRequest } from 'libs/models/peer/index';
import { GridFilterService } from 'libs/shared/grid';
import * as fromAvailableCompaniesActions from '../../actions/available-companies.actions';
import * as fromExchangeCompaniesActions from '../../actions/exchange-companies.actions';
import * as fromPeerAdminReducer from '../../reducers';

@Component({
  selector: 'pf-add-companies-modal',
  templateUrl: './add-companies-modal.component.html',
  styleUrls: ['./add-companies-modal.component.scss']
})
export class AddCompaniesModalComponent implements OnInit {
  availableCompaniesLoading$: Observable<boolean>;
  availableCompaniesLoadingError$: Observable<boolean>;
  addCompaniesModalOpen$: Observable<boolean>;
  addingCompanies$: Observable<boolean>;
  addingCompaniesError$: Observable<boolean>;
  gridState: State = { skip: 0, take: 5 };
  view$: Observable<GridDataResult>;
  exchangeId: number;
  selections: number[] = [];
  savedSearchTerm: string;
  attemptedSubmit = false;
  addCompaniesForm: FormGroup;

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
  get hasSelections() { return this.addCompaniesForm.get('hasSelections'); }

  createForm(): void {
    this.addCompaniesForm = this.fb.group({
      'hasSelections': [false, [Validators.requiredTrue]]
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
    // TODO: Clear out selections because we are using requiredTrue... Trying using array input or something
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
    // TODO: Is there a function that does both?
    this.hasSelections.markAsTouched();
    this.hasSelections.setValue(this.selections && this.selections.length > 0);
  }

  rowClass(context: RowClassArgs): string {
     return context.dataItem.InExchange ? 'row-disabled' : '';
  }

  // Lifecycle
  ngOnInit() {
    this.addCompaniesModalOpen$.subscribe(isOpen => {
      if (isOpen) {
        this.loadAvailableCompanies();
      }
    });
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
