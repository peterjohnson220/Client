import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { catchError, map, switchMap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

import { JobDescriptionApiService } from 'libs/data/payfactors-api/jdm';
import { BulkExportSchedule } from 'libs/models/jdm';

import * as fromBulkJobsExportScheduleActions from '../actions/bulk-export-schedule.actions';

@Injectable()
export class BulkJobsExportScheduleEffects {

  @Effect()
  loadSchedules$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromBulkJobsExportScheduleActions.LOADING_SCHEDULE),
      switchMap(() =>
        this.jobDescriptionApiService.getSchedules().pipe(
          map((schedules: BulkExportSchedule[]) => new fromBulkJobsExportScheduleActions.LoadingSchedulesSuccess(schedules)),
          catchError(error => of(new fromBulkJobsExportScheduleActions.LoadingSchedulesError(error)))
        )
      )
    );

  @Effect()
  addSchedule$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromBulkJobsExportScheduleActions.ADDING_SCHEDULE),
      map((action: fromBulkJobsExportScheduleActions.AddingSchedule) => action.payload),
      switchMap((payload) => {
        return this.jobDescriptionApiService.addSchedule(payload).pipe(
          map(() => {
            return new fromBulkJobsExportScheduleActions.AddingScheduleSuccess;
          }),
          catchError(error => of(new fromBulkJobsExportScheduleActions.AddingScheduleError()))
        );
      })
    );

  @Effect()
  addScheduleSuccess$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromBulkJobsExportScheduleActions.ADDING_SCHEDULE_SUCCESS),
      switchMap(() =>
        this.jobDescriptionApiService.getSchedules().pipe(
          map((schedules: BulkExportSchedule[]) => new fromBulkJobsExportScheduleActions.LoadingSchedulesSuccess(schedules)),
          catchError(error => of(new fromBulkJobsExportScheduleActions.LoadingSchedulesError(error)))
        )
      )
    );

  @Effect()
  removeSchedule$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromBulkJobsExportScheduleActions.REMOVING_SCHEDULE),
      map((action: fromBulkJobsExportScheduleActions.RemovingSchedule) => action.payload),
      switchMap((payload) => {
        return this.jobDescriptionApiService.removeSchedule(payload).pipe(
          map(() => {
            return new fromBulkJobsExportScheduleActions.RemovingScheduleSuccess;
          }),
          catchError(error => of(new fromBulkJobsExportScheduleActions.RemovingScheduleError()))
        );
      })
    );

  @Effect()
  removeScheduleSuccess$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromBulkJobsExportScheduleActions.REMOVING_SCHEDULE_SUCCESS),
      switchMap(() =>
        this.jobDescriptionApiService.getSchedules().pipe(
          map((schedules: BulkExportSchedule[]) => new fromBulkJobsExportScheduleActions.LoadingSchedulesSuccess(schedules)),
          catchError(error => of(new fromBulkJobsExportScheduleActions.LoadingSchedulesError(error)))
        )
      )
    );

  constructor(
    private actions$: Actions,
    private jobDescriptionApiService: JobDescriptionApiService
  ) {}
}
