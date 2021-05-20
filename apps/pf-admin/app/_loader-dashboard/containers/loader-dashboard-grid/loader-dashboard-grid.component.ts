import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import { DataStateChangeEvent, FilterService, GridDataResult, RowClassArgs } from '@progress/kendo-angular-grid';
import { CompositeFilterDescriptor, FilterDescriptor, process, State } from '@progress/kendo-data-query';

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
  gridData: CompositeDataLoadViewResponse[] = [];
  pageSizes = [10, 20, 30];
  gridState: State = {
    skip: 0,
    take: 10,
    filter: {
      filters: [],
      logic: 'and'
    },
    sort: [{
      field: 'compositeDataLoadId',
      dir: 'desc'
    }]
  };

  selectedCompositeDataLoadId: number;
  selectedClientName: string;
  selectedClientId: number;
  compositeLoaderTypes: Array<string> = [
    'Organizational Data',
    'Pricings',
    'Surveys'
  ];
  compositeLoaderType = null;
  public checked = false;

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
        this.gridData = this.hasErrorCondition(v.obj);
        this.gridView = process(this.gridData, this.gridState);
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

  dataStateChange(state: DataStateChangeEvent) {
    this.gridState = state;
    this.gridView = process(this.gridData, this.gridState);
    this.clearLoadTypeFilter(this.gridState.filter);
  }

  downloadInvalidRecordsFile(externalId: string) {
    this.store.dispatch(new fromCompositeSummaryDownloadActions.CompositeSummaryDownload({ Id: externalId, FileType: FileType.InvalidRecordsFile }));
  }

  downloadExportedSourceFile(externalId: string) {
    this.store.dispatch(new fromCompositeSummaryDownloadActions.CompositeSummaryDownload({ Id: externalId, FileType: FileType.ExportedSourceFile }));
  }

  openRedropConfirmationModal(compositeDataLoadId: number, clientName: string, clientId: number): void {
    this.selectedCompositeDataLoadId = compositeDataLoadId;
    this.selectedClientName = clientName;
    this.selectedClientId = clientId;
    this.store.dispatch(new fromLoaderDashboardPageActions.OpenRedropConfirmationModal());
  }

  handleRedropConfirmationResponse(confirmed: boolean): void {
    if (confirmed) {
      this.store.dispatch(new fromLoaderDashboardPageActions.RedropExportedSourceFile(this.selectedCompositeDataLoadId));
    }
  }

  showIfLoadHasSummaries(dataItem: CompositeDataLoadViewResponse, index: number): boolean {
    return dataItem && dataItem.entityLoadSummaries && dataItem.entityLoadSummaries.length > 0;
  }

  hasErrorCondition(data: CompositeDataLoadViewResponse[]): CompositeDataLoadViewResponse[] {
    return data.map( d => ({...d, hasErrorCondition: !!d.fixableDataConditionException || !!d.terminalException ||
       d.entityLoadSummaries.filter(v => v.invalidCount > 0).length > 0}));
  }

  setLoadTypeFilter(value: any, filterService: FilterService): void {
    filterService.filter({
      filters: [{ field: 'compositeLoaderType', operator: 'eq', value: value }],
      logic: 'or'
    });
  }

  clearLoadTypeFilter(gridFilter: CompositeFilterDescriptor): void {
    const compositeLoaderTypeFilter: any = gridFilter.filters.find( (f: FilterDescriptor) => f.field === 'compositeLoaderType');
    if (!compositeLoaderTypeFilter) {
      this.compositeLoaderType = null;
    } else if (compositeLoaderTypeFilter.value !== this.compositeLoaderType) {
      this.compositeLoaderType = compositeLoaderTypeFilter.value;
    }
  }
}
