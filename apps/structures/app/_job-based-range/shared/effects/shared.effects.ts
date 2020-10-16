import { Injectable } from '@angular/core';

import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, select, Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { switchMap, map, mergeMap, catchError, withLatestFrom } from 'rxjs/operators';

import { RangeGroupMetadata } from 'libs/models/structures';
import { StructureModelingApiService } from 'libs/data/payfactors-api/structures';
import * as pfDataGridActions from 'libs/features/pf-data-grid/actions';
import * as fromPfDataGridActions from 'libs/features/pf-data-grid/actions';
import * as fromNotificationActions from 'libs/features/app-notifications/actions/app-notifications.actions';
import { NotificationLevel, NotificationSource, NotificationType } from 'libs/features/app-notifications/models';
import * as fromPfDataGridReducer from 'libs/features/pf-data-grid/reducers';
import { DataGridToDataViewsHelper } from 'libs/features/pf-data-grid/helpers';
import { DataViewApiService } from 'libs/data/payfactors-api/reports';
import * as fromRangeFieldActions from 'libs/features/structures/range-editor/actions/range-field-edit.actions';

import * as fromSharedActions from '../actions/shared.actions';
import { PayfactorsApiModelMapper } from '../helpers/payfactors-api-model-mapper';
import * as fromSharedReducer from '../reducers';
import { PagesHelper } from '../helpers/pages.helper';

@Injectable()
export class SharedEffects {

  @Effect()
  recalculateRangesWithoutMid$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromSharedActions.RECALCULATE_RANGES_WITHOUT_MID),
      withLatestFrom(this.store.pipe(select(fromSharedReducer.getMetadata)),
        (action: fromSharedActions.RecalculateRangesWithoutMid, metadata: RangeGroupMetadata) => {
          return { action, metadata };
        }
      ),
      switchMap((data) => {
          return this.structureModelingApiService.recalculateRangesWithoutMid(
            PayfactorsApiModelMapper.mapRecalculateRangesWithoutMidInputToRecalculateRangesWithoutMidRequest(
              data.action.payload.rangeGroupId, data.action.payload.rounding))
            .pipe(
              mergeMap(() => {
                const actions = [];
                const modelPageViewId = PagesHelper.getModelPageViewIdByRangeDistributionType(data.metadata.RangeDistributionTypeId);
                actions.push(new pfDataGridActions.LoadData(modelPageViewId));
                actions.push(new fromSharedActions.GetOverriddenRanges({
                  pageViewId: modelPageViewId,
                  rangeGroupId: data.action.payload.rangeGroupId
                }));

                return actions;
              }),
            );
        }
      ));

  @Effect()
  removeRange$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromSharedActions.REMOVING_RANGE),
      withLatestFrom(this.store.pipe(select(fromSharedReducer.getMetadata)),
        (action: fromSharedActions.RecalculateRangesWithoutMid, metadata: RangeGroupMetadata) => {
          return { action, metadata };
        }
      ),
      switchMap((data: any) => {
        const modelPageViewId = PagesHelper.getModelPageViewIdByRangeDistributionType(data.metadata.RangeDistributionTypeId);
        return this.structureModelingApiService.removeRange(data.action.payload).pipe(
          mergeMap(() =>
            [
              new fromSharedActions.RemovingRangeSuccess(),
              new pfDataGridActions.ClearSelections(modelPageViewId, [data.action.payload]),
              new pfDataGridActions.LoadData(modelPageViewId),
            ]),
          catchError(error => of(new fromSharedActions.RemovingRangeError(error)))
        );
      })
    );

  @Effect()
  getOverriddenRanges: Observable<Action> = this.actions$
    .pipe(
      ofType(fromSharedActions.GET_OVERRIDDEN_RANGES),
      switchMap(
        (action: fromSharedActions.GetOverriddenRanges) =>
          this.structureModelingApiService.getOverriddenRanges(action.payload.rangeGroupId)
            .pipe(
              mergeMap((response) =>
                [
                  new fromSharedActions.GetOverriddenRangesSuccess(response),
                  new fromPfDataGridActions.UpdateModifiedKeys(action.payload.pageViewId, response.map(o => o.CompanyStructuresRangesId))
                ]),
              catchError(error => of(new fromSharedActions.GetOverriddenRangesError(error)))
            )
      )
    );

  @Effect()
  refreshOverriddenRanges$: Observable<Action> = this.actions$
    .pipe(
      ofType<fromRangeFieldActions.UpdateRangeFieldSuccess>(fromRangeFieldActions.UPDATE_RANGE_FIELD_SUCCESS),
      map(action => {
        return new fromSharedActions.UpdateOverrides({ rangeId: action.payload.modifiedKey, overrideToUpdate: action.payload.override, removeOverride: false});
      })
    );

  @Effect()
  revertingChangesRange$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromSharedActions.REVERTING_RANGE_CHANGES),
      switchMap(
        (action: fromSharedActions.RevertingRangeChanges) =>
          this.structureModelingApiService.revertRangeChanges(PayfactorsApiModelMapper.mapRevertingRangeChangesToRevertRangeChangesRequest(
            action.payload.rangeId,
            action.payload.rangeGroupId,
            action.payload.roundingSettings))
            .pipe(
              mergeMap((response) => {
                const actions = [];
                // only remove the key if the override was deleted
                if (response.OverrideDeleted) {
                  actions.push(new fromPfDataGridActions.DeleteModifiedKey(action.payload.pageViewId, action.payload.rangeId));
                  actions.push(new fromSharedActions.UpdateOverrides( { rangeId: action.payload.rangeId, overrideToUpdate: response.Override,
                    removeOverride: true }));
                } else {
                  actions.push(new fromSharedActions.UpdateOverrides( { rangeId: action.payload.rangeId, overrideToUpdate: response.Override,
                    removeOverride: false }));
                }
                actions.push(new fromSharedActions.RevertingRangeChangesSuccess({
                  pageViewId: action.payload.pageViewId,
                  refreshRowDataViewFilter: action.payload.refreshRowDataViewFilter,
                  rowIndex: action.payload.rowIndex
                }));

                return actions;
              }),
              catchError((error) => {
                const actions = [];

                actions.push(new fromSharedActions.RevertingRangeChangesError(error));
                actions.push(new fromNotificationActions.AddNotification({
                  EnableHtml: true,
                  From: NotificationSource.GenericNotificationMessage,
                  Level: NotificationLevel.Error,
                  NotificationId: '',
                  Payload: { Title: 'Error', Message: `Unable to revert changes` },
                  Type: NotificationType.Event
                }));

                return actions;
              })
            )
      ));

  @Effect()
  revertingChangesRangeSuccess$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromSharedActions.REVERTING_RANGE_CHANGES_SUCCESS),
      mergeMap((action: fromSharedActions.RevertingRangeChangesSuccess) =>
        of(action).pipe(
          withLatestFrom(
            this.store.pipe(select(fromPfDataGridReducer.getBaseEntity, action.payload.pageViewId)),
            this.store.pipe(select(fromPfDataGridReducer.getFields, action.payload.pageViewId)),
            this.store.pipe(select(fromPfDataGridReducer.getPagingOptions, action.payload.pageViewId)),
            this.store.pipe(select(fromPfDataGridReducer.getSortDescriptor, action.payload.pageViewId)),
            this.store.pipe(select(fromPfDataGridReducer.getApplyDefaultFilters, action.payload.pageViewId)),
            (a: fromSharedActions.RevertingRangeChangesSuccess, baseEntity, fields, pagingOptions, sortDescriptor, applyDefaultFilters) =>
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
          mergeMap((response) => {
            const actions = [];

            actions.push(new fromPfDataGridActions.UpdateRow(data.a.payload.pageViewId, data.a.payload.rowIndex, response[0]));
            actions.push(new fromNotificationActions.AddNotification({
              EnableHtml: true,
              From: NotificationSource.GenericNotificationMessage,
              Level: NotificationLevel.Success,
              NotificationId: '',
              Payload: { Title: 'Job range data has been reverted back', Message: `Job range data has been reverted back to the original calculation` },
              Type: NotificationType.Event
            }));

            return actions;
          })
        );
      }));

  @Effect()
  getCurrentRangeGroup: Observable<Action> = this.actions$
    .pipe(
      ofType(fromSharedActions.GET_CURRENT_RANGE_GROUP),
      switchMap((action: fromSharedActions.GetCurrentRangeGroup) => {
        return this.structureModelingApiService.getCurrentRangeGroup(
          action.payload.RangeGroupId,
          action.payload.PaymarketId,
          action.payload.Rate)
          .pipe(
            map((res) => {
              return new fromSharedActions.GetCurrentRangeGroupSuccess(res);
            }),
            catchError((err) => of(new fromSharedActions.GetCurrentRangeGroupError(err)))
          );
      })
    );

  @Effect()
  getData: Observable<Action> = this.actions$
    .pipe(
      ofType(fromSharedActions.GET_DATA_BY_RANGE_GROUP_ID),
      mergeMap((action: fromSharedActions.GetDataByRangeGroupId) =>
        of(action).pipe(
          withLatestFrom(
            this.store.pipe(select(fromPfDataGridReducer.getBaseEntity, action.payload.pageViewId)),
            this.store.pipe(select(fromPfDataGridReducer.getFields, action.payload.pageViewId)),
            this.store.pipe(select(fromPfDataGridReducer.getPagingOptions, action.payload.pageViewId)),
            this.store.pipe(select(fromPfDataGridReducer.getSortDescriptor, action.payload.pageViewId)),
            (a: fromSharedActions.GetDataByRangeGroupId, baseEntity, fields, pagingOptions, sortDescriptor) =>
              ({ a, baseEntity, fields, pagingOptions, sortDescriptor }))
        )
      ),
      switchMap((data) => {
        return this.dataViewApiService.getData(DataGridToDataViewsHelper.buildDataViewDataRequest(
          data.baseEntity.Id,
          data.fields,
          data.a.payload.filters,
          data.pagingOptions,
          data.sortDescriptor,
          false,
          false,
        )).pipe(
          map((res) => {
            return new fromSharedActions.GetDataByRangeGroupIdSuccess(res);
          }),
          catchError((err) => of(new fromSharedActions.GetDataByRangeGroupIdError(err)))
        );
      })
    );

  constructor(
    private actions$: Actions,
    private store: Store<fromSharedReducer.State>,
    private structureModelingApiService: StructureModelingApiService,
    private dataViewApiService: DataViewApiService
  ) {
  }
}
