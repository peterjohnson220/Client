import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Effect, Actions } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/toArray';

import * as fromJdmBulkExportScheduleActions from '../actions/bulk-export-schedule.actions';
import { JobDescriptionApiService } from 'libs/data/payfactors-api/jdm';
import { BulkExportSchedule } from 'libs/models/jdm';

@Injectable()
export class JdmBulkExportScheduleEffects {

  @Effect()
  loadSchedules$: Observable<Action> = this.actions$
    .ofType(fromJdmBulkExportScheduleActions.LOADING_SCHEDULE)
    .switchMap(() =>
      this.jobDescriptionApiService.getSchedules()
        .map((schedules: BulkExportSchedule[]) => new fromJdmBulkExportScheduleActions.LoadingSchedulesSuccess(schedules))
        .catch(error => of(new fromJdmBulkExportScheduleActions.LoadingSchedulesError(error)))
    );

  @Effect()
  addSchedule$: Observable<Action> = this.actions$
    .ofType(fromJdmBulkExportScheduleActions.ADDING_SCHEDULE)
    .map((action: fromJdmBulkExportScheduleActions.AddingSchedule) => action.payload)
    .switchMap((payload) => {
      return this.jobDescriptionApiService.addSchedule(payload)
        .map(() => {
          return new fromJdmBulkExportScheduleActions.AddingScheduleSuccess;
        })
        .catch(error => of(new fromJdmBulkExportScheduleActions.AddingScheduleError()));
    });

  @Effect()
  addScheduleSuccess$: Observable<Action> = this.actions$
    .ofType(fromJdmBulkExportScheduleActions.ADDING_SCHEDULE_SUCCESS)
    .switchMap(() =>
      this.jobDescriptionApiService.getSchedules()
        .map((schedules: BulkExportSchedule[]) => new fromJdmBulkExportScheduleActions.LoadingSchedulesSuccess(schedules))
        .catch(error => of(new fromJdmBulkExportScheduleActions.LoadingSchedulesError(error)))
    );

  @Effect()
  removeSchedule$: Observable<Action> = this.actions$
    .ofType(fromJdmBulkExportScheduleActions.REMOVING_SCHEDULE)
    .map((action: fromJdmBulkExportScheduleActions.RemovingSchedule) => action.payload)
    .switchMap((payload) => {
      return this.jobDescriptionApiService.removeSchedule(payload)
        .map(() => {
          return new fromJdmBulkExportScheduleActions.RemovingScheduleSuccess;
        })
        .catch(error => of(new fromJdmBulkExportScheduleActions.RemovingScheduleError()));
    });

  @Effect()
  removeScheduleSuccess$: Observable<Action> = this.actions$
    .ofType(fromJdmBulkExportScheduleActions.REMOVING_SCHEDULE_SUCCESS)
    .switchMap(() =>
      this.jobDescriptionApiService.getSchedules()
        .map((schedules: BulkExportSchedule[]) => new fromJdmBulkExportScheduleActions.LoadingSchedulesSuccess(schedules))
        .catch(error => of(new fromJdmBulkExportScheduleActions.LoadingSchedulesError(error)))
    );

  constructor(
    private actions$: Actions,
    private jobDescriptionApiService: JobDescriptionApiService
  ) {}
}
