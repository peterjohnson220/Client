import { Component, OnDestroy, OnInit } from '@angular/core';

import { Observable, Subscription } from 'rxjs';
import { SortDescriptor } from '@progress/kendo-data-query';

import { BasicDataViewField } from 'libs/models/payfactors-api/reports/request';
import { getDefaultActionBarConfig, GridConfig, PfDataGridFilter } from 'libs/features/grids/pf-data-grid/models';
import { AsyncStateObj } from 'libs/models/state';

import { PageViewIds } from '../../constants/page-view-id-constants';

@Component({
  selector: 'pf-peer-trend-grid',
  templateUrl: './peer-trend-grid.component.html'
})
export class PeerTrendGridComponent implements OnInit, OnDestroy {

  data$: Observable<AsyncStateObj<any[]>>;
  fields$: Observable<BasicDataViewField[]>;
  loadingMoreData$: Observable<boolean>;
  hasMoreDataOnServer$: Observable<boolean>;

  hasMoreDataOnServerSubscription: Subscription;
  hasMoreDataOnServer: boolean;
  gridConfig: GridConfig;
  pageViewId = PageViewIds.Trends;
  actionBarConfig: any;

  defaultSort: SortDescriptor[] = [{
    dir: 'desc',
    field: 'PeerTrends_Create_Date'
  }];
  filters: PfDataGridFilter[] = [{
    SourceName: 'StatusLookup_ID',
    Operator: '=',
    Values: ['1']
  }];

  constructor(

  ) {

    this.gridConfig = {
      PersistColumnWidth: true,
      EnableInfiniteScroll: true,
      ScrollToTop: true
    };

    this.actionBarConfig = {
      ...getDefaultActionBarConfig(),
      ShowColumnChooser: true,
      ColumnChooserSubmitText: 'Refresh',
      ShowSelectAllColumns: true,
      ShowActionBar: true
    };
  }

  ngOnInit(): void {
    this.hasMoreDataOnServerSubscription = this.hasMoreDataOnServer$.subscribe(value => this.hasMoreDataOnServer = value);
  }

  ngOnDestroy(): void {
    this.hasMoreDataOnServerSubscription.unsubscribe();
  }
}
