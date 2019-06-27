import { Injectable } from '@angular/core';

import { of } from 'rxjs';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { switchMap, map, catchError } from 'rxjs/operators';

import { TableauReportApiService } from 'libs/data/payfactors-api';

import * as fromAllDashboardsActions from '../actions/dashboards.actions';
import { PayfactorsApiModelMapper } from '../helpers';

@Injectable()
export class DashboardsEffects {

  @Effect()
  getCompanyWorkbooks$ = this.action$
  .pipe(
    ofType(fromAllDashboardsActions.GET_COMPANY_WORKBOOKS),
    switchMap(() => {
      return this.tableauReportApiService.getCompanyReports()
        .pipe(
          map((response) => {
            return new fromAllDashboardsActions.GetCompanyWorkbooksSuccess(
              PayfactorsApiModelMapper.mapTableauReportResponsesToWorkbooks(response)
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

  constructor(
    private action$: Actions,
    private tableauReportApiService: TableauReportApiService
  ) {}
}
