import { Injectable } from '@angular/core';

import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, select, Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { switchMap, mergeMap, catchError, withLatestFrom, map } from 'rxjs/operators';

import { StructureModelingApiService } from 'libs/data/payfactors-api/structures';
import { DataViewApiService } from 'libs/data/payfactors-api/reports';
import { ExchangeApiService } from 'libs/data/payfactors-api/peer';
import * as fromPfDataGridActions from 'libs/features/grids/pf-data-grid/actions';
import * as fromRangeFieldActions from 'libs/features/structures/range-editor/actions/range-field-edit.actions';
import { DataViewFieldDataType } from 'libs/models/payfactors-api';
import * as fromNotificationActions from 'libs/features/infrastructure/app-notifications/actions/app-notifications.actions';
import { NotificationLevel, NotificationSource, NotificationType } from 'libs/features/infrastructure/app-notifications';
import * as fromPfDataGridReducer from 'libs/features/grids/pf-data-grid/reducers';
import { DataGridToDataViewsHelper } from 'libs/features/grids/pf-data-grid/helpers';

import * as fromSharedActions from '../actions/shared.actions';
import * as fromSharedStructuresReducer from '../../shared/reducers';
import { PayfactorsApiModelMapper } from '../helpers/payfactors-api-model-mapper';
import * as fromSharedStructuresActions from '../actions/shared.actions';



@Injectable()
export class SharedEffects {

  @Effect()
  getCompanyExchanges: Observable<Action> = this.actions$
    .pipe(
      ofType(fromSharedActions.GET_COMPANY_EXCHANGES),
      mergeMap((action: fromSharedActions.GetCompanyExchanges) =>
        of(action).pipe(
          withLatestFrom(
            this.store.pipe(select(fromSharedStructuresReducer.getMetadata)),
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
          [...DataGridToDataViewsHelper.mapFieldsToFilters(data.fields), data.a.payload.refreshRowDataViewFilter],
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


  constructor(
    private actions$: Actions,
    private store: Store<fromSharedStructuresReducer.State>,
    private structureModelingApiService: StructureModelingApiService,
    private dataViewApiService: DataViewApiService,
    private exchangeApiService: ExchangeApiService
  ) {
  }
}
