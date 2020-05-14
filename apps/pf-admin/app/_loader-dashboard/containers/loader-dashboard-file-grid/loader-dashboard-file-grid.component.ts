import {Component, OnDestroy, OnInit} from '@angular/core';
import {Store} from '@ngrx/store';
import {GridDataResult, RowClassArgs} from '@progress/kendo-angular-grid';
import {orderBy, SortDescriptor} from '@progress/kendo-data-query';

import {Observable, Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

import {AsyncStateObj} from 'libs/models/state';
import {CompanyFilePackagesResponse} from 'libs/models/admin/loader-dashboard/response';

import * as fromLoaderDashboardPageReducer from '../../reducers';

@Component({
  selector: 'pf-loader-dashboard-file-grid',
  templateUrl: './loader-dashboard-file-grid.component.html',
  styleUrls: ['./loader-dashboard-file-grid.component.scss']
})
export class LoaderDashboardFileGridComponent implements OnInit, OnDestroy {
  static WAIT_THRESHOLD_MINUTES = 15;
  fileDataObj$: Observable<AsyncStateObj<CompanyFilePackagesResponse[]>>;
  private unsubscribe$ = new Subject<boolean>();

  gridView: GridDataResult;
  gridData: CompanyFilePackagesResponse[] = [];
  sort: SortDescriptor[] = [{
    field: 'companyFilePackage_ID',
    dir: 'desc'
  }];
  constructor(private store: Store<fromLoaderDashboardPageReducer.State>) { }

  ngOnInit() {
    this.fileDataObj$ = this.store.select(fromLoaderDashboardPageReducer.getFilePackagesObj);
    this.fileDataObj$.pipe(takeUntil(this.unsubscribe$)).subscribe(v => {
      if (v && !v.loading) {
        this.gridData = v.obj;
        this.applySort();
        this.refreshGridDataResult();
      }
    });
  }

  ngOnDestroy() {
    this.unsubscribe$.next(true);
    this.unsubscribe$.unsubscribe();
  }

  rowCallback(context: RowClassArgs): string {
    const di = context.dataItem;
    if (!di.lastModifiedDate ||
      Math.round( (((new Date()).getTime()) - new Date(di.lastModifiedDate).getTime()) / 60000) >= LoaderDashboardFileGridComponent.WAIT_THRESHOLD_MINUTES) {
      return 'stuck-load';
    }
    return '';
  }

  sortChange($event: SortDescriptor[]) {
    this.sort = $event;
    this.applySort();
    this.refreshGridDataResult();
  }

  applySort() {
    this.gridData = orderBy(this.gridData, this.sort);
  }

  private refreshGridDataResult() {
    this.gridView = {
      data: this.gridData,
      total: this.gridData.length
    };
  }

  showIfFilePackageHasFiles(dataItem: CompanyFilePackagesResponse, index: number): boolean {
    return dataItem && dataItem.files && dataItem.files.length > 0;
  }
}
