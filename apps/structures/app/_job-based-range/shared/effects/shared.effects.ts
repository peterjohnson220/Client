import { Injectable } from '@angular/core';

import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, select, Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { switchMap, map, mergeMap, catchError, withLatestFrom } from 'rxjs/operators';
import { GridDataResult } from '@progress/kendo-angular-grid';

import { RangeGroupMetadata } from 'libs/models/structures';
import { StructureModelingApiService } from 'libs/data/payfactors-api/structures';
import * as pfDataGridActions from 'libs/features/grids/pf-data-grid/actions';
import * as fromPfDataGridActions from 'libs/features/grids/pf-data-grid/actions';
import * as fromNotificationActions from 'libs/features/infrastructure/app-notifications/actions/app-notifications.actions';
import { NotificationLevel, NotificationSource, NotificationType } from 'libs/features/infrastructure/app-notifications/models';
import * as fromPfDataGridReducer from 'libs/features/grids/pf-data-grid/reducers';
import { DataGridToDataViewsHelper, GridDataHelper } from 'libs/features/grids/pf-data-grid/helpers';
import { DataViewApiService } from 'libs/data/payfactors-api/reports';
import { GridConfig } from 'libs/features/grids/pf-data-grid/models';
import { PagingOptions } from 'libs/models/payfactors-api/search/request';
import { ExchangeApiService } from 'libs/data/payfactors-api/peer';

import * as fromSharedJobBasedRangeActions from '../actions/shared.actions';
import * as fromSharedStructuresActions from '../../../shared/actions/shared.actions';
import { PayfactorsApiModelMapper } from '../helpers/payfactors-api-model-mapper';
import * as fromSharedJobBasedReducer from '../reducers';
import * as fromSharedStructuresReducer from '../../../shared/reducers';
import { PagesHelper } from '../../../shared/helpers/pages.helper';

@Injectable()
export class SharedEffects {

  @Effect()
  recalculateRangesWithoutMid$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromSharedJobBasedRangeActions.RECALCULATE_RANGES_WITHOUT_MID),
      withLatestFrom(
        this.store.pipe(select(fromSharedStructuresReducer.getMetadata)),
        this.store.pipe(select(fromPfDataGridReducer.getGridConfig)),
        this.store.pipe(select(fromPfDataGridReducer.getData)),
        this.store.pipe(select(fromPfDataGridReducer.getPagingOptions)),
        (action: fromSharedJobBasedRangeActions.RecalculateRangesWithoutMid, metadata: RangeGroupMetadata, gridConfig: GridConfig, gridData: GridDataResult,
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
                const modelPageViewId =
                  PagesHelper.getModelPageViewIdByRangeTypeAndRangeDistributionType(data.metadata.RangeTypeId, data.metadata.RangeDistributionTypeId);

                actions.push(GridDataHelper.getLoadDataAction(modelPageViewId, data.gridData, data.gridConfig, data.pagingOptions));

                actions.push(new fromSharedStructuresActions.GetOverriddenRanges({
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
      ofType(fromSharedJobBasedRangeActions.REMOVING_RANGE),
      withLatestFrom(
        this.store.pipe(select(fromSharedStructuresReducer.getMetadata)),
        this.store.pipe(select(fromPfDataGridReducer.getGridConfig)),
        this.store.pipe(select(fromPfDataGridReducer.getData)),
        this.store.pipe(select(fromPfDataGridReducer.getPagingOptions)),
        (action: fromSharedJobBasedRangeActions.RecalculateRangesWithoutMid, metadata: RangeGroupMetadata, gridConfig: GridConfig, gridData: GridDataResult,
         pagingOptions: PagingOptions) => {
          return { action, metadata, gridConfig, gridData, pagingOptions };
        }
      ),
      switchMap((data: any) => {
        return this.structureModelingApiService.removeRange(data.action.payload).pipe(
          mergeMap(() => {
            const actions = [];
            const modelPageViewId =
              PagesHelper.getModelPageViewIdByRangeTypeAndRangeDistributionType(data.metadata.RangeTypeId, data.metadata.RangeDistributionTypeId);

            actions.push(new fromSharedJobBasedRangeActions.RemovingRangeSuccess());
            actions.push(new pfDataGridActions.ClearSelections(modelPageViewId, [data.action.payload]));
            actions.push(GridDataHelper.getLoadDataAction(modelPageViewId, data.gridData, data.gridConfig, data.pagingOptions));

            return actions;
          }),
          catchError(error => of(new fromSharedJobBasedRangeActions.RemovingRangeError(error)))
        );
      })
    );

  @Effect()
  getCurrentRangeGroup: Observable<Action> = this.actions$
    .pipe(
      ofType(fromSharedJobBasedRangeActions.GET_CURRENT_RANGE_GROUP),
      switchMap((action: fromSharedJobBasedRangeActions.GetCurrentRangeGroup) => {
        return this.structureModelingApiService.getCurrentRangeGroup(action.payload)
          .pipe(
            mergeMap((res) => {
              const actions = [];

              if (res) {
                actions.push(new fromSharedJobBasedRangeActions.EnableCompareFlag());
              } else {
                actions.push(new fromSharedJobBasedRangeActions.DisableCompareFlag());
              }

              actions.push(new fromSharedJobBasedRangeActions.GetCurrentRangeGroupSuccess(res));

              return actions;
            }),
            catchError((err) => of(new fromSharedJobBasedRangeActions.GetCurrentRangeGroupError(err)))
          );
      })
    );

  @Effect()
  structureHasSettings: Observable<Action> = this.actions$
    .pipe(
      ofType(fromSharedJobBasedRangeActions.GET_STRUCTURE_HAS_SETTINGS),
      switchMap((action: fromSharedJobBasedRangeActions.GetStructureHasSettings) => {
        return this.structureModelingApiService.getStructureHasSettings(action.payload)
          .pipe(
            map((res) => {
              return new fromSharedJobBasedRangeActions.GetStructureHasSettingsSuccess(res);
            }),
            catchError((err) => of(new fromSharedJobBasedRangeActions.GetStructureHasSettingsError(err)))
          );
      })
    );



  constructor(
    private actions$: Actions,
    private store: Store<fromSharedJobBasedReducer.State>,
    private structureModelingApiService: StructureModelingApiService,
    private dataViewApiService: DataViewApiService,
    private exchangeApiService: ExchangeApiService
  ) {
  }
}
