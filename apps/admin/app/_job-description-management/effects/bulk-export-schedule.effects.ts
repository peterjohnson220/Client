import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Effect, Actions } from '@ngrx/effects';
import { catchError, map, switchMap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

import * as fromJdmBulkExportScheduleActions from '../actions/bulk-export-schedule.actions';
import { JobDescriptionApiService } from 'libs/data/payfactors-api/jdm';
import { BulkExportSchedule } from 'libs/models/jdm';

@Injectable()
export class JdmBulkExportScheduleEffects {

  @Effect()
  loadSchedules$: Observable<Action> = this.actions$
    .ofType(fromJdmBulkExportScheduleActions.LOADING_SCHEDULE).pipe(
      switchMap(() =>
        this.jobDescriptionApiService.getSchedules().pipe(
          map((schedules: BulkExportSchedule[]) => new fromJdmBulkExportScheduleActions.LoadingSchedulesSuccess(schedules)),
          catchError(error => of(new fromJdmBulkExportScheduleActions.LoadingSchedulesError(error)))
        )
      )
    );

  @Effect()
  addSchedule$: Observable<Action> = this.actions$
    .ofType(fromJdmBulkExportScheduleActions.ADDING_SCHEDULE).pipe(
      map((action: fromJdmBulkExportScheduleActions.AddingSchedule) => action.payload),
      switchMap((payload) => {
        return this.jobDescriptionApiService.addSchedule(payload).pipe(
          map(() => {
            return new fromJdmBulkExportScheduleActions.AddingScheduleSuccess;
          }),
          catchError(error => of(new fromJdmBulkExportScheduleActions.AddingScheduleError()))
        );
      })
    );

  @Effect()
  addScheduleSuccess$: Observable<Action> = this.actions$
    .ofType(fromJdmBulkExportScheduleActions.ADDING_SCHEDULE_SUCCESS).pipe(
      switchMap(() =>
        this.jobDescriptionApiService.getSchedules().pipe(
          map((schedules: BulkExportSchedule[]) => new fromJdmBulkExportScheduleActions.LoadingSchedulesSuccess(schedules)),
          catchError(error => of(new fromJdmBulkExportScheduleActions.LoadingSchedulesError(error)))
        )
      )
    );

  @Effect()
  removeSchedule$: Observable<Action> = this.actions$
    .ofType(fromJdmBulkExportScheduleActions.REMOVING_SCHEDULE).pipe(
      map((action: fromJdmBulkExportScheduleActions.RemovingSchedule) => action.payload),
      switchMap((payload) => {
        return this.jobDescriptionApiService.removeSchedule(payload).pipe(
          map(() => {
            return new fromJdmBulkExportScheduleActions.RemovingScheduleSuccess;
          }),
          catchError(error => of(new fromJdmBulkExportScheduleActions.RemovingScheduleError()))
        );
      })
    );

  @Effect()
  removeScheduleSuccess$: Observable<Action> = this.actions$
    .ofType(fromJdmBulkExportScheduleActions.REMOVING_SCHEDULE_SUCCESS).pipe(
      switchMap(() =>
        this.jobDescriptionApiService.getSchedules().pipe(
          map((schedules: BulkExportSchedule[]) => new fromJdmBulkExportScheduleActions.LoadingSchedulesSuccess(schedules)),
          catchError(error => of(new fromJdmBulkExportScheduleActions.LoadingSchedulesError(error)))
        )
      )
    );

  constructor(
    private actions$: Actions,
    private jobDescriptionApiService: JobDescriptionApiService
  ) {}
}
