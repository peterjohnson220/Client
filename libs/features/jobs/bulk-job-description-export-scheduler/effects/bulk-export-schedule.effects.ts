import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { catchError, map, switchMap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

import { JobDescriptionApiService } from 'libs/data/payfactors-api/jdm';
import { PayfactorsApiService } from 'libs/data/payfactors-api/payfactors-api.service';
import { BulkExportHistory, BulkExportSchedule } from 'libs/models/jdm';
import { BaseUrlLocation } from 'libs/models/payfactors-api/common/base-url-location.enum';

import * as fromBulkJobsExportScheduleActions from '../actions/bulk-export-schedule.actions';
import { OutboundJobsApiService } from 'libs/data/payfactors-api';

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
          map((scheduleId) => {
            return new fromBulkJobsExportScheduleActions.AddingScheduleSuccess(scheduleId);
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

  @Effect()
  updateSchedule$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromBulkJobsExportScheduleActions.UPDATE_SCHEDULE),
      map((action: fromBulkJobsExportScheduleActions.UpdateSchedule) => action.payload),
      switchMap((payload) => {
        return this.jobDescriptionApiService.updateSchedule(payload).pipe(
          map(() => {
            return new fromBulkJobsExportScheduleActions.UpdateScheduleSuccess;
          }),
          catchError(error => of(new fromBulkJobsExportScheduleActions.UpdateScheduleError()))
        );
      })
    );

  @Effect()
  updateScheduleSuccess$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromBulkJobsExportScheduleActions.UPDATE_SCHEDULE_SUCCESS),
      switchMap(() =>
        this.jobDescriptionApiService.getSchedules().pipe(
          map((schedules: BulkExportSchedule[]) => new fromBulkJobsExportScheduleActions.LoadingSchedulesSuccess(schedules)),
          catchError(error => of(new fromBulkJobsExportScheduleActions.LoadingSchedulesError(error)))
        )
      )
    );

  @Effect()
  getJdmExportUrl$: Observable<Action> = this.actions$
    .pipe(
      ofType<fromBulkJobsExportScheduleActions.GetJdmExportUrl>(fromBulkJobsExportScheduleActions.GET_JDM_EXPORT_URL),
      switchMap(action => {
        const urlSafeReportname = encodeURIComponent(action.payload);
        const reportUrl = this.payfactorsApiService.formatUrl(BaseUrlLocation.Default, `HrisJobDescriptionExport/GetReport/${urlSafeReportname}`, false);
        return of(new fromBulkJobsExportScheduleActions.GetJdmExportUrlSuccess(reportUrl));
      })
    );

  @Effect()
  getLatestExports$: Observable<Action> = this.actions$
    .pipe(
      ofType<fromBulkJobsExportScheduleActions.GetLatestExportsHistory>(fromBulkJobsExportScheduleActions.GET_LATEST_EXPORT_HISTORY),
      switchMap(() => {
        return this.outboundJobsApiService.getLatestExportRuns().pipe(
          map((response: BulkExportHistory[]) => new fromBulkJobsExportScheduleActions.GetLatestExportsHistorySuccess(response)),
          catchError(error => of(new fromBulkJobsExportScheduleActions.GetLatestExportsHistoryError))
        );
      })
    );

  constructor(
    private actions$: Actions,
    private jobDescriptionApiService: JobDescriptionApiService,
    private outboundJobsApiService: OutboundJobsApiService,
    private payfactorsApiService: PayfactorsApiService,
  ) {}
}
