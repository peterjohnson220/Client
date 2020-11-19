import { Injectable } from '@angular/core';

import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, Store, select } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, mergeMap, switchMap, withLatestFrom } from 'rxjs/operators';
import { GridDataResult } from '@progress/kendo-angular-grid';

import { RangeGroupMetadata } from 'libs/models/structures';
import { StructureRangeGroupApiService } from 'libs/data/payfactors-api/structures';
import { NotificationLevel, NotificationSource, NotificationType } from 'libs/features/app-notifications/models';
import * as fromNotificationActions from 'libs/features/app-notifications/actions/app-notifications.actions';
import * as fromPfDataGridReducer from 'libs/features/pf-data-grid/reducers';
import { GridConfig } from 'libs/features/pf-data-grid/models';
import { PagingOptions } from 'libs/models/payfactors-api/search/request';
import { GridDataHelper } from 'libs/features/pf-data-grid/helpers';

import * as fromPublishModelModalActions from '../actions/publish-model-modal.actions';
import * as fromSharedActions from '../actions/shared.actions';
import * as fromSharedReducer from '../reducers';
import { PagesHelper } from '../helpers/pages.helper';

@Injectable()
export class PublishModelModalEffects {

  @Effect()
  publishModel$: Observable<Action> = this.actions$
    .pipe(
      ofType<fromPublishModelModalActions.PublishModel>(fromPublishModelModalActions.PUBLISH_MODEL),
      withLatestFrom(
        this.store.pipe(select(fromSharedReducer.getMetadata)),
        this.store.pipe(select(fromPfDataGridReducer.getGridConfig)),
        this.store.pipe(select(fromPfDataGridReducer.getData)),
        this.store.pipe(select(fromPfDataGridReducer.getPagingOptions)),
        (action, metadata: RangeGroupMetadata, gridConfig: GridConfig, gridData: GridDataResult, pagingOptions: PagingOptions) => {
          return { action, metadata, gridConfig, gridData, pagingOptions };
        }
      ),
      switchMap((data) => {
        return this.structureRangeGroupApiService.publishStructureModel(data.action.payload.rangeGroupId).pipe(
          mergeMap((r) => {
              const actions = [];
              actions.push(new fromPublishModelModalActions.PublishModelSuccess());
              actions.push(new fromPublishModelModalActions.CloseModal());

              const modelPageViewId = PagesHelper.getModelPageViewIdByRangeDistributionType(data.metadata.RangeDistributionTypeId);
              actions.push(GridDataHelper.getLoadDataAction(modelPageViewId, data.gridData, data.gridConfig, data.pagingOptions));

              const updatedMetaData = {
                ...data.metadata,
                IsCurrent: true
              };
              actions.push(new fromSharedActions.SetMetadata(updatedMetaData));

              actions.push(new fromSharedActions.GetStructureHasPublishedForType({
                RangeGroupId: data.action.payload.rangeGroupId,
                PaymarketId: data.metadata.PaymarketId,
                DistributionTypeId: data.metadata.RangeDistributionTypeId,
                PayType: data.metadata.PayType
              }));

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
