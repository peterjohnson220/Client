import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { ExportReportType } from 'libs/constants';
import { JdmListFilter } from 'libs/models/user-profile';
import { BulkExportSchedule } from 'libs/models/jdm';
import { JobDescriptionViewModel } from 'libs/models/jdm/job-description-view.model';

import * as bulkExportJobsSchedulerActions from 'libs/features/jobs/bulk-job-description-export-scheduler/actions';
import * as fromJdmAdminReducer from 'libs/features/jobs/bulk-job-description-export-scheduler/reducers';
import * as fromServiceAccountsActions from 'libs/features/service-accounts/actions';
import * as fromServiceAccountsReducer from 'libs/features/service-accounts/reducers';
import { ServiceAccountUserStatus } from 'libs/models';


@Component({
  selector: 'pf-outbound-bulk-jobs-export-scheduler-page',
  templateUrl: './outbound-bulk-jobs-export-scheduler.page.html',
  styleUrls: ['./outbound-bulk-jobs-export-scheduler.page.scss']
})
export class OutboundBulkJobsExportSchedulerPageComponent implements OnInit, OnDestroy {

  views$: Observable<JobDescriptionViewModel[]>;
  filters$: Observable<JdmListFilter[]>;
  schedules$: Observable<BulkExportSchedule[]>;

  loadingBulkExportSchedules$: Observable<boolean>;
  loadingJdmViews$: Observable<boolean>;
  loadingJdmFilters$: Observable<boolean>;

  loadingBulkExportSchedulesError$: Observable<boolean>;
  loadingJdmViewsError$: Observable<boolean>;
  loadingJdmFiltersError$: Observable<boolean>;

  showResetAccountModal$: Observable<boolean>;
  serviceAccountStatus$: Observable<ServiceAccountUserStatus>;

  private unsubscribe$ = new Subject<void>();

  filteredSchedules: BulkExportSchedule[];
  exportReportType =  ExportReportType;
  canResetCredentials = false;

  constructor(private store: Store<fromJdmAdminReducer.State>, private serviceAccountStore: Store<fromServiceAccountsReducer.State>) {
    this.views$ = this.store.select(fromJdmAdminReducer.getViews);
    this.filters$ = this.store.select(fromJdmAdminReducer.getFilters);
    this.schedules$ = this.store.select(fromJdmAdminReducer.getBulkExportSchedules);

    this.loadingBulkExportSchedules$ = this.store.select(fromJdmAdminReducer.getBulkExportScheduleLoading);
    this.loadingJdmViews$ = this.store.select(fromJdmAdminReducer.getViewsLoading);
    this.loadingJdmFilters$ = this.store.select(fromJdmAdminReducer.getFiltersLoading);

    this.loadingBulkExportSchedulesError$ = this.store.select(fromJdmAdminReducer.getBulkExportScheduleLoadingError);
    this.loadingJdmViewsError$ = this.store.select(fromJdmAdminReducer.getViewsLoadingError);
    this.loadingJdmFiltersError$ = this.store.select(fromJdmAdminReducer.getFiltersLoadingError);

    this.showResetAccountModal$ = this.serviceAccountStore.select(fromServiceAccountsReducer.getShowServiceAccountModal);
    this.serviceAccountStatus$ = this.serviceAccountStore.select(fromServiceAccountsReducer.getAccountStatus);
  }

  ngOnInit() {
    this.store.dispatch(new bulkExportJobsSchedulerActions.LoadingViews());
    this.store.dispatch(new bulkExportJobsSchedulerActions.LoadingFilters());
    this.store.dispatch(new bulkExportJobsSchedulerActions.LoadingSchedules());

    this.schedules$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(schedules => {
        this.filteredSchedules = schedules.filter(s => s.ReportType === this.exportReportType.HrisOutboundJobs);
      });
    this.serviceAccountStatus$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(sas => {
        if (sas != null) {
          this.canResetCredentials = sas.IsActive;
        }
      });
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
  }

  openResetAccountModal() {
    this.serviceAccountStore.dispatch(new fromServiceAccountsActions.OpenResetAccountModal());
  }

}
