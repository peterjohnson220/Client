import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';

import { of } from 'rxjs';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { switchMap, map, catchError, mergeMap, withLatestFrom } from 'rxjs/operators';

import { TableauReportApiService, UserReportApiService, UiPersistenceSettingsApiService } from 'libs/data/payfactors-api';
import { UserContext } from 'libs/models/security';
import * as fromRootState from 'libs/state/state';
import { SaveReportOrderRequest } from 'libs/models/payfactors-api';

import * as fromViewsActions from '../actions/views.actions';
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
          map((response) => new fromViewsActions.GetAllCompanyReportsViewsSuccess(
            PayfactorsApiModelMapper.mapTableauReportResponsesToWorkbooks(response, data.userContext.CompanyName)
          )),
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
  removeViewFavoriteSuccess$ = this.action$
    .pipe(
      ofType(fromViewsActions.REMOVE_VIEW_FAVORITE_SUCCESS),
      withLatestFrom(
        this.store.pipe(select(fromDataInsightsMainReducer.getCompanyWorkbooksAsyncFromViews)),
        this.store.pipe(select(fromDataInsightsMainReducer.getDashboardViewThumbnailEnabled)),
        (action, workbooksAsyncFromViews, dashboardView) => ({ workbooksAsyncFromViews, dashboardView })
      ),
      mergeMap((data) => {
        const actions = [];
        const favoriteViews = ViewsHelper.getFavoriteViews(data.workbooksAsyncFromViews.obj);
        if (favoriteViews.length === 0 && data.dashboardView === DashboardView.Favorites) {

            actions.push(new fromViewsActions.ToggleDashboardView({view: DashboardView.Views}));

        }
        return actions;
      })
    );


  @Effect()
  getDashboardView$ = this.action$
    .pipe(
      ofType(fromViewsActions.GET_DASHBOARD_VIEW),
      switchMap(() => {
        return this.uiPersistenceSettingsApiService.getUiPersistenceSetting('DataInsights', 'DashboardViewThumbnailEnabled')
          .pipe(
            map((response) => new fromViewsActions.GetDashboardViewSuccess(response)),
            catchError(() => of(new fromViewsActions.GetDashboardViewError()))
          );
      })
    );

  @Effect()
  updateDashboardView$ = this.action$
    .pipe(
      ofType(fromViewsActions.TOGGLE_DASHBOARD_VIEW),
      switchMap((action: fromViewsActions.ToggleDashboardView) => {
        return this.uiPersistenceSettingsApiService.putUiPersistenceSetting({
          FeatureArea: 'DataInsights',
          SettingName: 'DashboardViewThumbnailEnabled',
          SettingValue: action.payload.view
        })
          .pipe(
            map(() => new fromViewsActions.PersistDashboardViewSuccess()),
            catchError(() => of(new fromViewsActions.PersistDashboardViewError()))
          );
      })
    );

  constructor(
    private action$: Actions,
    private store: Store<fromDataInsightsMainReducer.State>,
    private tableauReportApiService: TableauReportApiService,
    private userReportApiService: UserReportApiService,
    private uiPersistenceSettingsApiService: UiPersistenceSettingsApiService
  ) {}
}
