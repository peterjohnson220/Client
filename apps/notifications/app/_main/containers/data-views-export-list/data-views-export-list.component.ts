import { Component, OnInit } from '@angular/core';

import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { AsyncStateObj } from 'libs/models/state';
import { DataViewExport } from '../../models';

import * as fromNotificationsMainReducer from '../../reducers';
import * as fromDataViewsExportActions from '../../actions/data-views-export.action';

@Component({
  selector: 'pf-data-insights-export',
  templateUrl: './data-views-export-list.component.html',
  styleUrls: ['./data-views-export-list.component.scss']
})
export class DataViewsExportListComponent implements OnInit {
  dataViewsExports$: Observable<AsyncStateObj<DataViewExport[]>>;

  showAll: boolean;
  displayLimit = 8;

  constructor(
    private store: Store<fromNotificationsMainReducer.State>
  ) {
    this.dataViewsExports$ = this.store.pipe(select(fromNotificationsMainReducer.getDataViewExports));
  }

  ngOnInit() {
    this.store.dispatch(new fromDataViewsExportActions.GetDataViewExports());
  }

  toggleShowAll() {
    this.showAll = !this.showAll;
  }

  getIconName(fileName: string): string {
    const extension = fileName.split('.');
    if (extension[extension.length - 1] === 'pdf') {
      return 'file-pdf';
    } else if (extension[extension.length - 1] === 'docx') {
      return 'file-word';
    } else {
      return 'file-excel';
    }
  }

}
