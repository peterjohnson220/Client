import { Component, OnInit, OnDestroy } from '@angular/core';

import { Store, select } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import { AsyncStateObj } from 'libs/models/state';
import { SettingsService } from 'libs/state/app-context/services';
import { FeatureAreaConstants, UiPersistenceSettingConstants } from 'libs/models/common';

import * as fromViewsActions from '../../actions/views.actions';
import * as fromDataInsightsMainReducer from '../../reducers';
import { Workbook, SaveReportOrderData, View, DashboardView } from '../../models';
import { DashboardsHeaderHelper } from '../../helpers';

@Component({
  selector: 'pf-views',
  templateUrl: './views.component.html',
  styleUrls: ['./views.component.scss']
})
export class ViewsComponent implements OnInit, OnDestroy {
  companyWorkbooksAsync$: Observable<AsyncStateObj<Workbook[]>>;
  tableauReports$: Observable<Workbook[]>;
  dataViewReports$: Observable<Workbook[]>;
  favoriteTableauViews$: Observable<View[]>;
  favoriteDataViewReports$: Observable<Workbook[]>;
  dashboardViewSetting$: Observable<string>;
  dashboardView$: Observable<DashboardView>;

  companyWorkbooksAsyncSub: Subscription;
  tableauReportSub: Subscription;
  dataViewReportsSub: Subscription;
  favoriteTableauViewsSub: Subscription;
  favoriteDataViewReportsSub: Subscription;
  dashboardViewSettingSubscription: Subscription;
  dashboardViewSubscription: Subscription;

  companyWorkbooksAsync: AsyncStateObj<Workbook[]>;
  tableauReports: Workbook[];
  dataViewReports: Workbook[];
  favoriteTableauViews: View[];
  favoriteDataViewReports: Workbook[];
  dashboardViews: string[] = ['All Views', 'Favorites'];
  selectedDashboardView: DashboardView;

  constructor(
    private store: Store<fromDataInsightsMainReducer.State>,
    private settingsService: SettingsService
  ) {
    this.companyWorkbooksAsync$ = this.store.pipe(select(fromDataInsightsMainReducer.getCompanyWorkbooksAsyncFromViews));
    this.tableauReports$ = this.store.pipe(select(fromDataInsightsMainReducer.getTableauReportsFromViews));
    this.dataViewReports$ = this.store.pipe(select(fromDataInsightsMainReducer.getDataViewReportsFromViews));
    this.favoriteTableauViews$ = this.store.pipe(select(fromDataInsightsMainReducer.getFavoriteViews));
    this.favoriteDataViewReports$ = this.store.pipe(select(fromDataInsightsMainReducer.getFavoriteDataViewReports));
    this.dashboardView$ = this.store.pipe(select(fromDataInsightsMainReducer.getDashboardViewThumbnailEnabled));
    this.dashboardViewSetting$ = this.settingsService.selectUiPersistenceSetting<string>(
      FeatureAreaConstants.DataInsights, UiPersistenceSettingConstants.DashboardViewThumbnailEnabled, 'string'
    );
  }

  ngOnInit(): void {
    this.companyWorkbooksAsyncSub = this.companyWorkbooksAsync$.subscribe(asyncObj => this.companyWorkbooksAsync = asyncObj);
    this.favoriteTableauViewsSub = this.favoriteTableauViews$.subscribe(cw => this.handleFavoriteViewsChanged(cw));
    this.favoriteDataViewReportsSub = this.favoriteDataViewReports$.subscribe(wb => this.favoriteDataViewReports = wb);
    this.dashboardViewSettingSubscription = this.dashboardViewSetting$.subscribe(value => this.handleDashboardViewSettingChanged(value));
    this.tableauReportSub = this.tableauReports$.subscribe(wb => this.tableauReports = wb);
    this.dataViewReportsSub = this.dataViewReports$.subscribe(wb => this.dataViewReports = wb);
    this.dashboardViewSubscription = this.dashboardView$.subscribe(value => this.selectedDashboardView = value);
  }

  ngOnDestroy(): void {
    this.companyWorkbooksAsyncSub.unsubscribe();
    this.tableauReportSub.unsubscribe();
    this.dataViewReportsSub.unsubscribe();
    this.favoriteDataViewReportsSub.unsubscribe();
    this.favoriteTableauViewsSub.unsubscribe();
    this.dashboardViewSettingSubscription.unsubscribe();
    this.dashboardViewSubscription.unsubscribe();
  }

  get anyFavorites() {
    return !!this.companyWorkbooksAsync &&
    !!this.companyWorkbooksAsync.obj &&
    (this.tableauReports.some(w => w.Views.obj.some(v => v.IsFavorite === true)) ||
    this.dataViewReports.some(w => w.IsFavorite === true));
  }

  trackByFn(index: any, workbook: Workbook) {
    return workbook.WorkbookId;
  }

  handleFavoriteClicked(obj: any) {
    if (!obj || !obj.workbookId || !obj.view) {
      return;
    }
    if (obj.view.IsFavorite) {
      this.store.dispatch(new fromViewsActions.RemoveViewFavorite({
        workbookId: (obj.workbookId ? obj.workbookId : obj.view.WorkbookId), viewId: obj.view.ViewId
      }));
    } else {
      this.store.dispatch(new fromViewsActions.AddViewFavorite({ workbookId: obj.workbookId, viewId: obj.view.ViewId }));
    }
  }

  handleDataViewReportFavoriteClicked(obj: Workbook) {
    if (!obj || !obj.WorkbookId) {
      return;
    }
    if (obj.IsFavorite) {
      this.store.dispatch(new fromViewsActions.RemoveDataViewReportFavorite({workbookId: obj.WorkbookId}));
    } else {
      this.store.dispatch(new fromViewsActions.AddDataViewReportFavorite({workbookId: obj.WorkbookId}));
    }
  }

  handleViewsOrderUpdated(saveReportOrderData: SaveReportOrderData): void {
    if (!saveReportOrderData || !saveReportOrderData.ViewIds) {
      return;
    }
    this.store.dispatch(new fromViewsActions.SaveReportOrder(saveReportOrderData));
  }

  handleDataViewReportsOrderUpdated(obj: string[]): void {
    if (!obj) { return; }
    this.store.dispatch(new fromViewsActions.SaveDataViewReportsOrder({workbookIds: obj}));
  }

  handleSelectedDashboardViewChanged(view: DashboardView): void {
    this.store.dispatch(new fromViewsActions.ToggleDashboardView({ view }));
  }

  handleDashboardViewSettingChanged(value: string): void {
    if (!!value && !!value.length) {
      const dashboardView: DashboardView = DashboardsHeaderHelper.getDashboardViewByValue(value) || DashboardView.Views;
      this.store.dispatch(new fromViewsActions.SetDashboardView(dashboardView));
    }
  }

  handleFavoriteViewsChanged(views: View[]): void {
    this.favoriteTableauViews = views;
    if ((this.favoriteDataViewReports && !this.favoriteTableauViews.length) && this.selectedDashboardView === DashboardView.Favorites) {
      this.store.dispatch(new fromViewsActions.SetDashboardView(DashboardView.Views));
    }
  }

}
