import { Injectable } from '@angular/core';

import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, Store, select } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, mergeMap, switchMap, withLatestFrom } from 'rxjs/operators';
import { GridDataResult } from '@progress/kendo-angular-grid';

import { RangeGroupMetadata } from 'libs/models/structures';
import { StructureRangeGroupApiService } from 'libs/data/payfactors-api/structures';
import { NotificationLevel, NotificationSource, NotificationType } from 'libs/features/infrastructure/app-notifications/models';
import * as fromNotificationActions from 'libs/features/infrastructure/app-notifications/actions/app-notifications.actions';
import * as fromPfDataGridReducer from 'libs/features/grids/pf-data-grid/reducers';
import { GridConfig, PfDataGridFilter } from 'libs/features/grids/pf-data-grid/models';
import { PagingOptions } from 'libs/models/payfactors-api/search/request';
import { GridDataHelper } from 'libs/features/grids/pf-data-grid/helpers';
import * as fromActions from 'libs/features/grids/pf-data-grid/actions';
import { ViewField } from 'libs/models/payfactors-api/reports/request';

import * as fromPublishModelModalActions from '../actions/publish-model-modal.actions';
import * as fromSharedActions from '../actions/shared.actions';
import * as fromSharedReducer from '../reducers';
import { PagesHelper } from '../../../shared/helpers/pages.helper';

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
        this.store.pipe(select(fromPfDataGridReducer.getFields)),
        this.store.pipe(select(fromPfDataGridReducer.getSplitViewFilters)),
        (action, metadata: RangeGroupMetadata, gridConfig: GridConfig, gridData: GridDataResult, pagingOptions: PagingOptions, fields: ViewField[],
         splitViewFilters: PfDataGridFilter[]) => {
          return { action, metadata, gridConfig, gridData, pagingOptions, fields, splitViewFilters };
        }
      ),
      switchMap((data) => {
        return this.structureRangeGroupApiService.publishStructureModel(data.action.payload.rangeGroupId).pipe(
          mergeMap((r) => {
              const actions = [];
              actions.push(new fromPublishModelModalActions.PublishModelSuccess());
              actions.push(new fromPublishModelModalActions.CloseModal());

              const modelPageViewId =
                PagesHelper.getModelPageViewIdByRangeTypeAndRangeDistributionType(data.metadata.RangeTypeId, data.metadata.RangeDistributionTypeId);
              actions.push(GridDataHelper.getLoadDataAction(modelPageViewId, data.gridData, data.gridConfig, data.pagingOptions));

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


              actions.push(new fromSharedActions.GetOverriddenRanges({
                pageViewId: modelPageViewId,
                rangeGroupId: data.action.payload.rangeGroupId
              }));

              // We need to clear filter for OverrideMessage if it was applied
              if (data.splitViewFilters.find(f => f.SourceName === 'OverrideMessage')) {
                const overrideMessageField = data.fields.find(f => f.SourceName === 'OverrideMessage');
                if (overrideMessageField != null) {
                  actions.push(new fromActions.ClearFilter(modelPageViewId, overrideMessageField));
                }
              }

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
