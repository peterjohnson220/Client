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
  favoriteViews$: Observable<View[]>;
  dashboardViewSetting$: Observable<string>;
  dashboardView$: Observable<DashboardView>;

  companyWorkbooksAsyncSub: Subscription;
  favoriteViewsSub: Subscription;
  dashboardViewSettingSubscription: Subscription;

  companyWorkbooksAsync: AsyncStateObj<Workbook[]>;
  favoriteViews: View[];
  dashboardViews: string[] = ['All Views', 'Favorites'];

  constructor(
    private store: Store<fromDataInsightsMainReducer.State>,
    private settingsService: SettingsService
  ) {
    this.companyWorkbooksAsync$ = this.store.pipe(select(fromDataInsightsMainReducer.getCompanyWorkbooksAsyncFromViews));
    this.favoriteViews$ = this.store.pipe(select(fromDataInsightsMainReducer.getFavoriteViews));
    this.dashboardView$ = this.store.pipe(select(fromDataInsightsMainReducer.getDashboardViewThumbnailEnabled));
    this.dashboardViewSetting$ = this.settingsService.selectUiPersistenceSetting<string>(
      FeatureAreaConstants.DataInsights, UiPersistenceSettingConstants.DashboardViewThumbnailEnabled, 'string'
    );
  }

  ngOnInit(): void {
    this.companyWorkbooksAsyncSub = this.companyWorkbooksAsync$.subscribe(asyncObj => this.companyWorkbooksAsync = asyncObj);
    this.favoriteViewsSub = this.favoriteViews$.subscribe(cw => this.favoriteViews = cw);
    this.dashboardViewSettingSubscription = this.dashboardViewSetting$.subscribe(value => this.handleDashboardViewSettingChanged(value));
  }

  ngOnDestroy(): void {
    this.companyWorkbooksAsyncSub.unsubscribe();
    this.favoriteViewsSub.unsubscribe();
    this.dashboardViewSettingSubscription.unsubscribe();
  }

  get anyFavorites() {
    return !!this.companyWorkbooksAsync &&
    !!this.companyWorkbooksAsync.obj &&
    this.companyWorkbooksAsync.obj.some(w => w.Views.obj.some(v => v.IsFavorite === true));
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

  handleViewsOrderUpdated(saveReportOrderData: SaveReportOrderData): void {
    if (!saveReportOrderData || !saveReportOrderData.ViewIds) {
      return;
    }
    this.store.dispatch(new fromViewsActions.SaveReportOrder(saveReportOrderData));
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

}
