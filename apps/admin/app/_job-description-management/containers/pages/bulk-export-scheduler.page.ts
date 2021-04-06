import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { AppConstants, ExportReportType } from 'libs/constants';
import { JdmListFilter } from 'libs/models/user-profile';
import { BulkExportSchedule } from 'libs/models/jdm';
import { JobDescriptionViewModel } from 'libs/models/jdm/job-description-view.model';

import * as bulkExportJobsSchedulerActions from 'libs/features/jobs/bulk-job-description-export-scheduler/actions';
import * as fromJdmAdminReducer from 'libs/features/jobs/bulk-job-description-export-scheduler/reducers';

@Component({
  selector: 'pf-bulk-export-scheduler-page',
  templateUrl: './bulk-export-scheduler.page.html',
  styleUrls: ['./bulk-export-scheduler.page.scss']
})
export class BulkExportSchedulerPageComponent implements OnInit, OnDestroy {
  get CompanyAdminUrl() { return AppConstants.CompanyAdminUrl; }

  views$: Observable<JobDescriptionViewModel[]>;
  filters$: Observable<JdmListFilter[]>;
  schedules$: Observable<BulkExportSchedule[]>;

  private unsubscribe$ = new Subject<void>();

  filteredSchedules: BulkExportSchedule[];
  exportReportType = ExportReportType;

  constructor(private store: Store<fromJdmAdminReducer.State>) {
    this.views$ = this.store.select(fromJdmAdminReducer.getViews);
    this.filters$ = this.store.select(fromJdmAdminReducer.getFilters);
    this.schedules$ = this.store.select(fromJdmAdminReducer.getBulkExportSchedules);
  }

  ngOnInit() {
    this.store.dispatch(new bulkExportJobsSchedulerActions.LoadingViews());
    this.store.dispatch(new bulkExportJobsSchedulerActions.LoadingFilters());
    this.store.dispatch(new bulkExportJobsSchedulerActions.LoadingSchedules());

    this.schedules$
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(schedules => {
      this.filteredSchedules = schedules.filter(s => s.ReportType === this.exportReportType.ScheduledExportJobs);
    });
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
  }
}
