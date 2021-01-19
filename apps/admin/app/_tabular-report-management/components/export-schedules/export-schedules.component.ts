import { Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { TabularReportExportSchedule } from 'libs/features/reports/models';
import { ExportScheduleHelper } from 'libs/features/export-scheduler/models';

import * as fromTabularReportExportSchedulerPageActions from '../../actions/tabular-report-export-scheduler-page.actions';
import * as fromTabularReportExportSchedulerPageReducer from '../../reducers';

@Component({
  selector: 'pf-export-schedules',
  templateUrl: './export-schedules.component.html',
  styleUrls: ['./export-schedules.component.scss']
})
export class ExportSchedulesComponent {
  @Input() schedules: TabularReportExportSchedule[];

  showDeleteModal$: Observable<boolean>;

  csvFileFormat = ExportScheduleHelper.csvFileFormat;
  scheduleToDelete: TabularReportExportSchedule;

  constructor(
    public store: Store<fromTabularReportExportSchedulerPageReducer.State>
  ) {
    this.showDeleteModal$ = this.store.select(fromTabularReportExportSchedulerPageReducer.getShowDeleteModal);
  }

  trackByFn(index: any, item: TabularReportExportSchedule): number {
    return item.DataViewId;
  }

  handleDeleteClicked(schedule: TabularReportExportSchedule) {
    this.scheduleToDelete = schedule;
    this.store.dispatch(new fromTabularReportExportSchedulerPageActions.ShowDeleteModal(true));
  }

  handleDeleteScheduledExport(): void {
    this.store.dispatch(new fromTabularReportExportSchedulerPageActions.ShowDeleteModal(false));
    this.store.dispatch(new fromTabularReportExportSchedulerPageActions.DeleteExportSchedule(this.scheduleToDelete.DataViewId));
  }

  handleCancelClicked(): void {
    this.store.dispatch(new fromTabularReportExportSchedulerPageActions.ShowDeleteModal(false));
  }
}
