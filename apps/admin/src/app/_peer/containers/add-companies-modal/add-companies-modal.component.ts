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
import { State } from '@progress/kendo-data-query';

@Component({
  selector: 'pf-add-companies-modal',
  templateUrl: './add-companies-modal.component.html',
  styleUrls: ['./add-companies-modal.component.scss']
})
export class AddCompaniesModalComponent implements OnInit {
  availableCompaniesLoading$: Observable<boolean>;
  availableCompaniesLoadingError$: Observable<boolean>;
  availableCompanies$: Observable<AvailableCompany[]>;
  gridState: State = { skip: 0, take: 20 };
  view$: Observable<GridDataResult>;
  exchangeId: number;
  selections: number[] = [];
  savedSearchTerm: string;

  constructor(
    private store: Store<fromPeerAdminReducer.State>,
    private route: ActivatedRoute
  ) {
    this.availableCompaniesLoading$ = this.store.select(fromPeerAdminReducer.getAvailableCompaniesLoading);
    this.availableCompaniesLoadingError$ = this.store.select(fromPeerAdminReducer.getAvailableCompaniesLoadingError);
    this.availableCompanies$ = this.store.select(fromPeerAdminReducer.getAvailableCompanies);
    this.view$ = this.store.select(fromPeerAdminReducer.getAvailableCompaniesGrid);

    this.exchangeId = this.route.snapshot.params.id;
  }

  selectionKey(context: RowArgs): number {
    return context.dataItem.CompanyId;
  }

  // Events

  updateSearchFilter(newSearchTerm: string){
    // this.listFilter = newSearchTerm;
    console.log('newSearchTerm: ',newSearchTerm);
    this.gridState.skip = 0;
    // this.jobDescriptionService.updateJobDescriptionGridSearchTerm(newSearchTerm);
    // this.jobDescriptionService.getCompanyJobViewList(this.listFilter, this.gridState);
  }

  handleAvailableCompaniesGridReload() {
    this.store.dispatch(new fromAvailableCompaniesActions.LoadingAvailableCompanies(this.exchangeId));
  }

  pageChange(event: PageChangeEvent): void {
    this.gridState.skip = event.skip;
    // this.loadItems();
    console.log('pageChangeEvent: ', event);
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
    if (event.dataItem.CompanyId % 3 === 0) {
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
    console.log('selections after cell click: ', this.selections);
  }

  isRowSelected(event: any): void {
    /*console.log('rowSelectedEvent: ', event);
    return this.selections && this.selections.indexOf(event.dataItem.CompanyId) >= 0;*/
  }

  rowClass(context: RowClassArgs): string {
     // console.log('rowClass: ', context);
     if (context.dataItem.CompanyId % 3 === 0) {
       // return 'k-grid-ignore-click disabled';
       return 'row-disabled';
     }

     return '';
  }

  private loadItems(): void {
    /*    this.gridView = {
          data: this.items.slice(this.skip, this.skip + this.pageSize),
          total: this.items.length
        };*/
  }
  // Lifecycle
  ngOnInit() {
    this.store.dispatch(new fromAvailableCompaniesActions.LoadingAvailableCompanies(this.exchangeId));
  }

}
