import { Injectable } from '@angular/core';

import { Action } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { switchMap, map, catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

import { JobDescriptionManagementApiService } from 'libs/data/payfactors-api/jdm';
import { arraySortByString, SortDirection } from 'libs/core/functions';

import * as fromViewsListActions from '../actions/views-list.actions';

@Injectable()
export class ViewsListEffects {
  @Effect()
  loadJobDescriptionViews: Observable<Action> = this.actions$
    .pipe(
      ofType(fromViewsListActions.LOAD_JOB_DESCRIPTION_VIEWS),
      switchMap(() =>
        this.jobDescriptionManagementApiService.getViewNames().pipe(
          map((response: string[]) => {
            return new fromViewsListActions.LoadJobDescriptionViewsSuccess(
              response.map(r => ({ Name: r })).sort((a, b) => arraySortByString(a.Name, b.Name, SortDirection.Ascending))
            );
          }),
          catchError(() => of(new fromViewsListActions.LoadJobDescriptionViewsError()))
        )
      ));

  @Effect()
  loadJobDescriptionSettingsViews: Observable<Action> = this.actions$
    .pipe(
      ofType(fromViewsListActions.LOAD_JOB_DESCRIPTION_SETTINGS_VIEWS),
      switchMap(() =>
        this.jobDescriptionManagementApiService.getSettingsViews().pipe(
          map((response) => {
            return new fromViewsListActions.LoadJobDescriptionViewsSettingsSuccess(response);
          }),
          catchError(() => of(new fromViewsListActions.LoadJobDescriptionViewsError()))
        )
      ));

  @Effect()
  deleteJobDescriptionView$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromViewsListActions.DELETE_VIEW),
      switchMap((action: fromViewsListActions.DeleteView) =>
        this.jobDescriptionManagementApiService.deleteView(action.payload.viewName).pipe(
          map(() => new fromViewsListActions.LoadJobDescriptionSettingsViews())
        )
      ));

  constructor(
    private actions$: Actions,
    private jobDescriptionManagementApiService: JobDescriptionManagementApiService
  ) {}
}
