import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

import { Actions, Effect, ofType } from '@ngrx/effects';
import { switchMap, map, catchError, withLatestFrom, mergeMap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { Store, select, Action } from '@ngrx/store';

import { JobDescriptionApiService } from 'libs/data/payfactors-api/jdm';
import { PageRedirectUrl } from 'libs/models/url-redirect/page-redirect-url';
import { JobMatchResult } from 'libs/features/jobs/job-description-management/';
import { PayfactorsApiModelMapper } from 'libs/features/jobs/job-description-management/helpers';
import * as fromFeatureFlagRedirectReducer from 'libs/state/state';
import { UrlPage } from 'libs/models/url-redirect/url-page';
import { UrlRedirectHelper } from 'libs/core/helpers/url-redirect-helper';

import * as fromJobDescriptionManagement from '../reducers';
import * as fromJobMatchesActions from '../actions/job-matches.actions';


@Injectable()
export class JobMatchesEffects {

  @Effect()
  getJobMatches$ = this.actions$
    .pipe(
      ofType(fromJobMatchesActions.GET_JOB_MATCHES),
      switchMap((action: fromJobMatchesActions.GetJobMatches) => {
        return this.jobDescriptionApiService.getJobMatches(action.payload.jobDescriptionId)
          .pipe(
            map((response) => {
              const jobMatches: JobMatchResult[] = PayfactorsApiModelMapper.mapJobMatchResultResponsesToJobMatchResults(response);
              return new fromJobMatchesActions.GetJobMatchesSuccess(jobMatches);
            }),
            catchError((error: HttpErrorResponse) => {
              if (error.status === 403) {
                return of(new fromJobMatchesActions.GetJobMatchesForbidden());
              } else {
                return of(new fromJobMatchesActions.GetJobMatchesError());
              }
            })
          );
      })
    );

  @Effect()
  createProject$ = this.actions$
    .pipe(
      ofType(fromJobMatchesActions.CREATE_PROJECT),
      withLatestFrom(
        this.store.pipe(select(fromJobDescriptionManagement.getJobMatchesAsync)),
        (action: fromJobMatchesActions.CreateProject, jobMatchesAsync) => ({ action, jobMatchesAsync })
      ),
      switchMap((data) => {
        const surveyJobIds = data.jobMatchesAsync.obj
          .filter(x => x.Selected === true && x.IsSurvey === true)
          .map(x => x.Id);
        const payfactorsJobIds = data.jobMatchesAsync.obj
          .filter(x => x.Selected === true && x.IsSurvey === false)
          .map(x => x.Id);
        return this.jobDescriptionApiService.createProjectFromMatches(data.action.payload.jobDescriptionId, surveyJobIds, payfactorsJobIds)
          .pipe(
            map((userSessionId) => new fromJobMatchesActions.CreateProjectSuccess({ userSessionId })),
            catchError(() => of(new fromJobMatchesActions.CreateProjectError()))
          );
      })
    );

@Effect()
  createProjectSuccess$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromJobMatchesActions.CREATE_PROJECT_SUCCESS),
      withLatestFrom(
        this.store.select(fromFeatureFlagRedirectReducer.getPageRedirectUrl, {page: UrlPage.PricingProject}),
        (action: fromJobMatchesActions.CreateProjectSuccess, redirectUrl: string) => ({action, redirectUrl})
      ),
      mergeMap((data: any) => {
        window.location.href = UrlRedirectHelper.getIdParamUrl(data.redirectUrl, data.action.payload.userSessionId);

        return [];
      })
    );

  constructor(
    private actions$: Actions,
    private store: Store<fromJobDescriptionManagement.State>,
    private jobDescriptionApiService: JobDescriptionApiService
  ) {}
}
