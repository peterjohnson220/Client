import { Injectable } from '@angular/core';

import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, select, Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, map, mergeMap, switchMap, withLatestFrom } from 'rxjs/operators';
import { GridDataResult } from '@progress/kendo-angular-grid';

import { StructureModelingApiService } from 'libs/data/payfactors-api/structures';
import { DataViewApiService } from 'libs/data/payfactors-api/reports';
import { ExchangeApiService } from 'libs/data/payfactors-api/peer';
import * as fromPfDataGridActions from 'libs/features/grids/pf-data-grid/actions';
import * as fromRangeFieldActions from 'libs/features/structures/range-editor/actions/range-field-edit.actions';
import { RangeGroupMetadata } from 'libs/models/structures';
import { DataViewFieldDataType } from 'libs/models/payfactors-api';
import { PagingOptions } from 'libs/models/payfactors-api/search/request';
import * as fromNotificationActions from 'libs/features/infrastructure/app-notifications/actions/app-notifications.actions';
import { NotificationLevel, NotificationSource, NotificationType } from 'libs/features/infrastructure/app-notifications';
import * as fromPfDataGridReducer from 'libs/features/grids/pf-data-grid/reducers';
import { DataGridToDataViewsHelper, GridDataHelper } from 'libs/features/grids/pf-data-grid/helpers';
import { GridConfig } from 'libs/features/grids/pf-data-grid/models';
import { RangeType } from 'libs/constants/structures/range-type';
import { StructureRangeGroupApiService } from 'libs/data/payfactors-api/structures';

import * as fromSharedStructuresActions from '../actions/shared.actions';
import * as fromSharedStructuresReducer from '../../shared/reducers';
import { PayfactorsApiModelMapper } from '../helpers/payfactors-api-model-mapper';
import * as fromModelSettingsModalActions from '../actions/model-settings-modal.actions';
import { PagesHelper } from '../helpers/pages.helper';


@Injectable()
export class SharedEffects {

  @Effect()
  getCompanyExchanges: Observable<Action> = this.actions$
    .pipe(
      ofType(fromSharedStructuresActions.GET_COMPANY_EXCHANGES),
      mergeMap((action: fromSharedStructuresActions.GetCompanyExchanges) =>
        of(action).pipe(
          withLatestFrom(
            this.store.pipe(select(fromSharedStructuresReducer.getMetadata)),
            (a: fromSharedStructuresActions.GetCompanyExchanges, metadata) =>
              ({ a, metadata }))
        )
      ),
      switchMap((data) => {
        return this.exchangeApiService.getExchangeDictionaryForCompany(data.a.payload, false)
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
              actions.push(new fromSharedStructuresActions.SetSelectedPeerExchange({
                ExchangeId: exchangeId,
                ExchangeName: exchangeName
              }));
              actions.push(new fromSharedStructuresActions.GetCompanyExchangesSuccess(res));
              return actions;
            }),
            catchError((err) => of(new fromSharedStructuresActions.GetCompanyExchangesError(err)))
          );
      })
    );

  @Effect()
  setMetaDataFromRangeGroupId$ = this.actions$
    .pipe(
      ofType(fromSharedStructuresActions.SET_METADATA_FROM_RANGE_GROUP_ID),
      switchMap((data: any) => {
        return this.structureRangeGroupApiService.getCompanyStructureRangeGroup(data.rangeGroupId).pipe(
          mergeMap((response) => {
            if (response) {
              const metadata = PayfactorsApiModelMapper.mapStructuresRangeGroupResponseToRangeGroupMetadata(response);
              return [
                new fromSharedStructuresActions.SetMetadata(metadata),
                new fromSharedStructuresActions.GetCompanyExchanges(data.companyId)
              ];
            }
          })
        );
      })
    );

  @Effect()
  getOverriddenRanges: Observable<Action> = this.actions$
    .pipe(
      ofType(fromSharedStructuresActions.GET_OVERRIDDEN_RANGES),
      switchMap(
        (action: fromSharedStructuresActions.GetOverriddenRanges) =>
          this.structureModelingApiService.getOverriddenRanges(action.payload.rangeGroupId)
            .pipe(
              mergeMap((response) => {
                const actions = [];
                actions.push(new fromSharedStructuresActions.GetOverriddenRangesSuccess(response));
                actions.push(new fromPfDataGridActions.UpdateModifiedKeys(action.payload.pageViewId, response.map(o => o.CompanyStructuresRangesId)));

                if (!action.payload.ignoreGetDistinctOverrideMessages) {
                  actions.push(new fromSharedStructuresActions.GetDistinctOverrideMessages({
                    rangeGroupId: action.payload.rangeGroupId,
                    pageViewId: action.payload.pageViewId
                  }));
                }

                return actions;
              }),
              catchError(error => of(new fromSharedStructuresActions.GetOverriddenRangesError(error)))
            )
      )
    );

  @Effect()
  refreshOverriddenRanges$: Observable<Action> = this.actions$
    .pipe(
      ofType<fromRangeFieldActions.UpdateRangeFieldSuccess>(fromRangeFieldActions.UPDATE_RANGE_FIELD_SUCCESS),
      map((action: fromRangeFieldActions.UpdateRangeFieldSuccess) => {
        // We want to dispatch UpdateOverrides only for Job based ranges
        if (action.payload.rangeType === RangeType.Job) {
          return new fromSharedStructuresActions.UpdateOverrides({
            rangeId: action.payload.modifiedKey,
            overrideToUpdate:
              action.payload.override,
            removeOverride: false
          });
        }

        return new fromPfDataGridActions.DoNothing(action.payload.pageViewId);
      })
    );

  @Effect()
  getDistinctOverrideMessages$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromSharedStructuresActions.GET_DISTINCT_OVERRIDE_MESSAGES),
      mergeMap((action: fromSharedStructuresActions.GetDistinctOverrideMessages) =>
        of(action).pipe(
          withLatestFrom(
            this.store.pipe(select(fromPfDataGridReducer.getBaseEntity, action.payload.pageViewId)),
            (getAction, baseEntity) =>
              ({ getAction, baseEntity })
          )
        ),
      ),
      switchMap((data) => {
        return this.dataViewApiService.getFilterOptions({
          EntitySourceName: 'CompanyStructures_Ranges_Overrides',
          SourceName: 'OverrideMessage',
          BaseEntityId: data.baseEntity.Id,
          Query: null,
          BaseEntitySourceName: 'CompanyStructures_RangeGroup',
          DisablePagingAndSorting: true,
          ApplyDefaultFilters: false,
          OptionalFilters: [{
            SourceName: 'CompanyStructuresRangeGroup_ID',
            EntitySourceName: 'CompanyStructures_RangeGroup',
            DataType: DataViewFieldDataType.Int,
            Operator: '=',
            Values: [String(data.getAction.payload.rangeGroupId)]
          }]
        })
          .pipe(
            map((response) => {
              return new fromSharedStructuresActions.GetDistinctOverrideMessagesSuccess(response);
            }),
            catchError((err) => of(new fromSharedStructuresActions.GetDistinctOverrideMessagesError(err)))
          );
      })
    );

  @Effect()
  revertingChangesRange$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromSharedStructuresActions.REVERTING_RANGE_CHANGES),
      switchMap(
        (action: fromSharedStructuresActions.RevertingRangeChanges) =>
          this.structureModelingApiService.revertRangeChanges(
            PayfactorsApiModelMapper.mapRevertingRangeChangesToRevertRangeChangesRequest(action.payload.rangeId, action.payload.rangeGroupId))
            .pipe(
              mergeMap((response) => {
                const actions = [];
                // only remove the key if the override was deleted
                if (response.OverrideDeleted) {
                  actions.push(new fromPfDataGridActions.DeleteModifiedKey(action.payload.pageViewId, action.payload.rangeId));
                  actions.push(new fromSharedStructuresActions.UpdateOverrides({
                    rangeId: action.payload.rangeId, overrideToUpdate: response.Override,
                    removeOverride: true
                  }));
                } else {
                  actions.push(new fromSharedStructuresActions.UpdateOverrides({
                    rangeId: action.payload.rangeId, overrideToUpdate: response.Override,
                    removeOverride: false
                  }));
                }
                actions.push(new fromSharedStructuresActions.RevertingRangeChangesSuccess({
                  pageViewId: action.payload.pageViewId,
                  refreshRowDataViewFilter: action.payload.refreshRowDataViewFilter,
                  rowIndex: action.payload.rowIndex
                }));

                return actions;
              }),
              catchError((error) => {
                const actions = [];

                actions.push(new fromSharedStructuresActions.RevertingRangeChangesError(error));
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
      ofType(fromSharedStructuresActions.REVERTING_RANGE_CHANGES_SUCCESS),
      mergeMap((action: fromSharedStructuresActions.RevertingRangeChangesSuccess) =>
        of(action).pipe(
          withLatestFrom(
            this.store.pipe(select(fromPfDataGridReducer.getBaseEntity, action.payload.pageViewId)),
            this.store.pipe(select(fromPfDataGridReducer.getFields, action.payload.pageViewId)),
            this.store.pipe(select(fromPfDataGridReducer.getPagingOptions, action.payload.pageViewId)),
            this.store.pipe(select(fromPfDataGridReducer.getSortDescriptor, action.payload.pageViewId)),
            this.store.pipe(select(fromPfDataGridReducer.getApplyDefaultFilters, action.payload.pageViewId)),
            this.store.pipe(select(fromPfDataGridReducer.getData, action.payload.pageViewId)),
            this.store.pipe(select(fromPfDataGridReducer.getGridConfig, action.payload.pageViewId)),
            (a: fromSharedStructuresActions.RevertingRangeChangesSuccess, baseEntity, fields, pagingOptions, sortDescriptor, applyDefaultFilters,
              data, gridConfig) =>
              ({ a, baseEntity, fields, pagingOptions, sortDescriptor, applyDefaultFilters, data, gridConfig }))
        )
      ),
      switchMap((data) => {
        return this.dataViewApiService.getData(DataGridToDataViewsHelper.buildDataViewDataRequest(
          data.baseEntity.Id,
          data.fields,
          [...DataGridToDataViewsHelper.mapFieldsToFilters(data.fields), data.a.payload.refreshRowDataViewFilter],
          { From: 0, Count: 1 },
          data.sortDescriptor,
          false,
          false
        )).pipe(
          mergeMap((response) => {
            const actions = [];
            // if we don't have a response here, its probably because a filter is leaving it out. just reload the whole grid.
            if (response.length > 0) {
              actions.push(new fromPfDataGridActions.UpdateRow(data.a.payload.pageViewId, data.a.payload.rowIndex, response[0]));
            } else {
              actions.push(GridDataHelper.getLoadDataAction(data.a.payload.pageViewId, data.data, data.gridConfig, data.pagingOptions));
            }

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
      ofType(fromSharedStructuresActions.GET_CURRENT_RANGE_GROUP),
      switchMap((action: fromSharedStructuresActions.GetCurrentRangeGroup) => {
        return this.structureModelingApiService.getCurrentRangeGroup(action.payload)
          .pipe(
            mergeMap((res) => {
              const actions = [];

              if (res) {
                actions.push(new fromSharedStructuresActions.EnableCompareFlag());
              } else {
                actions.push(new fromSharedStructuresActions.DisableCompareFlag());
              }

              actions.push(new fromSharedStructuresActions.GetCurrentRangeGroupSuccess(res));

              return actions;
            }),
            catchError((err) => of(new fromSharedStructuresActions.GetCurrentRangeGroupError(err)))
          );
      })
    );

  @Effect()
  getGradesDetails: Observable<Action> = this.actions$
    .pipe(
      ofType(fromModelSettingsModalActions.GET_GRADES_DETAILS),
      switchMap((action: fromModelSettingsModalActions.GetGradesDetails) => {
        return this.structureModelingApiService.getGradesForStructureByRangeGroupId(action.payload)
          .pipe(
            map((res) => {
              return new fromModelSettingsModalActions.GetGradesDetailsSuccess(res);
            }),
            catchError((err) => of(new fromModelSettingsModalActions.GetGradesDetailsError(err)))
          );
      })
    );

  @Effect()
  removeRange$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromSharedStructuresActions.REMOVING_RANGE),
      withLatestFrom(
        this.store.pipe(select(fromSharedStructuresReducer.getMetadata)),
        this.store.pipe(select(fromPfDataGridReducer.getGridConfig)),
        this.store.pipe(select(fromPfDataGridReducer.getData)),
        this.store.pipe(select(fromPfDataGridReducer.getPagingOptions)),
        (action: fromSharedStructuresActions.RecalculateRangesWithoutMid, metadata: RangeGroupMetadata, gridConfig: GridConfig, gridData: GridDataResult,
          pagingOptions: PagingOptions) => {
          return { action, metadata, gridConfig, gridData, pagingOptions };
        }
      ),
      switchMap((data: any) => {
        return data.action.payload.IsJobRange ?
          this.structureModelingApiService.removeRange({ StructuresRangeId: data.action.payload.StructuresRangeId, IsCurrent: data.action.payload.IsCurrent }).pipe(
            mergeMap(() => {
              const actions = this.refreshGrid(data);
              return actions;
            }),
            catchError(error => of(new fromSharedStructuresActions.RemovingRangeError(error)))
          ) :
          this.structureModelingApiService.removeGrade({ StructuresRangeId: data.action.payload.StructuresRangeId, StructuresRangeGroupId: data.action.payload.StructuresRangeGroupId, IsCurrent: data.action.payload.IsCurrent }).pipe(
            mergeMap(() => {
              const actions = this.refreshGrid(data);
              actions.push(new fromModelSettingsModalActions.GetGradesDetails(data.action.payload.StructuresRangeGroupId));
              return actions;
            }),
            catchError(error => of(new fromSharedStructuresActions.RemovingRangeError(error)))
          )
      })
    );

  refreshGrid(data: any) {
    const actions = [];
    const modelPageViewId =
      PagesHelper.getModelPageViewIdByRangeTypeAndRangeDistributionType(data.metadata.RangeTypeId, data.metadata.RangeDistributionTypeId);
    actions.push(new fromSharedStructuresActions.RemovingRangeSuccess());
    actions.push(new fromPfDataGridActions.ClearSelections(modelPageViewId, [data.action.payload]));
    actions.push(GridDataHelper.getLoadDataAction(modelPageViewId, data.gridData, data.gridConfig, data.pagingOptions));
    return actions
  }

  constructor(
    private actions$: Actions,
    private store: Store<fromSharedStructuresReducer.State>,
    private structureModelingApiService: StructureModelingApiService,
    private dataViewApiService: DataViewApiService,
    private exchangeApiService: ExchangeApiService,
    private structureRangeGroupApiService: StructureRangeGroupApiService
  ) {
  }
}
