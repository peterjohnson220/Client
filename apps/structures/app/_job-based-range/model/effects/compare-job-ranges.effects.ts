import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { Action, select, Store } from '@ngrx/store';
import { catchError, map, mergeMap, switchMap, withLatestFrom } from 'rxjs/operators';

import * as fromPfDataGridReducer from 'libs/features/grids/pf-data-grid/reducers';
import * as fromPfDataGridActions from 'libs/features/grids/pf-data-grid/actions';
import { PagingOptions } from 'libs/models/payfactors-api/search/request';
import { DataGridToDataViewsHelper } from 'libs/features/grids/pf-data-grid/helpers';
import { DataViewApiService } from 'libs/data/payfactors-api/reports';
import { StructureModelingApiService } from 'libs/data/payfactors-api/structures';

import { CompareJobRangesHelper } from '../helpers';
import * as fromCompareJobRangesReducer from '../reducers';
import * as fromCompareJobRangesActions from '../actions';
import * as fromSharedReducer from '../../shared/reducers';

@Injectable()
export class CompareJobRangesEffects {
  constructor(
    private actions$: Actions,
    private dataViewApiService: DataViewApiService,
    private structureModelingApiService: StructureModelingApiService,
    private store: Store<fromCompareJobRangesReducer.State>
  ) {}

  @Effect()
  getDataForCompare: Observable<Action> = this.actions$
    .pipe(
      ofType(
        fromCompareJobRangesActions.GET_DATA_FOR_COMPARE,
        fromPfDataGridActions.LOAD_MORE_DATA
      ),
      mergeMap((action: fromCompareJobRangesActions.GetDataForCompare) =>
        of(action).pipe(
          withLatestFrom(
            this.store.pipe(select(fromPfDataGridReducer.getBaseEntity, action.pageViewId)),
            this.store.pipe(select(fromPfDataGridReducer.getFields, action.pageViewId)),
            this.store.pipe(select(fromPfDataGridReducer.getPagingOptions, action.pageViewId)),
            this.store.pipe(select(fromPfDataGridReducer.getSortDescriptor, action.pageViewId)),
            this.store.pipe(select(fromPfDataGridReducer.getGridConfig)),
            this.store.pipe(select(fromPfDataGridReducer.getData)),
            this.store.pipe(select(fromSharedReducer.getCurrentRangeGroup)),
            this.store.pipe(select(fromSharedReducer.getMetadata)),
            this.store.pipe(select(fromSharedReducer.getRoundingSettings)),
            this.store.pipe(select(fromSharedReducer.getComparingModels)),
            (a: fromCompareJobRangesActions.GetDataForCompare, baseEntity, fields, pagingOptions, sortDescriptor, gridConfig, gridData,
             currentRangeGroup, metadata, roundingSettings, comparingFlag) =>
              ({ a, baseEntity, fields, pagingOptions, sortDescriptor, gridConfig, gridData, currentRangeGroup, metadata, roundingSettings, comparingFlag }))
        )
      ),
      switchMap((data) => {
        if (!data.comparingFlag) {
          return of(new fromCompareJobRangesActions.NoOperationAction());
        } else {
          const compareFilters = CompareJobRangesHelper.createDataFiltersForCompareRanges(data.currentRangeGroup.obj.CompanyStructuresRangeGroupId);
          const pagingOptions: PagingOptions = {
            From: data.pagingOptions.From,
            Count: data.pagingOptions.Count
          };
          if (data.a.type.includes('Get Data For Compare')) {
            pagingOptions.From = 0;
            pagingOptions.Count = data.pagingOptions.Count;
          }
          return this.dataViewApiService.getData(DataGridToDataViewsHelper.buildDataViewDataRequest(
            data.baseEntity.Id,
            data.fields,
            compareFilters,
            pagingOptions,
            data.sortDescriptor,
            false,
            false,
          )).pipe(
            mergeMap((res) => {
              const actions = [];
              if (data.currentRangeGroup.obj.Currency !== data.metadata.Currency || data.currentRangeGroup.obj.Rate !== data.metadata.Rate) {
                if (data.a.type.includes('Load More Data')) {
                  actions.push(new fromCompareJobRangesActions.AppendConvertCurrencyAndRate(
                    {
                      OldCurrency: data.currentRangeGroup.obj.Currency,
                      NewCurrency: data.metadata.Currency,
                      OldRate: data.currentRangeGroup.obj.Rate,
                      NewRate: data.metadata.Rate,
                      Rounding: data.roundingSettings,
                      RangeDistributionTypeId: data.metadata.RangeDistributionTypeId,
                      JobRangeData: res
                    }
                  ));
                } else {
                  actions.push(new fromCompareJobRangesActions.ConvertCurrencyAndRate(
                    {
                      OldCurrency: data.currentRangeGroup.obj.Currency,
                      NewCurrency: data.metadata.Currency,
                      OldRate: data.currentRangeGroup.obj.Rate,
                      NewRate: data.metadata.Rate,
                      Rounding: data.roundingSettings,
                      RangeDistributionTypeId: data.metadata.RangeDistributionTypeId,
                      JobRangeData: res
                    }
                  ));
                }
              } else {
                if (data.a.type.includes('Load More Data')) {
                  actions.push(new fromCompareJobRangesActions.LoadMoreCompareDataSuccess(res));
                } else {
                  actions.push(new fromCompareJobRangesActions.GetDataForCompareSuccess(res));
                }
              }
              return actions;
            }),
            catchError((err) => of(new fromCompareJobRangesActions.GetDataForCompareError(err)))
          );
        }})
    );


  @Effect()
  convertJobRangeData: Observable<Action> = this.actions$
    .pipe(
      ofType(
        fromCompareJobRangesActions.CONVERT_CURRENCY_AND_RATE,
        fromCompareJobRangesActions.APPEND_CONVERT_CURRENCY_AND_RATE
      ),
      switchMap((action: fromCompareJobRangesActions.ConvertCurrencyAndRate) => {
        return this.structureModelingApiService.convertCurrencyAndRate(action.payload)
          .pipe(
            map((res) => {
              if (action.type.includes('Append')) {
                return new fromCompareJobRangesActions.AppendConvertCurrencyAndRateSuccess(res);
              } else {
                return new fromCompareJobRangesActions.ConvertCurrencyAndRateSuccess(res);
              }
            }),
            catchError((err) => of(new fromCompareJobRangesActions.ConvertCurrencyAndRateError(err)))
          );
      })
    );

}
