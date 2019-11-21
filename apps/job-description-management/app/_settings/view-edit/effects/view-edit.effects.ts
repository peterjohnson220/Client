import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Action, Store } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';

import { Observable, of } from 'rxjs';
import { catchError, map, mergeMap, switchMap, withLatestFrom } from 'rxjs/operators';

import { JobDescriptionManagementApiService } from 'libs/data/payfactors-api/jdm';
import { JobDescriptionViewApi } from 'libs/models/payfactors-api';

import * as fromViewEditActions from '../actions/view-edit.actions';
import * as fromJobInfoViewEditorActions from '../actions/job-info-view-editor.actions';
import * as fromViewEditReducer from '../reducers';
import { PayfactorsApiModelMapper } from '../../shared/helpers';

@Injectable()
export class ViewEditEffects {
  @Effect()
  editView$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromViewEditActions.EDIT_VIEW),
      mergeMap((action: fromViewEditActions.EditView) => [
        new fromViewEditActions.LoadTemplateViews(action.payload),
        new fromJobInfoViewEditorActions.GetJobInformationFields()
      ])
    );

  @Effect()
  loadTemplateViews$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromViewEditActions.LOAD_TEMPLATE_VIEWS),
      switchMap((action: fromViewEditActions.LoadTemplateViews) => {
        return this.jobDescriptionManagementApiService.getTemplateViews(action.payload.viewName)
          .pipe(
            map((response: JobDescriptionViewApi[]) => {
              return new fromViewEditActions.LoadTemplateViewsSuccess(
                PayfactorsApiModelMapper.mapTemplateViewsResponseToJobDescriptionView(response)
              );
            }),
            catchError(() => of(new fromViewEditActions.LoadTemplateViewsError()))
          );
      })
    );

  @Effect()
  loadTemplateViewsSuccess$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromViewEditActions.LOAD_TEMPLATE_VIEWS_SUCCESS),
      map(() => new fromViewEditActions.GetAvailableControls())
    );

  @Effect()
  getAvailableControls$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromViewEditActions.GET_AVAILABLE_CONTROLS),
      switchMap(() => {
        return this.jobDescriptionManagementApiService.getAvailableControls()
          .pipe(
            map((response: any[]) => new fromViewEditActions.GetAvailableControlsSuccess(response)),
            catchError(() => of(new fromViewEditActions.GetAvailableControlsError()))
          );
      })
    );

  @Effect()
  getAvailableControlsSuccess$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromViewEditActions.GET_AVAILABLE_CONTROLS_SUCCESS),
      map(() => new fromViewEditActions.PopulateControlColors())
    );

  @Effect()
  saveTemplateViews$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromViewEditActions.SAVE_TEMPLATE_VIEWS),
      withLatestFrom(
        this.store.select(fromViewEditReducer.getViewEditTemplateViewsAsyncObj),
        this.store.select(fromViewEditReducer.getJobInfoFieldsAsyncObj),
        (action: fromViewEditActions.SaveTemplateViews, templateViews, jobInfoFields) => (
          { action, views: templateViews.obj, jobInfoFields: jobInfoFields.obj }
        )
      ),
      switchMap((data) => {
        return this.jobDescriptionManagementApiService.updateViews(
          PayfactorsApiModelMapper.mapJobDescriptionViewsToRequestModel(data.views, data.jobInfoFields.filter(ji => ji.Checked))
        )
          .pipe(
            map(() => new fromViewEditActions.SaveTemplateViewsSuccess()),
            catchError(() => of(new fromViewEditActions.SaveTemplateViewsError()))
          );
      })
    );

  @Effect({dispatch: false})
  saveTemplateViewsSuccess$ = this.actions$
    .pipe(
      ofType(fromViewEditActions.SAVE_TEMPLATE_VIEWS_SUCCESS),
      map(() => {
        this.router.navigate(['settings/job-description-views']);
      })
    );

  constructor(
    private actions$: Actions,
    private store: Store<fromViewEditReducer.State>,
    private router: Router,
    private jobDescriptionManagementApiService: JobDescriptionManagementApiService
  ) { }
}
