import { Component, OnDestroy, OnInit } from '@angular/core';

import { Observable, Subscription } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { SortDescriptor } from '@progress/kendo-data-query';

import { AsyncStateObj } from 'libs/models/state';

import * as fromDataViewGridActions from '../../actions/data-view-grid.actions';
import * as fromDataInsightsMainReducer from '../../reducers';
import { Field } from '../../models';
import { DataViewSortDescriptor } from 'libs/models/payfactors-api/reports/request';

@Component({
  selector: 'pf-data-view-grid',
  templateUrl: './data-view-grid.component.html',
  styleUrls: ['./data-view-grid.component.scss']
})
export class DataViewGridComponent implements OnInit, OnDestroy {
  fields$: Observable<Field[]>;
  dataAsync$: Observable<AsyncStateObj<any[]>>;
  loadingMoreData$: Observable<boolean>;
  hasMoreDataOnServer$: Observable<boolean>;
  dataViewSortDescriptor$: Observable<DataViewSortDescriptor>;

  loadingMoreDataSub: Subscription;
  hasMoreDataOnServerSub: Subscription;
  fieldsSub: Subscription;
  dataViewSortDescriptor: Subscription;

  loadingMoreData: boolean;
  hasMoreDataOnServer: boolean;
  fields: Field[];
  sortableConfig = {
    allowUnsort: false,
    mode: 'single'
  };
  sortDesc: SortDescriptor[];

  constructor(
    private store: Store<fromDataInsightsMainReducer.State>
  ) {
    this.fields$ = this.store.pipe(select(fromDataInsightsMainReducer.getSelectedFields));
    this.dataAsync$ = this.store.pipe(select(fromDataInsightsMainReducer.getReportDataAsync));
    this.loadingMoreData$ = this.store.pipe(select(fromDataInsightsMainReducer.getLoadingMoreData));
    this.hasMoreDataOnServer$ = this.store.pipe(select(fromDataInsightsMainReducer.getHasMoreDataOnServer));
    this.dataViewSortDescriptor$ = this.store.pipe(select(fromDataInsightsMainReducer.getSortDescriptor));
  }

  ngOnInit(): void {
    this.loadingMoreDataSub = this.loadingMoreData$.subscribe(loading => this.loadingMoreData = loading);
    this.hasMoreDataOnServerSub = this.hasMoreDataOnServer$.subscribe(result => this.hasMoreDataOnServer = result);
    this.fieldsSub = this.fields$.subscribe(results => this.fields = results);
    this.dataViewSortDescriptor = this.dataViewSortDescriptor$.subscribe(sort => this.handleResetSort(sort));
  }

  ngOnDestroy(): void {
    this.loadingMoreDataSub.unsubscribe();
    this.hasMoreDataOnServerSub.unsubscribe();
    this.fieldsSub.unsubscribe();
    this.dataViewSortDescriptor.unsubscribe();
  }

  trackByFn(index: any, field: Field) {
    return field.DataElementId;
  }

  handleScrollBottom(): void {
    if (!this.loadingMoreData && this.hasMoreDataOnServer) {
      this.store.dispatch(new fromDataViewGridActions.GetMoreData());
    }
  }

  handleSortChange(sortDesc: SortDescriptor[]): void {
    if (!sortDesc.length) {
      return;
    }
    this.sortDesc = sortDesc;
    const selectedField = this.fields.find(x => x.KendoGridField === sortDesc[0].field);
    if (!selectedField) {
      return;
    }
    this.store.dispatch(new fromDataViewGridActions.SortField({
      field: selectedField,
      dir: sortDesc[0].dir
    }));
  }

  handleResetSort(sort: DataViewSortDescriptor): void {
    if (!sort) {
      this.sortDesc = [];
    }
  }
}
