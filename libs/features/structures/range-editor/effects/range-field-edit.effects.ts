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
import * as fromRangeFieldActions from '../actions/range-field-edit.actions';
import { PageViewIds } from '../../../../../apps/structures/app/_job-based-range/shared/constants/page-view-ids';

@Injectable()
export class RangeFieldEditEffects {

  @Effect()
  updateMid$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromRangeFieldActions.UPDATE_RANGE_FIELD),
      switchMap(
        (action: fromRangeFieldActions.UpdateRangeField) =>
          this.structureModelingApiService.recalculateRangeMinMax(PayfactorsApiModelMapper.mapUpdateRangeInputToRecalcAndSaveRangeMinMaxRequest(
            action.payload.rangeGroupId,
            action.payload.rangeId,
            action.payload.fieldValue,
            action.payload.fieldName,
            action.payload.isMid,
            action.payload.rowIndex,
            action.payload.roundingSettings))
            .pipe(
              mergeMap((response) => {
                const actions = [];

                actions.push(new fromRangeFieldActions.UpdateRangeFieldSuccess({
                  pageViewId: action.payload.pageViewId,
                  refreshRowDataViewFilter: action.payload.refreshRowDataViewFilter,
                  rowIndex: action.payload.rowIndex,
                  modifiedKey: action.payload.rangeId,
                  override: response.Override
                }));

                if (action.payload.successCallBackFn) {
                  action.payload.successCallBackFn(this.store, action.payload.metaInfo);
                }

                // We should dispatch this action only for Model/Employees/Pricings pages
                // we don't want to dispatch this action on Jobs page
                if (action.payload.pageViewId === PageViewIds.ModelMinMidMax
                  || action.payload.pageViewId === PageViewIds.ModelTertile
                  || action.payload.pageViewId === PageViewIds.ModelQuartile
                  || action.payload.pageViewId === PageViewIds.ModelQuintile
                  || action.payload.pageViewId === PageViewIds.Employees
                  || action.payload.pageViewId === PageViewIds.Pricings) {
                  actions.push(new fromPfDataGridActions.UpdateModifiedKey(action.payload.pageViewId, action.payload.rangeId));
                }

                return actions;
              }),
              catchError(() => {
                const actions = [];

                actions.push(new fromRangeFieldActions.UpdateRangeFieldError());

                actions.push(new fromNotificationActions.AddNotification({
                  EnableHtml: true,
                  From: NotificationSource.GenericNotificationMessage,
                  Level: NotificationLevel.Error,
                  NotificationId: '',
                  Payload: { Title: 'Error', Message: `Unable to update value` },
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
      ofType<fromRangeFieldActions.UpdateRangeFieldSuccess>(fromRangeFieldActions.UPDATE_RANGE_FIELD_SUCCESS),
      mergeMap((action: fromRangeFieldActions.UpdateRangeFieldSuccess) =>
        of(action).pipe(
          withLatestFrom(
            this.store.pipe(select(fromPfDataGridReducer.getBaseEntity, action.payload.pageViewId)),
            this.store.pipe(select(fromPfDataGridReducer.getFields, action.payload.pageViewId)),
            this.store.pipe(select(fromPfDataGridReducer.getPagingOptions, action.payload.pageViewId)),
            this.store.pipe(select(fromPfDataGridReducer.getSortDescriptor, action.payload.pageViewId)),
            this.store.pipe(select(fromPfDataGridReducer.getApplyDefaultFilters, action.payload.pageViewId)),
            (a: fromRangeFieldActions.UpdateRangeFieldSuccess, baseEntity, fields, pagingOptions, sortDescriptor, applyDefaultFilters) =>
              ({ a, baseEntity, fields, pagingOptions, sortDescriptor, applyDefaultFilters }))
        )
      ),
      switchMap((data) => {
        return this.dataViewApiService.getData(DataGridToDataViewsHelper.buildDataViewDataRequest(
          data.baseEntity.Id,
          data.fields,
          [...DataGridToDataViewsHelper.mapFieldsToFiltersUseValuesProperty(data.fields), data.a.payload.refreshRowDataViewFilter],
          { From: 0, Count: 1 },
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
