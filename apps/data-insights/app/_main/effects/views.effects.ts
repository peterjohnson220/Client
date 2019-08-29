import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';

import { of } from 'rxjs';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { switchMap, map, catchError, mergeMap, withLatestFrom } from 'rxjs/operators';

import { TableauReportApiService } from 'libs/data/payfactors-api';
import { UserContext } from 'libs/models/security';
import * as fromRootState from 'libs/state/state';

import * as fromViewsActions from '../actions/views.actions';
import * as fromDataInsightsMainReducer from '../reducers';
import { PayfactorsApiModelMapper } from '../helpers/payfactors-api-model-mapper.helper';

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

  constructor(
    private action$: Actions,
    private store: Store<fromDataInsightsMainReducer.State>,
    private tableauReportApiService: TableauReportApiService
  ) {}
}
