import { Injectable } from '@angular/core';

import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, Store, select } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, mergeMap, switchMap, withLatestFrom } from 'rxjs/operators';

import { StructureRangeGroupApiService } from 'libs/data/payfactors-api/structures';
import { NotificationLevel, NotificationSource, NotificationType } from 'libs/features/app-notifications/models';
import * as fromNotificationActions from 'libs/features/app-notifications/actions/app-notifications.actions';
import * as pfDataGridActions from 'libs/features/pf-data-grid/actions';

import * as fromPublishModelModalActions from '../actions/publish-model-modal.actions';
import * as fromSharedActions from '../actions/shared.actions';
import * as fromSharedReducer from '../reducers';
import { RangeGroupMetadata } from '../models';
import { PagesHelper } from '../helpers/pages.helper';

@Injectable()
export class PublishModelModalEffects {

  @Effect()
  publishModel$: Observable<Action> = this.actions$
    .pipe(
      ofType<fromPublishModelModalActions.PublishModel>(fromPublishModelModalActions.PUBLISH_MODEL),
      withLatestFrom(this.store.pipe(select(fromSharedReducer.getMetadata)),
        (action, metadata: RangeGroupMetadata) => {
          return { action, metadata };
        }
      ),
      switchMap((data) => {
        return this.structureRangeGroupApiService.publishStructureModel(data.action.payload.rangeGroupId).pipe(
          mergeMap((r) => {
              const actions = [];
              actions.push(new fromPublishModelModalActions.PublishModelSuccess());
              actions.push(new fromPublishModelModalActions.CloseModal());

              const modelPageViewId = PagesHelper.getModelPageViewIdByRangeDistributionType(data.metadata.RangeDistributionTypeId);
              actions.push(new pfDataGridActions.LoadData(modelPageViewId));

              const updatedMetaData = {
                ...data.metadata,
                IsCurrent: true
              };
              actions.push(new fromSharedActions.SetMetadata(updatedMetaData));

              actions.push(new fromNotificationActions.AddNotification({
                EnableHtml: true,
                From: NotificationSource.GenericNotificationMessage,
                Level: NotificationLevel.Success,
                NotificationId: '',
                Payload: { Message: 'Published as current structure successfully' },
                Type: NotificationType.Event
              }));

              return actions;
            }
          ),
          catchError(() => of(new fromPublishModelModalActions.PublishModelError()))
        );
      })
    );

  constructor(
    private actions$: Actions,
    private structureRangeGroupApiService: StructureRangeGroupApiService,
    private store: Store<fromSharedReducer.State>
  ) {
  }
}
