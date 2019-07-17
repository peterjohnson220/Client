import { Injectable } from '@angular/core';

import { of } from 'rxjs';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { switchMap, map, catchError, withLatestFrom } from 'rxjs/operators';
import { select, Store } from '@ngrx/store';

import { TableauReportApiService, UserReportApiService, UiPersistenceSettingsApiService } from 'libs/data/payfactors-api';
import { UserContext } from 'libs/models/security';
import { WorkbookOrderType } from 'libs/constants';
import * as fromRootState from 'libs/state/state';

import * as fromAllDashboardsActions from '../actions/dashboards.actions';
import * as fromDataInsightsMainReducer from '../reducers';
import { PayfactorsApiModelMapper, DashboardsHelper } from '../helpers';
import { DashboardView } from '../models';

@Injectable()
export class DashboardsEffects {

  @Effect()
  getCompanyWorkbooks$ = this.action$
  .pipe(
    ofType(fromAllDashboardsActions.GET_COMPANY_WORKBOOKS),
    withLatestFrom(
      this.store.pipe(select(fromRootState.getUserContext)),
      (action, userContext: UserContext) => ({ userContext })
    ),
    switchMap((data) => {
      return this.tableauReportApiService.getCompanyReports()
        .pipe(
          map((response) => {
            return new fromAllDashboardsActions.GetCompanyWorkbooksSuccess(
              PayfactorsApiModelMapper.mapTableauReportResponsesToWorkbooks(response, data.userContext.CompanyName)
            );
          }),
          catchError(() => of(new fromAllDashboardsActions.GetCompanyWorkbooksError()))
        );
    })
  );

  @Effect()
  updateDashboardView$ = this.action$
    .pipe(
      ofType(fromAllDashboardsActions.TOGGLE_DASHBOARD_VIEW),
      switchMap((action: fromAllDashboardsActions.ToggleDashboardView) => {
        return this.uiPersistenceSettingsApiService.putUiPersistenceSetting({
            FeatureArea: 'DataInsights',
            SettingName: 'DashboardView',
            SettingValue: action.payload.view
          })
          .pipe(
            map(() => new fromAllDashboardsActions.PersistDashboardViewSuccess()),
            catchError(() => of(new fromAllDashboardsActions.PersistDashboardViewError()))
          );
      })
    );

  @Effect()
  getDashboardView$ = this.action$
    .pipe(
      ofType(fromAllDashboardsActions.GET_DASHBOARD_VIEW),
      switchMap(() => {
        return this.uiPersistenceSettingsApiService.getUiPersistenceSetting('DataInsights', 'DashboardView')
          .pipe(
            map((response) => new fromAllDashboardsActions.GetDashboardViewSuccess(response)),
            catchError(() => of(new fromAllDashboardsActions.GetDashboardViewError()))
          );
      })
    );

  @Effect()
  addWorkbookFavorite$ = this.action$
  .pipe(
    ofType(fromAllDashboardsActions.ADD_WORKBOOK_FAVORITE),
    switchMap((action: fromAllDashboardsActions.AddWorkbookFavorite) => {
      return this.tableauReportApiService.addWorkbookFavorite(action.payload.workbookId)
        .pipe(
          map(() => new fromAllDashboardsActions.AddWorkbookFavoriteSuccess()),
          catchError(() => of(new fromAllDashboardsActions.AddWorkbookFavoriteError()))
        );
    })
  );

  @Effect()
  removeWorkbookFavorite$ = this.action$
  .pipe(
    ofType(fromAllDashboardsActions.REMOVE_WORKBOOK_FAVORITE),
    switchMap((action: fromAllDashboardsActions.RemoveWorkbookFavorite) => {
      return this.tableauReportApiService.removeWorkbookFavorite(action.payload.workbookId)
        .pipe(
          map(() => new fromAllDashboardsActions.RemoveWorkbookFavoriteSuccess()),
          catchError(() => of(new fromAllDashboardsActions.RemoveWorkbookFavoriteError()))
        );
    })
  );

  @Effect()
  reorderFavoriteWorkbooks$ = this.action$
  .pipe(
    ofType(fromAllDashboardsActions.REMOVE_WORKBOOK_FAVORITE_SUCCESS),
    withLatestFrom(
      this.store.pipe(select(fromDataInsightsMainReducer.getCompanyWorkbooksAsync)),
      (action, workbooksAsync) => ({ workbooksAsync })
    ),
    map((data) => {
      const favoriteWorkbooks = DashboardsHelper.getCompanyWorkbooksByView(data.workbooksAsync.obj, DashboardView.Favorites);
      const workbookIds = favoriteWorkbooks.map(w => w.WorkbookId);
      return new fromAllDashboardsActions.SaveWorkbookOrder({
        workbookIds,
        workbookOrderType: WorkbookOrderType.FavoritesOrdering
      });
    })
  );

  @Effect()
  saveWorkbookTag$ = this.action$
    .pipe(
      ofType(fromAllDashboardsActions.SAVE_WORKBOOK_TAG),
      switchMap((action: fromAllDashboardsActions.SaveWorkbookTag) => {
        return this.userReportApiService.upsertUserReportTag(
          PayfactorsApiModelMapper.mapSaveWorkbookTagObjToUpsertUserReportTag(action.payload)
        ).pipe(
            map(() => new fromAllDashboardsActions.SaveWorkbookTagSuccess()),
            catchError(() => of(new fromAllDashboardsActions.SaveWorkbookTagError()))
          );
      })
    );


  @Effect()
  saveWorkbookTagSuccess$ = this.action$
    .pipe(
      ofType(fromAllDashboardsActions.SAVE_WORKBOOK_TAG_SUCCESS),
      map(() => new fromAllDashboardsActions.GetCompanyWorkbooks())
    );

  @Effect()
  saveWorkbookOrder$ = this.action$
    .pipe(
      ofType(fromAllDashboardsActions.SAVE_WORKBOOK_ORDER),
      withLatestFrom(
        this.store.pipe(select(fromDataInsightsMainReducer.getDashboardView)),
        (action: fromAllDashboardsActions.SaveWorkbookOrder, view) => ({ action, view })
      ),
      switchMap((data) => {
        const workbookIds = data.action.payload.workbookIds;
        const typeOverride = data.action.payload.workbookOrderType;
        const request = PayfactorsApiModelMapper.buildSaveWorkbookOrderRequest(workbookIds, data.view, typeOverride);
        return this.userReportApiService.saveWorkbookOrder(request)
          .pipe(
            map(() => new fromAllDashboardsActions.SaveWorkbookOrderSuccess({ workbookIds, workbookOrderType: typeOverride })),
            catchError(() => of(new fromAllDashboardsActions.SaveWorkbookOrderError()))
          );
      })
    );

  @Effect()
  getCompanyWorkbookViews$ = this.action$
    .pipe(
      ofType(fromAllDashboardsActions.GET_COMPANY_WORKBOOK_VIEWS),
      switchMap((action: fromAllDashboardsActions.GetCompanyWorkbookViews) => {
        return this.tableauReportApiService.getCompanyReportViews(action.payload.workbookId)
          .pipe(
            map((response) => new fromAllDashboardsActions.GetCompanyWorkbookViewsSuccess(
              {
                workbookId: action.payload.workbookId,
                views: PayfactorsApiModelMapper.mapTableauReportViewsResponsesToViews(response)
              }
            )),
            catchError(() => of(new fromAllDashboardsActions.GetCompanyWorkbookViewsError({workbookId: action.payload.workbookId})))
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
