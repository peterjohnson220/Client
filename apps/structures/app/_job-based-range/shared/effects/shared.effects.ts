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
import { DataViewFieldDataType } from 'libs/models/payfactors-api/reports/request';
import { ExchangeApiService } from 'libs/data/payfactors-api/peer';

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
                  new fromPfDataGridActions.UpdateModifiedKeys(action.payload.pageViewId, response.map(o => o.CompanyStructuresRangesId)),
                  new fromSharedActions.GetDistinctOverrideMessages(action.payload.rangeGroupId)
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
  getDistinctOverrideMessages$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromSharedActions.GET_DISTINCT_OVERRIDE_MESSAGES),
      switchMap((action: fromSharedActions.GetDistinctOverrideMessages) => {
        return this.dataViewApiService.getFilterOptions({
          EntitySourceName: 'CompanyStructures_Ranges_Overrides', SourceName: 'OverrideMessage',
          BaseEntityId: null, Query: null, BaseEntitySourceName: 'CompanyStructures_RangeGroup',
          DisablePagingAndSorting: true, ApplyDefaultFilters: false,
          OptionalFilters: [{
            SourceName: 'CompanyStructuresRangeGroup_ID', EntitySourceName: 'CompanyStructures_RangeGroup',
            DataType: DataViewFieldDataType.Int, Operator: '=', Values: [action.rangeGroupId]
          }]
        })
          .pipe(
            map((response) => {
              return new fromSharedActions.GetDistinctOverrideMessagesSuccess(response);
            }),
            catchError((err) => of(new fromSharedActions.GetDistinctOverrideMessagesError(err)))
          );
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
  structureHasSettings: Observable<Action> = this.actions$
    .pipe(
      ofType(fromSharedActions.GET_STRUCTURE_HAS_SETTINGS),
      switchMap((action: fromSharedActions.GetStructureHasSettings) => {
        return this.structureModelingApiService.getStructureHasSettings(action.payload)
          .pipe(
            map((res) => {
              return new fromSharedActions.GetStructureHasSettingsSuccess(res);
            }),
            catchError((err) => of(new fromSharedActions.GetStructureHasSettingsError(err)))
          );
      })
    );

  @Effect()
  getCompanyExchanges: Observable<Action> = this.actions$
    .pipe(
      ofType(fromSharedActions.GET_COMPANY_EXCHANGES),
      mergeMap((action: fromSharedActions.GetCompanyExchanges) =>
          of(action).pipe(
            withLatestFrom(
              this.store.pipe(select(fromSharedReducer.getMetadata)),
              (a: fromSharedActions.GetCompanyExchanges, metadata) =>
                ({a, metadata}))
          )
      ),
        switchMap((data) => {
          return this.exchangeApiService.getExchangeDictionaryForCompany(data.a.payload)
            .pipe(
              mergeMap((res) => {
                const actions = [];
                let exchangeId: number;
                let exchangeName: string;
                if (data.metadata.ExchangeId) {
                  const selectedExchangeDict = res.filter(x => x.Key === data.metadata.ExchangeId);
                  exchangeName = selectedExchangeDict[0].Value;
                  exchangeId = data.metadata.ExchangeId;
                } else {
                  const defaultExchange = res.filter(x => x.Value === 'Global Network');
                  exchangeId = defaultExchange[0].Key;
                  exchangeName = 'Global Network';
                }
                actions.push(new fromSharedActions.SetSelectedPeerExchange({
                  ExchangeId: exchangeId,
                  ExchangeName: exchangeName
                }));
                actions.push(new fromSharedActions.GetCompanyExchangesSuccess(res));
                return actions;
              }),
              catchError((err) => of(new fromSharedActions.GetCompanyExchangesError(err)))
            );
        })
    );

  constructor(
    private actions$: Actions,
    private store: Store<fromSharedReducer.State>,
    private structureModelingApiService: StructureModelingApiService,
    private dataViewApiService: DataViewApiService,
    private exchangeApiService: ExchangeApiService
  ) {
  }
}
