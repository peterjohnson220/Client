import { Injectable } from '@angular/core';

import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { catchError, map, mergeMap, switchMap, withLatestFrom } from 'rxjs/operators';
import { Action, select, Store } from '@ngrx/store';
import uniqBy from 'lodash/uniqBy';

import { DataViewApiService, StructureModelingApiService } from 'libs/data/payfactors-api';
import { NotificationLevel, NotificationSource, NotificationType } from 'libs/features/infrastructure/app-notifications/models';
import { DataGridToDataViewsHelper, GridDataHelper } from 'libs/features/grids/pf-data-grid/helpers';
import * as fromPfDataGridReducer from 'libs/features/grids/pf-data-grid/reducers';
import * as fromPfDataGridActions from 'libs/features/grids/pf-data-grid/actions';
import * as fromNotificationActions from 'libs/features/infrastructure/app-notifications/actions/app-notifications.actions';
import { JobBasedPageViewIds } from 'libs/models/structures';
import { RangeType } from 'libs/constants/structures/range-type';

import { PayfactorsApiModelMapper } from '../helpers';
import * as fromRangeFieldActions from '../actions/range-field-edit.actions';

@Injectable()
export class RangeFieldEditEffects {

  @Effect()
  updateField$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromRangeFieldActions.UPDATE_RANGE_FIELD),
      switchMap(
        (action: fromRangeFieldActions.UpdateRangeField) =>
          this.structureModelingApiService.recalculateRangeMinMax(PayfactorsApiModelMapper.mapUpdateRangeInputToRecalcAndSaveRangeMinMaxRequest(
            action.payload.rangeGroupId,
            action.payload.rangeId,
            action.payload.fieldValue,
            action.payload.fieldName,
            action.payload.rangeRecalculationType,
            action.payload.rowIndex))
            .pipe(
              mergeMap((response) => {
                const actions = [];

                actions.push(new fromRangeFieldActions.UpdateRangeFieldSuccess({
                  pageViewId: action.payload.pageViewId,
                  refreshRowDataViewFilter: action.payload.refreshRowDataViewFilter,
                  rowIndex: action.payload.rowIndex,
                  modifiedKey: action.payload.rangeId,
                  override: response.Override,
                  rangeType: action.payload.rangeType,
                  reloadGridData: action.payload.reloadGridData
                }));

                if (action.payload.successCallBackFn) {
                  let metaInfo = action.payload.metaInfo;

                  // We need to update Starting Midpoint for Model settings
                  if (action.payload.rangeType === RangeType.Grade && action.payload.rowIndex === 0) {
                    const updatedMetaData = {
                      ...action.payload.metaInfo.metaData,
                      StartingMidpoint: action.payload.fieldValue
                    };

                    metaInfo = {
                      ...action.payload.metaInfo,
                      metaData: updatedMetaData
                    };
                  }

                  action.payload.successCallBackFn(this.store, metaInfo);
                }

                // We should dispatch this action only for Model/Employees/Pricings pages
                // we don't want to dispatch this action on Jobs page
                if (action.payload.pageViewId === JobBasedPageViewIds.ModelMinMidMax
                  || action.payload.pageViewId === JobBasedPageViewIds.ModelTertile
                  || action.payload.pageViewId === JobBasedPageViewIds.ModelQuartile
                  || action.payload.pageViewId === JobBasedPageViewIds.ModelQuintile
                  || action.payload.pageViewId === JobBasedPageViewIds.EmployeesMinMidMax
                  || action.payload.pageViewId === JobBasedPageViewIds.EmployeesTertile
                  || action.payload.pageViewId === JobBasedPageViewIds.EmployeesQuartile
                  || action.payload.pageViewId === JobBasedPageViewIds.EmployeesQuintile
                  || action.payload.pageViewId === JobBasedPageViewIds.Pricings) {
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
  updateFieldSuccess$ = this.actions$
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
            this.store.pipe(select(fromPfDataGridReducer.getGridConfig)),
            this.store.pipe(select(fromPfDataGridReducer.getData)),
            (a: fromRangeFieldActions.UpdateRangeFieldSuccess, baseEntity, fields, pagingOptions, sortDescriptor, applyDefaultFilters, gridConfig, gridData) =>
              ({a, baseEntity, fields, pagingOptions, sortDescriptor, applyDefaultFilters, gridConfig, gridData}))
        )
      ),
      switchMap((data) => {
          if (data.a.payload.reloadGridData) {
            return [
              GridDataHelper.getLoadDataAction(data.a.payload.pageViewId, data.gridData, data.gridConfig, data.pagingOptions)
            ];
          } else {
            let filters = [...DataGridToDataViewsHelper.mapFieldsToFilters(data.fields), data.a.payload.refreshRowDataViewFilter];
            // there are certain scenarios where we end up with essentially duplicate filters out of this line, so filter any dups out.
            filters = uniqBy(filters, function (f) {
              return f.EntitySourceName && f.Operator && f.SourceName;
            });
            return this.dataViewApiService.getData(DataGridToDataViewsHelper.buildDataViewDataRequest(
              data.baseEntity.Id,
              data.fields,
              filters,
              { From: 0, Count: 1 },
              data.sortDescriptor,
              false,
              false
            )).pipe(
              map((response) => new fromPfDataGridActions.UpdateRow(data.a.payload.pageViewId, data.a.payload.rowIndex, response[0]))
            );
          }
        }
      )
    );

  constructor(
    private actions$: Actions,
    private store: Store<any>,
    private structureModelingApiService: StructureModelingApiService,
    private dataViewApiService: DataViewApiService
  ) {}
}
