import { Injectable } from '@angular/core';

import { of } from 'rxjs';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { switchMap, map, catchError, withLatestFrom } from 'rxjs/operators';
import { select, Store } from '@ngrx/store';

import { TableauReportApiService, UserReportApiService } from 'libs/data/payfactors-api';
import { UserContext } from 'libs/models/security';
import * as fromRootState from 'libs/state/state';

import * as fromAllDashboardsActions from '../actions/dashboards.actions';
import * as fromDataInsightsMainReducer from '../reducers';
import { PayfactorsApiModelMapper } from '../helpers';

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
        const request = PayfactorsApiModelMapper.buildSaveWorkbookOrderRequest(workbookIds, data.view);
        return this.userReportApiService.saveWorkbookOrder(request)
          .pipe(
            map(() => new fromAllDashboardsActions.SaveWorkbookOrderSuccess({ workbookIds })),
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
    private userReportApiService: UserReportApiService
  ) {}
}
