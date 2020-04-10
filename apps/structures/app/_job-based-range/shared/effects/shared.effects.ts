import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, switchMap, mergeMap, map } from 'rxjs/operators';

import { StructureModelingApiService } from 'libs/data/payfactors-api/structures';
import * as pfDataGridActions from 'libs/features/pf-data-grid/actions';

import * as fromSharedActions from '../actions/shared.actions';
import * as fromSharedReducer from '../reducers';
import { PageViewIds } from '../constants/page-view-ids';
import { ModelDataColumns, ModelGridColumns } from '../constants/model-grid-mappings';
import { PayfactorsApiModelMapper } from '../helpers/payfactors-api-model-mapper';
import { Pages } from '../constants/pages';

@Injectable()
export class SharedEffects {
  @Effect()
  updateMid$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromSharedActions.UPDATE_MID),
      switchMap((action: fromSharedActions.UpdateMid) => {
          return this.structureModelingApiService.recalculateRangeMinMax(PayfactorsApiModelMapper.mapUpdateRangeInputToRecalcAndSaveRangeMinMaxRequest(
            action.payload.RangeGroupId, action.payload.RangeId, action.payload.Mid, action.payload.RowIndex)).pipe(
            mergeMap((response) => {
              const actions = [];
              actions.push(new pfDataGridActions.UpdateRow(PageViewIds.Model, response.RowIndex,
                [{gridName: ModelGridColumns.Min, dataName: ModelDataColumns.Min},
                  {gridName: ModelGridColumns.Max, dataName: ModelDataColumns.Max},
                  {gridName: ModelGridColumns.Mid, dataName: ModelDataColumns.Mid}], response.Range));

              if (action.payload.Page === Pages.Employees) {
                actions.push(new pfDataGridActions.LoadData(PageViewIds.Employees));
              }
              return actions;
            }),
            catchError(response => of(new fromSharedActions.UpdateMidError()))
          );
        }
      ));

  @Effect()
  recalculateRangesWithoutMid$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromSharedActions.RECALCULATE_RANGES_WITHOUT_MID),
      switchMap((action: fromSharedActions.RecalculateRangesWithoutMid) => {
          return this.structureModelingApiService.recalculateRangesWithoutMid(action.payload.rangeGroupId).pipe(
            map(() => {
              return new pfDataGridActions.LoadData(PageViewIds.Model);
            })
          );
        }
      ));

  constructor(
    private actions$: Actions,
    private structureModelingApiService: StructureModelingApiService,
    private router: Router,
    private store: Store<fromSharedReducer.State>
  ) {
  }
}
