import { Injectable } from '@angular/core';

import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { switchMap, map, mergeMap, catchError } from 'rxjs/operators';

import { StructureModelingApiService } from 'libs/data/payfactors-api/structures';
import * as pfDataGridActions from 'libs/features/pf-data-grid/actions';

import * as fromSharedActions from '../actions/shared.actions';
import { PageViewIds } from '../constants/page-view-ids';
import { PayfactorsApiModelMapper } from '../helpers/payfactors-api-model-mapper';

@Injectable()
export class SharedEffects {

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

  @Effect()
  removeRange$: Observable<Action> = this.actions$.pipe(
    ofType(fromSharedActions.REMOVING_RANGE),
    switchMap((data: any) => {
      return this.structureModelingApiService.removeRange(data.payload).pipe(
        mergeMap(() =>
          [
            new fromSharedActions.RemovingRangeSuccess(),
            new pfDataGridActions.ClearSelections(PageViewIds.Model, [data.payload]),
            new pfDataGridActions.LoadData(PageViewIds.Model),
          ]),
        catchError(error => of(new fromSharedActions.RemovingRangeError(error)))
      );
    })
  );

  constructor(
    private actions$: Actions,
    private structureModelingApiService: StructureModelingApiService
  ) {
  }
}
