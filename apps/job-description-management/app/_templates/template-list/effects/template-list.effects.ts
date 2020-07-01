import { Injectable } from '@angular/core';

import { Action } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { switchMap, map, catchError, concatMap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

import { JobDescriptionTemplateApiService } from 'libs/data/payfactors-api/jdm';
import { TemplateListItemResponse } from 'libs/models/payfactors-api';
import { MessageHelper } from 'libs/core';
import { NotificationLevel, NotificationSource } from 'libs/features/app-notifications/models';
import * as fromAppNotificationsActions from 'libs/features/app-notifications/actions/app-notifications.actions';


import * as fromTemplateActions from '../actions/template-list.actions';
import { PayfactorsApiModelMapper } from 'libs/features/job-description-management/helpers';

@Injectable()
export class TemplateListEffects {
@Effect()
  loadTemplateList$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromTemplateActions.LOAD_TEMPLATE_LIST),
      switchMap((action: fromTemplateActions.LoadTemplateList) =>
        this.templateApiService.get().pipe(
          map((response: TemplateListItemResponse[]) => {
              return new fromTemplateActions.LoadTemplateListSuccess(PayfactorsApiModelMapper.mapTemplateListItemResponseListToTemplateItemList(response));
            }),
          catchError(response => of(new fromTemplateActions.LoadTemplateListError(
            { errorMessage: MessageHelper.buildErrorMessage('Error loading templates.')}
          )))
        )
      ));

  @Effect()
  deleteTemplate$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromTemplateActions.DELETE_TEMPLATE),
      switchMap((action: fromTemplateActions.DeleteTemplate) =>
        this.templateApiService.delete(action.payload.id).pipe(
          map(() => {
            return new fromTemplateActions.DeleteTemplateSuccess();
          }),
          catchError(response => of(new fromTemplateActions.DeleteTemplateError(
            { errorMessage: MessageHelper.buildErrorMessage('Error deleting template.')}
          )))
        )
      ));

  @Effect()
  deleteTemplateSuccess$: Observable<Action> = this.actions$
  .pipe(
      ofType(fromTemplateActions.DELETE_TEMPLATE_SUCCESS),
      switchMap(() =>
      of(new fromTemplateActions.LoadTemplateList())
      ));

  @Effect()
  addNotification$: Observable<Action> = this.actions$
    .pipe(
      ofType<fromAppNotificationsActions.AddNotification>(fromAppNotificationsActions.ADD_NOTIFICATION),
      concatMap((data) => {
        const actions = [];
        if (data.payload.Level === NotificationLevel.Success &&
            data.payload.From === NotificationSource.JobDescriptionTemplatePublisher) {
              actions.push(new fromTemplateActions.LoadTemplateList());
        }
        return actions;
      })
  );

  constructor(
    private actions$: Actions,
    private templateApiService: JobDescriptionTemplateApiService,
  ) {}
}
