import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import { GridDataResult, PageChangeEvent, RowClassArgs } from '@progress/kendo-angular-grid';
import { orderBy, SortDescriptor } from '@progress/kendo-data-query';

import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { AsyncStateObj } from 'libs/models/state';
import { CompositeDataLoadViewResponse } from 'libs/models/admin/loader-dashboard/response';
import { AbstractFeatureFlagService, FeatureFlags, RealTimeFlag } from 'libs/core/services/feature-flags';

// TODO Separate this from the dashboard
import * as fromCompositeSummaryDownloadActions from '../../../../../dashboard/app/_main/actions/composite-summary-download.actions';
import * as fromLoaderDashboardPageActions from '../../actions/loader-dashboard-page.actions';
import * as fromLoaderDashboardPageReducer from '../../reducers';
import { FileType } from 'libs/models/dashboard';

@Component({
  selector: 'pf-loader-dashboard-grid',
  templateUrl: './loader-dashboard-grid.component.html',
  styleUrls: ['./loader-dashboard-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoaderDashboardGridComponent implements OnInit, OnDestroy {
  gridDataObj$: Observable<AsyncStateObj<CompositeDataLoadViewResponse[]>>;
  isRedropInProgress$: Observable<AsyncStateObj<boolean>>;
  private unsubscribe$ = new Subject<boolean>();
  private unsubscribeRedropsFlag$ = new Subject<void>();

  loaderDashboardRedropsFeatureFlag: RealTimeFlag = { key: FeatureFlags.LoaderDashboardRedrops, value: false };

  gridView: GridDataResult;
  sort: SortDescriptor[] = [{
    field: 'compositeDataLoadId',
    dir: 'desc'
  }];
  gridData: CompositeDataLoadViewResponse[] = [];
  skip = 0;
  pageSize = 10;
  pageSizes = [10, 20, 30];

  constructor(
    private store: Store<fromLoaderDashboardPageReducer.State>,
    private featureFlagService: AbstractFeatureFlagService
  ) {
    this.featureFlagService.bindEnabled(this.loaderDashboardRedropsFeatureFlag, this.unsubscribeRedropsFlag$);
  }

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
    this.isRedropInProgress$ = this.store.select(fromLoaderDashboardPageReducer.getRedropExportedSourceFile);
  }

  ngOnDestroy() {
    this.unsubscribe$.next(true);
    this.unsubscribe$.unsubscribe();
    this.unsubscribeRedropsFlag$.next();
  }

  rowCallback(context: RowClassArgs): string {
    const dataItem = context.dataItem as CompositeDataLoadViewResponse;
    if (!!dataItem.fixableDataConditionException || !!dataItem.terminalException || dataItem.entityLoadSummaries.filter(v => v.invalidCount).length > 0) {
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

  downloadInvalidRecordsFile(externalId: string) {
    this.store.dispatch(new fromCompositeSummaryDownloadActions.CompositeSummaryDownload({ Id: externalId, FileType: FileType.InvalidRecordsFile }));
  }

  downloadExportedSourceFile(externalId: string) {
    this.store.dispatch(new fromCompositeSummaryDownloadActions.CompositeSummaryDownload({ Id: externalId, FileType: FileType.ExportedSourceFile }));
  }

  redropExportedSourceFile(compositeDataLoadId: number) {
    this.store.dispatch(new fromLoaderDashboardPageActions.RedropExportedSourceFile(compositeDataLoadId));
  }

  showIfLoadHasSummaries(dataItem: CompositeDataLoadViewResponse, index: number): boolean {
    return dataItem && dataItem.entityLoadSummaries && dataItem.entityLoadSummaries.length > 0;
  }

  hasErrorCondition(dataItem: CompositeDataLoadViewResponse): boolean {
    return !!dataItem.fixableDataConditionException || !!dataItem.terminalException || dataItem.entityLoadSummaries.filter(v => v.invalidCount > 0).length > 0;
  }
}
