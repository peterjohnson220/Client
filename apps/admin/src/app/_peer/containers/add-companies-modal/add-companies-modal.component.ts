import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import {
  GridDataResult, PageChangeEvent, RowArgs, RowClassArgs,
  SelectionEvent
} from '@progress/kendo-angular-grid';

import { AvailableCompany } from 'libs/models/peer/index';
import * as fromAvailableCompaniesActions from '../../actions/available-companies.actions';
import * as fromPeerAdminReducer from '../../reducers';
import { FilterDescriptor, SortDescriptor, State } from '@progress/kendo-data-query';
import { CompositeFilterDescriptor } from '@progress/kendo-data-query/dist/es/filtering/filter-descriptor.interface';
import { GridFilterService } from 'libs/shared/grid';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AddExchangeCompaniesRequest, UpsertExchangeRequest } from 'libs/models/peer';
import * as fromExchangeListActions from '../../../../../../../libs/shared/peer/actions/exchange-list.actions';
import { PfValidators } from '../../../../../../../libs/forms/validators/pf-validators';
import * as fromExchangeCompaniesActions from '../../actions/exchange-companies.actions';

@Component({
  selector: 'pf-add-companies-modal',
  templateUrl: './add-companies-modal.component.html',
  styleUrls: ['./add-companies-modal.component.scss']
})
export class AddCompaniesModalComponent implements OnInit {
  availableCompaniesLoading$: Observable<boolean>;
  availableCompaniesLoadingError$: Observable<boolean>;
  availableCompanies$: Observable<AvailableCompany[]>;
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
    this.availableCompanies$ = this.store.select(fromPeerAdminReducer.getAvailableCompanies);
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
  selectionKey(context: RowArgs): number {
    return context.dataItem.CompanyId;
  }

  // Events
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
    console.log('pageChangeEvent: ', event);
  }

  handleSortChanged(sort: SortDescriptor[]) {
    this.gridState.sort = sort;
    console.log('onSortChange: ', sort);
    this.loadAvailableCompanies();
  }

  selectionChange(event: SelectionEvent): void {
    console.log('selectionChangeEvent: ', event);
    const test = x => x.index;
    // const isDeselection = event.deselectedRows.find((x: RowArgs) => x.index === event.index) > 0;
    // this.selections = event.selectedRows.map(row => row.dataItem.CompanyId);
  }
  onSelectedKeysChange(event: any): void {
    console.log('onSelectedKeysChange: ', event);
  }
  cellClick(event: any): void {
    console.log('Cell Click: ', event);
    if (event.dataItem.InExchange) {
      return;
    }
    const selectedCompanyId = event.dataItem.CompanyId;
    const companySelected = this.selections.indexOf(selectedCompanyId) >= 0;
    console.log('selections before cell click: ', this.selections);
    if (companySelected) {
      this.selections = this.selections.filter(selection => selection !== selectedCompanyId);
    } else {
      this.selections.push(selectedCompanyId);
    }
    const hasSelections = this.selections && this.selections.length > 0;
    // TODO: Is there a function that does both?
    this.hasSelections.markAsTouched();
    this.hasSelections.setValue(hasSelections);
    console.log('selections after cell click: ', this.selections);
  }

  isRowSelected(event: any): void {
    /*console.log('rowSelectedEvent: ', event);
    return this.selections && this.selections.indexOf(event.dataItem.CompanyId) >= 0;*/
  }

  rowClass(context: RowClassArgs): string {
     // console.log('rowClass: ', context);
     if (context.dataItem.InExchange) {
       // return 'k-grid-ignore-click disabled';
       return 'row-disabled';
     }

     return '';
  }

  // Lifecycle
  ngOnInit() {
    this.addCompaniesModalOpen$.subscribe(isOpen => {
      if (isOpen) {
        this.loadAvailableCompanies();
      }
    });
  }

  private loadAvailableCompanies(): void {
    this.store.dispatch(new fromAvailableCompaniesActions.LoadingAvailableCompanies(
      {
        exchangeId: this.exchangeId,
        listState: JSON.stringify(this.gridState)
      }
    ));
  }

}
