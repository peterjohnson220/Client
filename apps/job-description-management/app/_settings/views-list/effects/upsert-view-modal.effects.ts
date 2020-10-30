import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Action, Store } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { switchMap, map, catchError, withLatestFrom, concatMap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

import { JobDescriptionManagementApiService } from 'libs/data/payfactors-api/jdm/job-description-management-api.service';
import { JobDescriptionTemplateApiService } from 'libs/data/payfactors-api/jdm/job-description-template-api.service';
import { TemplateListItemResponse } from 'libs/models/payfactors-api/job-description-template/response';
import { JobDescriptionViewApi } from 'libs/models/payfactors-api/job-description-management/shared';

import * as fromViewsListReducer from '../reducers';
import * as fromUpsertViewModalActions from '../actions/upsert-view-modal.actions';
import * as fromViewsListActions from '../actions/views-list.actions';
import * as fromViewEditActions from '../../view-edit/actions/view-edit.actions';
import { PayfactorsApiModelMapper } from 'libs/features/job-description-management/helpers';
import { PayfactorsApiModelMapper as PayfactorsApiModelMapperSettingsHelper } from '../../shared/helpers';

@Injectable()
export class UpsertViewModalEffects {
  @Effect()
  loadAvailableTemplates: Observable<Action> = this.actions$
    .pipe(
      ofType(fromUpsertViewModalActions.LOAD_AVAILABLE_TEMPLATES),
      switchMap(() =>
      this.jobDescriptionTemplateApiService.getPublished().pipe(
        map((response: TemplateListItemResponse[]) => {
          return new fromUpsertViewModalActions.LoadAvailableTemplatesSuccess(
            PayfactorsApiModelMapper.mapTemplateListItemResponseListToTemplateItemList(response)
          );
        }),
        catchError(() => of(new fromUpsertViewModalActions.LoadAvailableTemplatesError()))
      )
    ));

  @Effect()
  loadJobDescriptionViews: Observable<Action> = this.actions$
    .pipe(
      ofType(fromUpsertViewModalActions.LOAD_JOB_DESCRIPTION_VIEWS),
      switchMap((action: fromUpsertViewModalActions.LoadJobDescriptionViews) => {
        return this.jobDescriptionManagementApiService.getTemplateViews(action.payload.viewName)
          .pipe(
            map((response: JobDescriptionViewApi[]) => {
              return new fromUpsertViewModalActions.LoadJobDescriptionViewsSuccess(
                PayfactorsApiModelMapperSettingsHelper.mapTemplateViewsResponseToJobDescriptionView(response)
              );
            }),
            catchError(() => of(new fromUpsertViewModalActions.LoadJobDescriptionViewsError()))
          );
      })
    );

  @Effect()
  addView: Observable<Action> = this.actions$
  .pipe(
    ofType(fromUpsertViewModalActions.ADD_VIEW),
    switchMap((action: fromUpsertViewModalActions.AddView) => {
      return this.jobDescriptionManagementApiService.addView(action.payload.viewName, action.payload.templateIds).pipe(
        concatMap(() => {
          return [
            new fromViewEditActions.EditView({ viewName: action.payload.viewName }),
            new fromUpsertViewModalActions.AddViewSuccess(),
            new fromUpsertViewModalActions.SetEditingViewName({ editingViewName: '' }),
            new fromUpsertViewModalActions.ClearAssignedTemplates()
          ];
        }),
        catchError((error) => of(new fromUpsertViewModalActions.AddViewError(error)))
      );
    })
  );

  @Effect()
  updateView: Observable<Action> = this.actions$
    .pipe(
      ofType(fromUpsertViewModalActions.UPDATE_VIEW),
      withLatestFrom(
        this.store.select(fromViewsListReducer.getJobDescriptionViews),
        (action: fromUpsertViewModalActions.UpdateView, jobDescriptionViews) => (
          { action, views: jobDescriptionViews }
        )
      ),
      switchMap((data) => {
        return this.jobDescriptionManagementApiService.updateViews(
          PayfactorsApiModelMapperSettingsHelper.mapJobDescriptionViewsToRequestModel(data.views)
        )
        .pipe(
          concatMap(() => {
            return [
              new fromUpsertViewModalActions.UpdateViewSuccess(),
              new fromUpsertViewModalActions.SetEditingViewName({ editingViewName: '' }),
              new fromUpsertViewModalActions.ClearAssignedTemplates()
            ];
          }),
          catchError(error => of(new fromUpsertViewModalActions.UpdateViewError(error)))
        );
      })
    );

  @Effect({dispatch: false})
  addViewSuccess$ = this.actions$
    .pipe(
      ofType(fromUpsertViewModalActions.ADD_VIEW_SUCCESS),
      map(() => {
        this.router.navigate(['settings/job-description-views/edit']);
      })
    );

  @Effect()
  updateViewSuccess$ = this.actions$
    .pipe(
      ofType(fromUpsertViewModalActions.UPDATE_VIEW_SUCCESS),
      map(() =>
        new fromViewsListActions.LoadJobDescriptionSettingsViews()
      )
    );

  constructor(
    private actions$: Actions,
    private store: Store<fromViewsListReducer.State>,
    private jobDescriptionManagementApiService: JobDescriptionManagementApiService,
    private jobDescriptionTemplateApiService: JobDescriptionTemplateApiService,
    private router: Router
  ) {}
}
