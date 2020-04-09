import {ChangeDetectionStrategy, Component, OnDestroy, OnInit} from '@angular/core';
import {Store} from '@ngrx/store';

import {GridDataResult, PageChangeEvent, RowClassArgs} from '@progress/kendo-angular-grid';
import {orderBy, SortDescriptor} from '@progress/kendo-data-query';

import {Observable, Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

import {AsyncStateObj} from 'libs/models/state';
import {CompositeDataLoadViewResponse} from 'libs/models/admin/loader-dashboard/response';

// TODO Separate this from the dashboard
import * as fromCompositeSummaryDownloadActions from '../../../../../dashboard/app/_main/actions/composite-summary-download.actions';

import * as fromLoaderDashboardPageReducer from '../../reducers';

@Component({
  selector: 'pf-loader-dashboard-grid',
  templateUrl: './loader-dashboard-grid.component.html',
  styleUrls: ['./loader-dashboard-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoaderDashboardGridComponent implements OnInit, OnDestroy {
  gridDataObj$: Observable<AsyncStateObj<CompositeDataLoadViewResponse[]>>;
  private unsubscribe$ = new Subject<boolean>();

  gridView: GridDataResult;
  sort: SortDescriptor[] = [{
    field: 'compositeDataLoadId',
    dir: 'desc'
  }];
  gridData: CompositeDataLoadViewResponse[] = [];
  skip = 0;
  pageSize = 10;
  pageSizes = [
    { text: '10', value: 10},
    { text: '20', value: 20},
    { text: '50', value: 50},
    { text: 'All', value: 'all'},
  ];

  constructor(private store: Store<fromLoaderDashboardPageReducer.State>) { }

  ngOnInit() {
    this.gridDataObj$ = this.store.select(fromLoaderDashboardPageReducer.getCompositeLoadsObj);
    this.gridDataObj$.pipe(takeUntil(this.unsubscribe$)).subscribe(v => {
      if (v && !v.loading) {
        this.gridData = v.obj;
        this.skip = 0;
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
    if (di.validationErrorOutputUri || di.fixableDataConditionException) {
      return 'failed-load';
    }
    return '';
  }

  pageChange($event: PageChangeEvent) {
    this.skip = $event.skip;
    this.pageSize = $event.take;
    this.refreshGridDataResult();
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
      data: this.gridData.slice(this.skip, this.skip + this.pageSize),
      total: this.gridData.length
    };
  }

  downloadFile(externalId: string) {
    this.store.dispatch(new fromCompositeSummaryDownloadActions.CompositeSummaryDownload({ Id: externalId }));
  }
}
