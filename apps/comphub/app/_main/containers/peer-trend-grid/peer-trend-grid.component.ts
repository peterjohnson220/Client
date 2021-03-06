import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';

import { Observable } from 'rxjs';
import { SortDescriptor } from '@progress/kendo-data-query';
import { Store } from '@ngrx/store';

import { BasicDataViewField } from 'libs/models/payfactors-api/reports/request';
import { SimpleYesNoModalComponent } from 'libs/ui/common/simple-yes-no';
import { SimpleYesNoModalOptions } from 'libs/models/common';
import {
  getDefaultActionBarConfig,
  getDefaultGridRowActionsConfig,
  GridConfig,
  GridRowActionsConfig,
  PositionType
} from 'libs/features/grids/pf-data-grid/models';

import { PageViewIds } from '../../constants/page-view-id-constants';
import * as fromPeerTrendsLandingCardReducer from '../../reducers/trends-landing-card.reducer';
import * as fromTrendsLandingActions from '../../actions/trends-landing-card.actions';

@Component({
  selector: 'pf-peer-trend-grid',
  templateUrl: './peer-trend-grid.component.html',
  styleUrls: ['./peer-trend-grid.component.scss']
})
export class PeerTrendGridComponent implements AfterViewInit {
  @ViewChild('gridRowActionsTemplate') gridRowActionsTemplate: ElementRef;
  @ViewChild('deleteTrendModal', {static: false}) public deleteTrendModal: SimpleYesNoModalComponent;

  fields$: Observable<BasicDataViewField[]>;
  loadingMoreData$: Observable<boolean>;

  gridConfig: GridConfig;
  pageViewId = PageViewIds.Trends;
  actionBarConfig: any;
  gridRowActionsConfig: GridRowActionsConfig = getDefaultGridRowActionsConfig();

  defaultSort: SortDescriptor[] = [{
    dir: 'desc',
    field: 'PeerTrends_Create_Date'
  }];
  deleteTrendModalOptions: SimpleYesNoModalOptions;

  constructor(private store: Store<fromPeerTrendsLandingCardReducer.State>) {
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

    this.deleteTrendModalOptions =
    {
      Title: 'Delete Trend',
      Body: '',
      CancelText: 'Cancel',
      ConfirmText: 'Delete',
      IsDelete: true
    };
  }

  ngAfterViewInit(): void {
    this.gridRowActionsConfig = {
      ...this.gridRowActionsConfig,
      ActionsTemplate : this.gridRowActionsTemplate,
      Title: '',
      Position: PositionType.Right,
      Width: 20
    };
  }

  onDeleteClick(dataRow) {
    this.deleteTrendModalOptions.Body = 'Are you sure you want to delete ' + dataRow['PeerTrends_Name'];
    this.deleteTrendModal.open(dataRow['PeerTrends_Name']);
  }

  onConfirmDeleteTrend(eventName: string) {
    this.store.dispatch(new fromTrendsLandingActions.DeleteSavedTrend(eventName));
  }
}
