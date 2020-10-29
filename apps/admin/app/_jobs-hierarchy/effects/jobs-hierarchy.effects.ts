import { Injectable } from '@angular/core';

import { Actions, Effect, ofType } from '@ngrx/effects';
import { switchMap, map, catchError, mergeMap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { Action } from '@ngrx/store';

import { JobLevelHierarchy, JobLevelHierarchyDetail } from 'libs/models';
import { NotificationLevel, NotificationSource, NotificationType } from 'libs/features';
import { CompanyJobApiService, JobLevelHierarchyApiService } from 'libs/data/payfactors-api/company';
import * as fromNotificationActions from 'libs/features/app-notifications/actions/app-notifications.actions';

import * as fromJobsHierarchyActions from '../actions/jobs-hierarchy.actions';

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
    getJobLevels$: Observable<Action> = this.actions$
      .pipe(
        ofType(fromJobsHierarchyActions.GET_AVAILABLE_JOB_LEVELS),
        switchMap((action: fromJobsHierarchyActions.GetAvailableJobLevels) =>
          this.jobLevelHierarchyApiService.getAvailableJobLevels(action.payload.hierarchyId, action.payload.selectedJobFamilies).pipe(
            map((res: any) => {
              return new fromJobsHierarchyActions.GetAvailableJobLevelsSuccess(res);
            }),
            catchError(error => of(new fromJobsHierarchyActions.GetAvailableJobLevelsError(error)))
          )
        )
      );

    @Effect()
    saveJobLevelHierarchies$: Observable<Action> = this.actions$
      .pipe(
        ofType(fromJobsHierarchyActions.SAVE_JOB_LEVEL_HIERARCY),
        switchMap(
          (action: fromJobsHierarchyActions.SaveJobLevelHierarchy) =>
            this.jobLevelHierarchyApiService.createJobLevelHierarchy(action.payload.jobLevelHierarchy)
              .pipe(
                mergeMap((response) =>
                  [
                    new fromNotificationActions.AddNotification({
                      EnableHtml: true,
                      From: NotificationSource.GenericNotificationMessage,
                      Level: NotificationLevel.Success,
                      NotificationId: '',
                      Payload: { Title: 'Hierarchy', Message: `${response.HierarchyName} has been ${response.Created ? 'Saved' : 'Updated'}` },
                      Type: NotificationType.Event
                    }),
                    new fromJobsHierarchyActions.SaveJobLevelHierarchySuccess(),
                    new fromJobsHierarchyActions.GetJobLevelHierarchySuccess(response),
                    new fromJobsHierarchyActions.GetJobLevelHierarchies()
                  ]),
                catchError(error => of(new fromJobsHierarchyActions.SaveJobLevelHierarchyError(error)))
              )
        )
      );

    @Effect()
    getJobLevelHierachies$: Observable<Action> = this.actions$
      .pipe(
        ofType(fromJobsHierarchyActions.GET_JOB_LEVEL_HIERARCHIES),
        switchMap((action: fromJobsHierarchyActions.GetJobLevelHierarchies) =>
          this.jobLevelHierarchyApiService.getJobLevelHierachies().pipe(
            map((result: JobLevelHierarchy[]) => {
              return new fromJobsHierarchyActions.GetJobLevelHierarchiesSuccess(result);
            }),
            catchError(error => of(new fromJobsHierarchyActions.GetJobLevelHierarchiesError(error)))
          )
        )
      );

      @Effect()
      getJobLevelHierachy$: Observable<Action> = this.actions$
        .pipe(
          ofType(fromJobsHierarchyActions.GET_JOB_LEVEL_HIERARCHY),
          switchMap((action: fromJobsHierarchyActions.GetJobLevelHierarchy) =>
            this.jobLevelHierarchyApiService.getJobLevelHierachy(action.payload.hierarchyId).pipe(
              mergeMap((result: JobLevelHierarchyDetail) => [
                new fromJobsHierarchyActions.GetJobLevelHierarchySuccess(result),
                new fromJobsHierarchyActions.GetAvailableJobLevels({ selectedJobFamilies: result.JobFamilies, hierarchyId: result.HierarchyId })
              ]),
              catchError(error => of(new fromJobsHierarchyActions.GetJobLevelHierarchyError(error)))
            )
          )
        );

  constructor(
    private actions$: Actions,
    private companyJobApiService: CompanyJobApiService,
    private jobLevelHierarchyApiService: JobLevelHierarchyApiService
  ) {}
}
