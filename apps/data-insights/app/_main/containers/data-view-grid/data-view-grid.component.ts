import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Observable, Subscription } from 'rxjs';
import { Store, select } from '@ngrx/store';

import { AsyncStateObj } from 'libs/models/state';

import * as fromDataViewGridActions from '../../actions/data-view-grid.actions';
import * as fromDataInsightsMainReducer from '../../reducers';
import { Field } from '../../models';

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

  loadingMoreDataSub: Subscription;
  hasMoreDataOnServerSub: Subscription;

  loadingMoreData: boolean;
  hasMoreDataOnServer: boolean;

  constructor(
    private store: Store<fromDataInsightsMainReducer.State>
  ) {
    this.fields$ = this.store.pipe(select(fromDataInsightsMainReducer.getSelectedFields));
    this.dataAsync$ = this.store.pipe(select(fromDataInsightsMainReducer.getReportDataAsync));
    this.loadingMoreData$ = this.store.pipe(select(fromDataInsightsMainReducer.getLoadingMoreData));
    this.hasMoreDataOnServer$ = this.store.pipe(select(fromDataInsightsMainReducer.getHasMoreDataOnServer));
  }

  ngOnInit(): void {
    this.loadingMoreDataSub = this.loadingMoreData$.subscribe(loading => this.loadingMoreData = loading);
    this.hasMoreDataOnServerSub = this.hasMoreDataOnServer$.subscribe(result => this.hasMoreDataOnServer = result);
  }

  ngOnDestroy(): void {
    this.loadingMoreDataSub.unsubscribe();
    this.hasMoreDataOnServerSub.unsubscribe();
  }

  trackByFn(index: any, field: Field) {
    return field.DataElementId;
  }

  handleScrollBottom(): void {
    if (!this.loadingMoreData && this.hasMoreDataOnServer) {
      this.store.dispatch(new fromDataViewGridActions.GetMoreData());
    }
  }
}
