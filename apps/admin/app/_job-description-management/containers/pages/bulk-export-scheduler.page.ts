import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import { Observable } from 'rxjs';

import { UserFilter } from 'libs/models/user-profile';
import { BulkExportSchedule } from 'libs/models/jdm';

import * as fromJdmViewActions from '../../actions/view.actions';
import * as fromJdmFilterActions from '../../actions/filter.actions';
import * as fromJdmBulkExportScheduleActions from '../../actions/bulk-export-schedule.actions';
import * as fromJdmAdminReducer from '../../reducers';

@Component({
  selector: 'pf-bulk-export-scheduler-page',
  templateUrl: './bulk-export-scheduler.page.html',
  styleUrls: ['./bulk-export-scheduler.page.scss']
})
export class BulkExportSchedulerPageComponent implements OnInit {
  views$: Observable<string[]>;
  filters$: Observable<UserFilter[]>;
  schedules$: Observable<BulkExportSchedule[]>;


  constructor(private store: Store<fromJdmAdminReducer.State>) {
    this.views$ = this.store.select(fromJdmAdminReducer.getViews);
    this.filters$ = this.store.select(fromJdmAdminReducer.getFilters);
    this.schedules$ = this.store.select(fromJdmAdminReducer.getBulkExportSchedules);
  }

  ngOnInit() {
    this.store.dispatch(new fromJdmViewActions.LoadingViews());
    this.store.dispatch(new fromJdmFilterActions.LoadingFilters());
    this.store.dispatch(new fromJdmBulkExportScheduleActions.LoadingSchedules());
  }

  handleBackButtonClick(): void {
    window.location.href = '/ng/company-admin/navigation';
  }
}
