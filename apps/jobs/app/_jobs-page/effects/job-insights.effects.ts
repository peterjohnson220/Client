import { Injectable } from '@angular/core';

import { Actions, Effect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import { JobsApiService, LoaderFieldMappingsApiService } from 'libs/data/payfactors-api';
import { GenericKeyValue } from 'libs/models/common';

import * as fromJobInsightsActions from '../actions/job-insights.actions';

@Injectable()
export class JobInsightsEffects {

  constructor(
    private actions$: Actions,
    private jobsApiService: JobsApiService,
    private loaderFieldMappingsApiService: LoaderFieldMappingsApiService
  ) {}

  @Effect()
  getJobInsights$ = this.actions$
    .pipe(
      ofType(fromJobInsightsActions.LOAD_JOB_INSIGHTS),
      switchMap((action: fromJobInsightsActions.LoadJobInsights) => {
        return this.jobsApiService.getJobInsights(action.payload)
          .pipe(
            map((response) => new fromJobInsightsActions.LoadJobInsightsSuccess(response)),
            catchError(() => of(new fromJobInsightsActions.LoadJobInsightsError()))
          );
      })
    );

  @Effect()
  loadCustomJobFields$ = this.actions$
    .pipe(
      ofType(fromJobInsightsActions.LOAD_CUSTOM_JOB_FIELDS),
      switchMap((action: fromJobInsightsActions.LoadCustomJobFields) => {
        return this.loaderFieldMappingsApiService.getCustomJobFields(action.payload.companyId)
          .pipe(
            map((response) => {
              const udfFields: GenericKeyValue<string, string>[] = response.map(k => {
                return {
                  Key: k.Key.replace('Name', ''),
                  Value: k.Value
                };
              });
              return new fromJobInsightsActions.LoadCustomJobFieldsSuccess(udfFields);
            }),
            catchError(() => of(new fromJobInsightsActions.LoadCustomJobFieldsError()))
          );
      })
    );
}

