import { Injectable } from '@angular/core';

import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, select, Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, switchMap, mergeMap, map, withLatestFrom } from 'rxjs/operators';

import { StructureModelingApiService } from 'libs/data/payfactors-api/structures';
import { DataViewApiService } from 'libs/data/payfactors-api/reports';
import { DataGridToDataViewsHelper } from 'libs/features/pf-data-grid/helpers';
import * as pfDataGridActions from 'libs/features/pf-data-grid/actions';
import * as fromPfDataGridReducer from 'libs/features/pf-data-grid/reducers';
import * as fromPfDataGridActions from 'libs/features/pf-data-grid/actions';
import { DataViewFilter } from 'libs/models/payfactors-api/reports/request';

import * as fromSharedActions from '../actions/shared.actions';
import * as fromSharedReducer from '../reducers';
import { PageViewIds } from '../constants/page-view-ids';
import { PayfactorsApiModelMapper } from '../helpers/payfactors-api-model-mapper';
import { Pages } from '../constants/pages';

@Injectable()
export class SharedEffects {
  @Effect()
  updateMid$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromSharedActions.UPDATE_MID),
      switchMap(
        (action: fromSharedActions.UpdateMid) =>
          this.structureModelingApiService.recalculateRangeMinMax(PayfactorsApiModelMapper.mapUpdateRangeInputToRecalcAndSaveRangeMinMaxRequest(
            action.payload.RangeGroupId,
            action.payload.RangeId,
            action.payload.Mid,
            action.payload.RowIndex,
            action.payload.RoundingSettings))
        .pipe(
          mergeMap((response) => {
            const actions = [];

            actions.push(new fromSharedActions.UpdateMidSuccess({ rangeId: action.payload.RangeId, rowIndex: action.payload.RowIndex }));

            if (action.payload.Page === Pages.Employees) {
              actions.push(new pfDataGridActions.LoadData(PageViewIds.Employees));
            }
            return actions;
          }),
          catchError(() => of(new fromSharedActions.UpdateMidError()))
        )
      )
    );

  @Effect()
  updateMidSuccess$ = this.actions$
    .pipe(
      ofType(fromSharedActions.UPDATE_MID_SUCCESS),
      withLatestFrom(
        this.store.pipe(select(fromPfDataGridReducer.getBaseEntity, PageViewIds.Model)),
        this.store.pipe(select(fromPfDataGridReducer.getFields, PageViewIds.Model)),
        this.store.pipe(select(fromPfDataGridReducer.getPagingOptions, PageViewIds.Model)),
        this.store.pipe(select(fromPfDataGridReducer.getSortDescriptor, PageViewIds.Model)),
        this.store.pipe(select(fromPfDataGridReducer.getApplyDefaultFilters, PageViewIds.Model)),
        (action: fromSharedActions.UpdateMidSuccess, baseEntity, fields, pagingOptions, sortDescriptor, applyDefaultFilters) =>
          ({ action, baseEntity, fields, pagingOptions, sortDescriptor, applyDefaultFilters })
      ),
      switchMap((data) => {
        const filter: DataViewFilter = {
          EntitySourceName: 'CompanyStructures_Ranges',
          SourceName: 'CompanyStructuresRanges_ID',
          Operator: '=',
          Values: [data.action.payload.rangeId.toString()]
        };

        return this.dataViewApiService.getData(DataGridToDataViewsHelper.buildDataViewDataRequest(
          data.baseEntity.Id,
          data.fields,
          [...DataGridToDataViewsHelper.mapFieldsToFiltersUseValuesProperty(data.fields), filter],
          { From: 0, Count: 1},
          data.sortDescriptor,
          false,
          false
        )).pipe(
          map((response) => new fromPfDataGridActions.UpdateRow(PageViewIds.Model, data.action.payload.rowIndex, response[0]))
        );
      })
    );

  @Effect()
  recalculateRangesWithoutMid$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromSharedActions.RECALCULATE_RANGES_WITHOUT_MID),
      switchMap((action: fromSharedActions.RecalculateRangesWithoutMid) => {
          return this.structureModelingApiService.recalculateRangesWithoutMid(
            PayfactorsApiModelMapper.mapRecalculateRangesWithoutMidInputToRecalculateRangesWithoutMidRequest(
              action.payload.rangeGroupId, action.payload.rounding))
            .pipe(
            map(() => {
              return new pfDataGridActions.LoadData(PageViewIds.Model);
            })
          );
        }
      ));

  constructor(
    private actions$: Actions,
    private structureModelingApiService: StructureModelingApiService,
    private store: Store<fromSharedReducer.State>,
    private dataViewApiService: DataViewApiService
  ) {
  }
}
