import { Injectable } from '@angular/core';

import { Action } from '@ngrx/store';
import { Effect, Actions, ofType } from '@ngrx/effects';

import { Observable, of } from 'rxjs';
import { switchMap, catchError, map} from 'rxjs/operators';

import { CommunityJobApiService } from 'libs/data/payfactors-api/community/community-job-api.service';
import { CommunityJob} from 'libs/models/community';

import * as fromCommunityJobActions from '../actions/community-job.actions';
import { CommunityJobEffectsService } from '../services/community-job-effects-service';


@Injectable()
export class CommunityJobEffects {

  @Effect()
  submittingCommunityJob$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromCommunityJobActions.SUBMITTING_COMMUNITY_JOB),
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
  loadingCommunityJobs$ = this.communityJobEffectsService.searchCompanyJobs(
    this.actions$.pipe(ofType(fromCommunityJobActions.GETTING_COMMUNITY_JOBS))
  );

  @Effect()
  getMoreCompanyJobs$ = this.communityJobEffectsService.searchCompanyJobs(
    this.actions$.pipe(ofType(fromCommunityJobActions.GETTING_MORE_COMMUNITY_JOBS))
  );

  @Effect()
  getBackToTopCompanyJobs$ = this.communityJobEffectsService.searchCompanyJobs(
    this.actions$.pipe(ofType(fromCommunityJobActions.GETTING_BACK_TO_TOP_COMMUNITY_JOBS))
  );

  @Effect()
  deletingCommunityJob$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromCommunityJobActions.DELETING_COMMUNITY_JOB),
      switchMap((action: fromCommunityJobActions.DeletingCommunityJob) =>
        this.communityJobService.updateJobDeletedFlag({ jobId: action.payload }).pipe(
          map(() => {
            return new fromCommunityJobActions.DeletingCommunityJobSuccess(action.payload);
          }),
          catchError(error => of(new fromCommunityJobActions.DeletingCommunityJobError()))
        )
      )
    );


  constructor(
    private actions$: Actions,
    private communityJobService: CommunityJobApiService,
    private communityJobEffectsService: CommunityJobEffectsService
  ) {}
}
