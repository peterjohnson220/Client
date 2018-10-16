import { Injectable } from '@angular/core';

import { Action } from '@ngrx/store';
import { Effect, Actions } from '@ngrx/effects';

import { Observable, of } from 'rxjs';
import { switchMap, catchError, map} from 'rxjs/operators';

import { CommunityJobApiService } from 'libs/data/payfactors-api/community/community-job-api.service';

import { CommunityJob } from 'libs/models/community';
import * as fromCommunityJobActions from '../actions/community-job.actions';

@Injectable()
export class CommunityJobEffects {

  @Effect()
  submittingCommunityJob$: Observable<Action> = this.actions$
    .ofType(fromCommunityJobActions.SUBMITTING_COMMUNITY_JOB).pipe(
      switchMap((action: fromCommunityJobActions.SubmittingCommunityJob) =>
        this.communityJobService.submitCommunityJob(action.payload).pipe(
          map((communityJob: CommunityJob) => {
            return new fromCommunityJobActions.SubmittingCommunityJobSuccess(communityJob);
          }),
          catchError(error => of(new fromCommunityJobActions.SubmittingCommunityJobError()))
        )
      )
    );

  @Effect()
  loadingCommunityJobs$: Observable<Action> = this.actions$
    .ofType(fromCommunityJobActions.GETTING_COMMUNITY_JOBS).pipe(
      switchMap(() =>
        this.communityJobService.getJobs().pipe(
          map((communityJobs: CommunityJob[]) => {
            return new fromCommunityJobActions.GettingCommunityJobsSuccess(communityJobs);
          }),
          catchError(error => of(new fromCommunityJobActions.GettingCommunityJobsError()))
        )
      )
    );

  constructor(
    private actions$: Actions,
    private communityJobService: CommunityJobApiService,
  ) {}
}
