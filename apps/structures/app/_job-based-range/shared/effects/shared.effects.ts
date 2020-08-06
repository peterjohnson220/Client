import { Injectable } from '@angular/core';

import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, select, Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { switchMap, map, mergeMap, catchError, withLatestFrom } from 'rxjs/operators';

import { StructureModelingApiService } from 'libs/data/payfactors-api/structures';
import * as pfDataGridActions from 'libs/features/pf-data-grid/actions';
import * as fromPfDataGridActions from 'libs/features/pf-data-grid/actions';

import * as fromSharedActions from '../actions/shared.actions';
import { PayfactorsApiModelMapper } from '../helpers/payfactors-api-model-mapper';
import { RangeGroupMetadata } from '../models';
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
              map(() => {
                const modelPageViewId = PagesHelper.getModelPageViewIdByRangeDistributionType(data.metadata.RangeDistributionTypeId);
                return new pfDataGridActions.LoadData(modelPageViewId);
              })
            );
        }
      ));

  @Effect()
  removeRange$: Observable<Action> = this.actions$.pipe(
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
          this.structureModelingApiService.getOverriddenRangeIds(action.payload.rangeGroupId)
            .pipe(
              mergeMap((response) =>
                [
                  new fromSharedActions.GetOverriddenRangesSuccess(),
                  new fromPfDataGridActions.UpdateModifiedKeys(action.payload.pageViewId, response)
                ]),
              catchError(error => of(new fromSharedActions.GetOverriddenRangesError(error)))
            )
      )
    );

  constructor(
    private actions$: Actions,
    private store: Store<fromSharedReducer.State>,
    private structureModelingApiService: StructureModelingApiService
  ) {
  }
}
