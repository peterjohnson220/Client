import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { GridDataResult, PageChangeEvent, RowArgs, RowClassArgs, SelectionEvent } from '@progress/kendo-angular-grid';

import { AvailableCompany } from 'libs/models/peer/index';
import * as fromAvailableCompaniesActions from '../../actions/available-companies.actions';
import * as fromPeerAdminReducer from '../../reducers';

@Component({
  selector: 'pf-add-companies-modal',
  templateUrl: './add-companies-modal.component.html',
  styleUrls: ['./add-companies-modal.component.scss']
})
export class AddCompaniesModalComponent implements OnInit {
  availableCompaniesLoading$: Observable<boolean>;
  availableCompaniesLoadingError$: Observable<boolean>;
  availableCompanies$: Observable<AvailableCompany[]>;
  view$: Observable<GridDataResult>;
  exchangeId: number;
  selections: number[] = [];
  selectionKey(context: RowArgs): number {
    return context.dataItem.CompanyId;
  }

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

  // Events
  handleAvailableCompaniesGridReload() {
    this.store.dispatch(new fromAvailableCompaniesActions.LoadingAvailableCompanies(this.exchangeId));
  }

  pageChange(event: PageChangeEvent): void {
    // this.skip = event.skip;
    // this.loadItems();
    console.log('pageChangeEvent: ', event);
  }

  selectionChange(event: SelectionEvent): void {
    console.log('selectionChangeEvent: ', event);
    // this.selections = event.selectedRows.map(row => row.dataItem.CompanyId);
  }

  isRowSelected(event: any): void {
    /*console.log('rowSelectedEvent: ', event);
    return this.selections && this.selections.indexOf(event.dataItem.CompanyId) >= 0;*/
  }

  rowClass(context: RowClassArgs): string {
     console.log('rowClass: ', context);
     if (context.dataItem.CompanyId % 2 === 0) {
       return 'k-grid-ignore-click';
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
