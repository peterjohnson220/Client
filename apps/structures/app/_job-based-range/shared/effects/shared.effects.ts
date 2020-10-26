import { Injectable } from '@angular/core';

import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, select, Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { switchMap, map, mergeMap, catchError, withLatestFrom } from 'rxjs/operators';
import { GridDataResult } from '@progress/kendo-angular-grid';

import { RangeGroupMetadata } from 'libs/models/structures';
import { StructureModelingApiService } from 'libs/data/payfactors-api/structures';
import * as pfDataGridActions from 'libs/features/pf-data-grid/actions';
import * as fromPfDataGridActions from 'libs/features/pf-data-grid/actions';
import * as fromNotificationActions from 'libs/features/app-notifications/actions/app-notifications.actions';
import { NotificationLevel, NotificationSource, NotificationType } from 'libs/features/app-notifications/models';
import * as fromPfDataGridReducer from 'libs/features/pf-data-grid/reducers';
import { DataGridToDataViewsHelper, GridDataHelper } from 'libs/features/pf-data-grid/helpers';
import { DataViewApiService } from 'libs/data/payfactors-api/reports';
import * as fromRangeFieldActions from 'libs/features/structures/range-editor/actions/range-field-edit.actions';
import { GridConfig } from 'libs/features/pf-data-grid/models';
import { PagingOptions } from 'libs/models/payfactors-api/search/request';

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
      withLatestFrom(
        this.store.pipe(select(fromSharedReducer.getMetadata)),
        this.store.pipe(select(fromPfDataGridReducer.getGridConfig)),
        this.store.pipe(select(fromPfDataGridReducer.getData)),
        this.store.pipe(select(fromPfDataGridReducer.getPagingOptions)),
        (action: fromSharedActions.RecalculateRangesWithoutMid, metadata: RangeGroupMetadata, gridConfig: GridConfig, gridData: GridDataResult,
         pagingOptions: PagingOptions) => {
          return { action, metadata, gridConfig, gridData, pagingOptions };
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

                actions.push(GridDataHelper.getLoadDataAction(modelPageViewId, data.gridData, data.gridConfig, data.pagingOptions));

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
      withLatestFrom(
        this.store.pipe(select(fromSharedReducer.getMetadata)),
        this.store.pipe(select(fromPfDataGridReducer.getGridConfig)),
        this.store.pipe(select(fromPfDataGridReducer.getData)),
        this.store.pipe(select(fromPfDataGridReducer.getPagingOptions)),
        (action: fromSharedActions.RecalculateRangesWithoutMid, metadata: RangeGroupMetadata, gridConfig: GridConfig, gridData: GridDataResult,
         pagingOptions: PagingOptions) => {
          return { action, metadata, gridConfig, gridData, pagingOptions };
        }
      ),
      switchMap((data: any) => {
        return this.structureModelingApiService.removeRange(data.action.payload).pipe(
          mergeMap(() => {
            const actions = [];
            const modelPageViewId = PagesHelper.getModelPageViewIdByRangeDistributionType(data.metadata.RangeDistributionTypeId);

            actions.push(new fromSharedActions.RemovingRangeSuccess());
            actions.push(new pfDataGridActions.ClearSelections(modelPageViewId, [data.action.payload]));
            actions.push(GridDataHelper.getLoadDataAction(modelPageViewId, data.gridData, data.gridConfig, data.pagingOptions));

            return actions;
          }),
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
        return new fromSharedActions.UpdateOverrides({ rangeId: action.payload.modifiedKey, overrideToUpdate: action.payload.override, removeOverride: false });
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
                  actions.push(new fromSharedActions.UpdateOverrides({
                    rangeId: action.payload.rangeId, overrideToUpdate: response.Override,
                    removeOverride: true
                  }));
                } else {
                  actions.push(new fromSharedActions.UpdateOverrides({
                    rangeId: action.payload.rangeId, overrideToUpdate: response.Override,
                    removeOverride: false
                  }));
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
        return this.structureModelingApiService.getCurrentRangeGroup(action.payload)
          .pipe(
            mergeMap((res) => {
              const actions = [];

              if (res) {
                actions.push(new fromSharedActions.EnableCompareFlag());
              } else {
                actions.push(new fromSharedActions.DisableCompareFlag());
              }

              actions.push(new fromSharedActions.GetCurrentRangeGroupSuccess(res));

              return actions;
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
            this.store.pipe(select(fromSharedReducer.getCurrentRangeGroup)),
            this.store.pipe(select(fromSharedReducer.getMetadata)),
            this.store.pipe(select(fromSharedReducer.getRoundingSettings)),
            (a: fromSharedActions.GetDataByRangeGroupId, baseEntity, fields, pagingOptions, sortDescriptor, currentRangeGroup, metadata, roundingSettings) =>
              ({ a, baseEntity, fields, pagingOptions, sortDescriptor, currentRangeGroup, metadata, roundingSettings }))
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
          mergeMap((res) => {
            const actions = [];

            if (data.currentRangeGroup.obj.Currency !== data.metadata.Currency || data.currentRangeGroup.obj.Rate !== data.metadata.Rate) {
              actions.push(new fromSharedActions.ConvertCurrencyAndRate({
                OldCurrency: data.currentRangeGroup.obj.Currency,
                NewCurrency: data.metadata.Currency,
                OldRate: data.currentRangeGroup.obj.Rate,
                NewRate: data.metadata.Rate,
                Rounding: data.roundingSettings,
                RangeDistributionTypeId: data.metadata.RangeDistributionTypeId,
                JobRangeData: res
              }));
            } else {
              actions.push(new fromSharedActions.GetDataByRangeGroupIdSuccess(res));
            }
            return actions;
          }),
          catchError((err) => of(new fromSharedActions.GetDataByRangeGroupIdError(err)))
        );
      })
    );


  @Effect()
  convertJobRangeData: Observable<Action> = this.actions$
    .pipe(
      ofType(fromSharedActions.CONVERT_CURRENCY_AND_RATE),
      switchMap((action: fromSharedActions.ConvertCurrencyAndRate) => {
        return this.structureModelingApiService.convertCurrencyAndRate(action.payload)
          .pipe(
            map((res) => {
              return new fromSharedActions.ConvertCurrencyAndRateSuccess(res);
            }),
            catchError((err) => of(new fromSharedActions.ConvertCurrencyAndRateError(err)))
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
