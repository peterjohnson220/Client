import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';

import { of } from 'rxjs';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, switchMap, withLatestFrom } from 'rxjs/operators';

import { TableauReportApiService, UserReportApiService } from 'libs/data/payfactors-api';
import { UserContext } from 'libs/models/security';
import { WorkbookOrderType } from 'libs/constants';
import * as fromRootState from 'libs/state/state';
import { SaveReportOrderRequest } from 'libs/models/payfactors-api';
import * as fromUiPersistenceSettingsActions from 'libs/state/app-context/actions/ui-persistence-settings.actions';
import { FeatureAreaConstants, UiPersistenceSettingConstants } from 'libs/models/common';

import * as fromViewsActions from '../actions/views.actions';
import * as fromDashboardActions from '../actions/dashboards.actions';
import * as fromDataInsightsMainReducer from '../reducers';
import { PayfactorsApiModelMapper, ViewsHelper } from '../helpers';
import { DashboardView } from '../models';

@Injectable()
export class ViewsEffects {

  @Effect()
  refreshTableauReports$ = this.action$
  .pipe(
    ofType(fromViewsActions.REFRESH_TABLEAU_REPORTS),
    switchMap(() => {
      return this.tableauReportApiService.refreshTableauReports()
        .pipe(
          mergeMap((changesDetected) => {
            const actions = [];
            if (changesDetected) {
              actions.push(new fromViewsActions.GetAllCompanyReportsViews());
            }
            actions.push(new fromViewsActions.RefreshTableauReportsSuccess());
            return actions;
          }),
          catchError(() => of(new fromViewsActions.RefreshTableauReportsError()))
        );
    })
  );

  @Effect()
  getAllCompanyReportsViews$ = this.action$
  .pipe(
    ofType(fromViewsActions.GET_ALL_COMPANY_REPORTS_VIEWS),
    withLatestFrom(
      this.store.pipe(select(fromRootState.getUserContext)),
      (action: fromViewsActions.GetAllCompanyReportsViews, userContext: UserContext) => ({ userContext })
    ),
    switchMap((data) => {
      return this.tableauReportApiService.getAllCompanyReportsViews()
        .pipe(
          mergeMap((response) => {
            const actions = [];
            actions.push(new fromViewsActions.GetAllCompanyReportsViewsSuccess(
              PayfactorsApiModelMapper.mapTableauReportResponsesToWorkbooks(response, data.userContext.CompanyName)
            ));
            actions.push(new fromDashboardActions.SetAllViewsLoaded(true));
            return actions;
          }),
          catchError(() => of(new fromViewsActions.GetAllCompanyReportsViewsError()))
        );
    })
  );

  @Effect()
  addViewFavorite$ = this.action$
  .pipe(
    ofType(fromViewsActions.ADD_VIEW_FAVORITE),
    switchMap((action: fromViewsActions.AddViewFavorite) => {
      return this.tableauReportApiService.addViewFavorite(action.payload.viewId)
        .pipe(
          map(() => new fromViewsActions.AddViewFavoriteSuccess()),
          catchError(() => of(new fromViewsActions.AddViewFavoriteError()))
        );
    })
  );

  @Effect()
  removeViewFavorite$ = this.action$
  .pipe(
    ofType(fromViewsActions.REMOVE_VIEW_FAVORITE),
    switchMap((action: fromViewsActions.RemoveViewFavorite) => {
      return this.tableauReportApiService.removeViewFavorite(action.payload.viewId)
        .pipe(
          map(() => new fromViewsActions.RemoveViewFavoriteSuccess()),
          catchError(() => of(new fromViewsActions.RemoveViewFavoriteError()))
        );
    })
  );

  @Effect()
  addDataViewFavorite$ = this.action$
    .pipe(
      ofType(fromViewsActions.ADD_DATA_VIEW_REPORT_FAVORITE),
      switchMap((action: fromViewsActions.AddDataViewReportFavorite) => {
        return this.tableauReportApiService.addWorkbookFavorite(action.payload.workbookId)
          .pipe(
            map(() => new fromViewsActions.AddDataViewReportFavoriteSuccess()),
            catchError(() => of(new fromViewsActions.AddDataViewReportFavoriteError()))
          );
      })
    );

  @Effect()
  removeDataViewFavorite$ = this.action$
    .pipe(
      ofType(fromViewsActions.REMOVE_DATA_VIEW_REPORT_FAVORITE),
      switchMap((action: fromViewsActions.RemoveDataViewReportFavorite) => {
        return this.tableauReportApiService.removeWorkbookFavorite(action.payload.workbookId)
          .pipe(
            map(() => new fromViewsActions.RemoveViewFavoriteSuccess()),
            catchError(() => of(new fromViewsActions.RemoveDataViewReportFavoriteError()))
          );
      })
    );

  @Effect()
  saveViewOrder$ = this.action$
  .pipe(
    ofType(fromViewsActions.SAVE_REPORT_ORDER),
    switchMap((action: fromViewsActions.SaveReportOrder) => {
      const request: SaveReportOrderRequest = {
        WorkbookId: action.payload.WorkbookId,
        Type: action.payload.Type,
        Views: action.payload.ViewIds
      };
      return this.userReportApiService.saveReportOrder(request)
        .pipe(
          map(() => new fromViewsActions.SaveReportOrderSuccess(action.payload)),
          catchError(() => of(new fromViewsActions.SaveReportOrderError()))
        );
    })
  );

  @Effect()
  saveDataViewReportsOrder$ = this.action$
    .pipe(
      ofType(fromViewsActions.SAVE_DATA_VIEW_REPORTS_ORDER),
      switchMap((action: fromViewsActions.SaveDataViewReportsOrder) => {
        const request = PayfactorsApiModelMapper.buildSaveWorkbookOrderRequest(
          action.payload.workbookIds,
          DashboardView.All,
          WorkbookOrderType.DashboardsOrdering);
        return this.userReportApiService.saveWorkbookOrder(request)
          .pipe(
            map(() => new fromViewsActions.SaveDataViewReportsOrderSuccess()),
            catchError(() => of(new fromViewsActions.SaveDataViewReportsOrderError()))
          );
      })
    );

  @Effect()
  removeViewFavoriteSuccess$ = this.action$
    .pipe(
      ofType(fromViewsActions.REMOVE_VIEW_FAVORITE_SUCCESS),
      withLatestFrom(
        this.store.pipe(select(fromDataInsightsMainReducer.getFavoriteViews)),
        this.store.pipe(select(fromDataInsightsMainReducer.getFavoriteDataViewReports)),
        this.store.pipe(select(fromDataInsightsMainReducer.getDashboardViewThumbnailEnabled)),
        (action, favoriteTableauReports, favoriteDataViewReports, dashboardView) => ({ favoriteTableauReports, favoriteDataViewReports, dashboardView })
      ),
      mergeMap((data) => {
        const actions = [];
        if (data.favoriteTableauReports.length === 0 && data.favoriteDataViewReports.length === 0 && data.dashboardView === DashboardView.Favorites) {
          actions.push(new fromViewsActions.ToggleDashboardView(DashboardView.Views));
        }
        return actions;
      })
    );

  @Effect()
  updateDashboardView$ = this.action$
    .pipe(
      ofType(fromViewsActions.TOGGLE_DASHBOARD_VIEW),
      map((action: fromViewsActions.ToggleDashboardView) => {
        return new fromUiPersistenceSettingsActions.SaveUiPersistenceSetting({
          FeatureArea: FeatureAreaConstants.DataInsights,
          SettingName: UiPersistenceSettingConstants.DashboardViewThumbnailEnabled,
          SettingValue: action.payload
        });
      })
    );

  constructor(
    private action$: Actions,
    private store: Store<fromDataInsightsMainReducer.State>,
    private tableauReportApiService: TableauReportApiService,
    private userReportApiService: UserReportApiService
  ) {}
}
