import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { switchMap, map, catchError, filter } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { Action } from '@ngrx/store';

import { CompanyJobApiService } from 'libs/data/payfactors-api/company';

import * as fromJobsHierarchyActions from '../actions/jobs-hierarchy.actions';
import { PayfactorsApiParameterMapper } from '../helpers';
import { response } from 'express';

@Injectable()
export class JobsHierarchyEffects {

  @Effect()
  getJobFamilies$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromJobsHierarchyActions.GET_JOB_FAMILIES),
      switchMap((action: fromJobsHierarchyActions.GetJobFamilies) =>
        this.companyJobApiService.getJobFamilies().pipe(
          map((res: any) => {
            return new fromJobsHierarchyActions.GetJobFamiliesSuccess(res);
          }),
          catchError(error => of(new fromJobsHierarchyActions.GetJobFamiliesError(error)))
        )
      )
    );

  @Effect()
  setNewFamilySelection$ = this.actions$
    .pipe(
      ofType(fromJobsHierarchyActions.SET_NEW_FAMILY_SELECTION),
      switchMap((action: fromJobsHierarchyActions.SetJobFamilySelection) => {
        const request = PayfactorsApiParameterMapper.mapSelectedJobFamiliesToJobFamilyList(action.payload);
        return this.companyJobApiService.getJobLevelsForJobFamilies(request)
          .pipe(
            map((res) => {
              return new fromJobsHierarchyActions.GetJobLevelsForJobFamiliesSuccess(res);
            }),
            catchError((err) => of(new fromJobsHierarchyActions.GetJobLevelsForJobFamiliesError(err)))
          );
      })
    );

  constructor(
    private actions$: Actions,
    private companyJobApiService: CompanyJobApiService
  ) {}
}
