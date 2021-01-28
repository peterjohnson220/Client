import { Injectable } from '@angular/core';

import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { switchMap, map, catchError } from 'rxjs/operators';

import { StructureRangeGroupApiService } from 'libs/data/payfactors-api/structures';

import * as fromSharedGradeBasedRangeActions from '../actions/shared.actions';
import * as fromSharedGradeBasedReducer from '../reducers';

@Injectable()
export class SharedEffects {

  @Effect()
  getCurrentRangeGroup: Observable<Action> = this.actions$
    .pipe(
      ofType(fromSharedGradeBasedRangeActions.GET_GRADE_RANGE_DETAILS),
      switchMap((action: fromSharedGradeBasedRangeActions.GetGradeRangeDetails) => {
        return this.structureRangeGroupApiService.getDetails(action.payload)
          .pipe(
            map((res) => {
              return new fromSharedGradeBasedRangeActions.GetGradeRangeDetailsSuccess(res);
            }),
            catchError((err) => of(new fromSharedGradeBasedRangeActions.GetGradeRangeDetailsError(err)))
          );
      })
    );

  constructor(
    private actions$: Actions,
    private store: Store<fromSharedGradeBasedReducer.State>,
    private structureRangeGroupApiService: StructureRangeGroupApiService
  ) {
  }
}
