import { Injectable } from '@angular/core';

import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { switchMap, map, catchError } from 'rxjs/operators';

import { StructureRangeGroupApiService } from 'libs/data/payfactors-api';

import { PayfactorsApiModelMapper } from '../helpers';
import * as fromJobsToGradeActions from '../actions/jobs-to-grade.actions';
import * as fromJobsToGradeReducer from '../reducers';

@Injectable()
export class JobsToGradeEffects {

  @Effect()
  getGrades$ = this.actions$
    .pipe(
      ofType(fromJobsToGradeActions.GET_GRADES),
      map((action: fromJobsToGradeActions.GetGrades) => action.payload),
      switchMap((details) => {
        return this.structureRangeGroupApiService.getGrades(details.RangeGroupId, details.Intercept, details.Slope, details.RoundDecimals).pipe(
            map(response => new fromJobsToGradeActions.GetGradesSuccess(
              PayfactorsApiModelMapper.mapGradesResponseToGrades(response, details.RangeGroupId))
            ),
            catchError(() => of(new fromJobsToGradeActions.GetGradesError()))
          );
        }
      )
    );

  @Effect()
  getGradeJobs$ = this.actions$
    .pipe(
      ofType(fromJobsToGradeActions.GET_GRADE_JOBS),
      map((action: fromJobsToGradeActions.GetGradeJobs) => action.payload),
      switchMap((payload) => {
          return this.structureRangeGroupApiService.getJobs(payload.CompanyStructuresRangeGroupId,
            payload.CompanyStructuresGradesId).pipe(
            map(response => new fromJobsToGradeActions.GetGradeJobsSuccess(
              PayfactorsApiModelMapper.mapGradeJobsResponseToGradeJobs(response, payload.CompanyStructuresGradesId))
            ),
            catchError(() => of(new fromJobsToGradeActions.GetGradeJobsError(
              { CompanyStructuresGradesId: payload.CompanyStructuresGradesId, GradeJobs: [] })))
          );
        }
      )
    );



    constructor(
      private actions$: Actions,
      private structureRangeGroupApiService: StructureRangeGroupApiService,
      private store: Store<fromJobsToGradeReducer.State>
  ) {}
}
