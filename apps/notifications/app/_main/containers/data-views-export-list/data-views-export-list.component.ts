import { Component, OnInit } from '@angular/core';

import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { AsyncStateObj } from 'libs/models/state';
import { DataViewExportListItem } from '../../models';

import * as fromDataViewsExportReducer from '../../reducers';
import * as fromDataViewsExportActions from '../../actions/data-views-export.action';

@Component({
  selector: 'pf-data-insights-export',
  templateUrl: './data-views-export-list.component.html',
  styleUrls: ['./data-views-export-list.component.scss']
})
export class DataViewsExportListComponent implements OnInit {
  dataViewsExportRecords$: Observable<AsyncStateObj<DataViewExportListItem[]>>;

  constructor(
    private store: Store<fromDataViewsExportReducer.State>
  ) {
    this.dataViewsExportRecords$ = this.store.pipe(select(fromDataViewsExportReducer.getDataViewsExportList));
  }

  ngOnInit() {
    this.store.dispatch(new fromDataViewsExportActions.GetDataViewsExportsListItems());
  }

}
