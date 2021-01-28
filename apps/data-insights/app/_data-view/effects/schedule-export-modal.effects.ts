import { Injectable } from '@angular/core';

import { Store } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

import { TableauReportApiService, TabularExportSchedulerApiService } from 'libs/data/payfactors-api/reports';
import { ExportScheduleHelper } from 'libs/features/export-scheduler/export-scheduler/models';

import * as fromScheduleExportModalReducer from '../reducers';
import * as fromScheduleExportModalActions from '../actions/schedule-export-modal.actions';

@Injectable()
export class ScheduleExportModalEffects {

  @Effect()
  getSavedSchedules$ = this.action$
    .pipe(
      ofType(fromScheduleExportModalActions.GET_SAVED_SCHEDULES),
      switchMap((action: fromScheduleExportModalActions.GetSavedSchedules) => {
        return this.tabularExportSchedulerApiService.getExportSchedules()
          .pipe(
            map((response) => {
              const schedules = ExportScheduleHelper.mapCronExpressionToTextFormat(response);
              return new fromScheduleExportModalActions.GetSavedSchedulesSuccess(schedules);
            }),
            catchError(() => of(new fromScheduleExportModalActions.GetSavedSchedulesError()))
          );
      })
    );

  @Effect()
  saveExportSchedule$ = this.action$
    .pipe(
      ofType(fromScheduleExportModalActions.SAVE_SCHEDULE),
      switchMap((action: fromScheduleExportModalActions.SaveSchedule) => {
        return this.tabularExportSchedulerApiService.saveExportSchedule(action.payload)
          .pipe(
            mergeMap((response) => {
              return [
                new fromScheduleExportModalActions.SaveScheduleSuccess(),
                new fromScheduleExportModalActions.GetSavedSchedules()
              ];
            }),
            catchError(() => of(new fromScheduleExportModalActions.SaveScheduleError()))
          );
      })
    );

  @Effect()
  deleteExportSchedule$ = this.action$
    .pipe(
      ofType(fromScheduleExportModalActions.DELETE_EXPORT_SCHEDULE),
      switchMap((action: fromScheduleExportModalActions.DeleteExportSchedule) => {
        return this.tabularExportSchedulerApiService.deleteExportSchedule(action.payload)
          .pipe(
            mergeMap(() => {
              return [
                new fromScheduleExportModalActions.DeleteExportScheduleSuccess(action.payload),
                new fromScheduleExportModalActions.GetSavedSchedules()
              ];
            }),
            catchError(() => of(new fromScheduleExportModalActions.DeleteExportScheduleError()))
          );
      })
    );

  @Effect()
  updateExportSchedule$ = this.action$
    .pipe(
      ofType(fromScheduleExportModalActions.UPDATE_EXPORT_SCHEDULE),
      switchMap((action: fromScheduleExportModalActions.UpdateExportSchedule) => {
        return this.tabularExportSchedulerApiService.updateExportSchedule(action.payload)
          .pipe(
            map((response) =>
              new fromScheduleExportModalActions.UpdateExportScheduleSuccess()
            ),
            catchError(() => of(new fromScheduleExportModalActions.UpdateExportScheduleError())
          ));
      })
    );

  constructor(
    private action$: Actions,
    private store: Store<fromScheduleExportModalReducer.State>,
    private tableauReportApiService: TableauReportApiService,
    private tabularExportSchedulerApiService: TabularExportSchedulerApiService
  ) { }
}
