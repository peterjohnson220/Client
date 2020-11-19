import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import { Observable } from 'rxjs';

import { JdmListFilter } from 'libs/models/user-profile';
import { BulkExportSchedule } from 'libs/models/jdm';
import { JobDescriptionViewModel } from 'libs/models/jdm/job-description-view.model';

import * as bulkExportJobsSchedulerActions from 'libs/features/bulk-job-description-export-scheduler/actions';
import * as fromJdmAdminReducer from 'libs/features/bulk-job-description-export-scheduler/reducers';
import { environment } from 'environments/environment';

@Component({
  selector: 'pf-bulk-export-scheduler-page',
  templateUrl: './bulk-export-scheduler.page.html',
  styleUrls: ['./bulk-export-scheduler.page.scss']
})
export class BulkExportSchedulerPageComponent implements OnInit {

  env = environment;

  views$: Observable<JobDescriptionViewModel[]>;
  filters$: Observable<JdmListFilter[]>;
  schedules$: Observable<BulkExportSchedule[]>;

  constructor(private store: Store<fromJdmAdminReducer.State>) {
    this.views$ = this.store.select(fromJdmAdminReducer.getViews);
    this.filters$ = this.store.select(fromJdmAdminReducer.getFilters);
    this.schedules$ = this.store.select(fromJdmAdminReducer.getBulkExportSchedules);
  }

  ngOnInit() {
    this.store.dispatch(new bulkExportJobsSchedulerActions.LoadingViews());
    this.store.dispatch(new bulkExportJobsSchedulerActions.LoadingFilters());
    this.store.dispatch(new bulkExportJobsSchedulerActions.LoadingSchedules());
  }
}
