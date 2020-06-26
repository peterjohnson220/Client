import { Injectable } from '@angular/core';

import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { catchError, map, mergeMap, switchMap, withLatestFrom } from 'rxjs/operators';
import { Action, select, Store } from '@ngrx/store';

import { DataViewApiService, StructureModelingApiService } from 'libs/data/payfactors-api';
import { NotificationLevel, NotificationSource, NotificationType } from 'libs/features/app-notifications/models';
import { DataGridToDataViewsHelper } from 'libs/features/pf-data-grid/helpers';
import * as fromPfDataGridReducer from 'libs/features/pf-data-grid/reducers';
import * as fromPfDataGridActions from 'libs/features/pf-data-grid/actions';
import * as fromNotificationActions from 'libs/features/app-notifications/actions/app-notifications.actions';

import { PayfactorsApiModelMapper } from '../helpers';
import * as fromMidpointEditActions from '../actions/midpoint-edit.actions';

@Injectable()
export class MidpointEditEffects {
  @Effect()
  updateMid$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromMidpointEditActions.UPDATE_MID),
      switchMap(
        (action: fromMidpointEditActions.UpdateMid) =>
          this.structureModelingApiService.recalculateRangeMinMax(PayfactorsApiModelMapper.mapUpdateRangeInputToRecalcAndSaveRangeMinMaxRequest(
            action.payload.rangeGroupId,
            action.payload.rangeId,
            action.payload.mid,
            action.payload.rowIndex,
            action.payload.roundingSettings))
            .pipe(
              mergeMap((response) => {
                const actions = [];

                actions.push(new fromMidpointEditActions.UpdateMidSuccess({
                  pageViewId: action.payload.pageViewId,
                  refreshRowDataViewFilter: action.payload.refreshRowDataViewFilter,
                  rowIndex: action.payload.rowIndex
                }));

                if (action.payload.successCallBackFn) {
                  action.payload.successCallBackFn(this.store, action.payload.metaInfo);
                }

                return actions;
              }),
              catchError(() => {
                const actions = [];

                actions.push(new fromMidpointEditActions.UpdateMidError());

                actions.push(new fromNotificationActions.AddNotification({
                  EnableHtml: true,
                  From: NotificationSource.GenericNotificationMessage,
                  Level: NotificationLevel.Error,
                  NotificationId: '',
                  Payload: { Title: 'Error', Message: `Unable to update midpoint value`},
                  Type: NotificationType.Event
                }));

                return actions;
              })
            )
      )
    );

  @Effect()
  updateMidSuccess$ = this.actions$
    .pipe(
      ofType<fromMidpointEditActions.UpdateMidSuccess>(fromMidpointEditActions.UPDATE_MID_SUCCESS),
      mergeMap((action: fromMidpointEditActions.UpdateMidSuccess) =>
        of(action).pipe(
          withLatestFrom(
            this.store.pipe(select(fromPfDataGridReducer.getBaseEntity, action.payload.pageViewId)),
            this.store.pipe(select(fromPfDataGridReducer.getFields, action.payload.pageViewId)),
            this.store.pipe(select(fromPfDataGridReducer.getPagingOptions, action.payload.pageViewId)),
            this.store.pipe(select(fromPfDataGridReducer.getSortDescriptor, action.payload.pageViewId)),
            this.store.pipe(select(fromPfDataGridReducer.getApplyDefaultFilters, action.payload.pageViewId)),
            (a: fromMidpointEditActions.UpdateMidSuccess, baseEntity, fields, pagingOptions, sortDescriptor, applyDefaultFilters) =>
              ({ a, baseEntity, fields, pagingOptions, sortDescriptor, applyDefaultFilters }))
          )
      ),
      switchMap((data) => {
        return this.dataViewApiService.getData(DataGridToDataViewsHelper.buildDataViewDataRequest(
          data.baseEntity.Id,
          data.fields,
          [...DataGridToDataViewsHelper.mapFieldsToFiltersUseValuesProperty(data.fields), data.a.payload.refreshRowDataViewFilter],
          { From: 0, Count: 1},
          data.sortDescriptor,
          false,
          false
        )).pipe(
          map((response) => new fromPfDataGridActions.UpdateRow(data.a.payload.pageViewId, data.a.payload.rowIndex, response[0]))
        );
      })
    );

  constructor(
    private actions$: Actions,
    private store: Store<any>,
    private structureModelingApiService: StructureModelingApiService,
    private dataViewApiService: DataViewApiService
  ) {}
}
