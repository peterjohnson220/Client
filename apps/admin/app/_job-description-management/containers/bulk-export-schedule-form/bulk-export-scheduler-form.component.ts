import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { Store } from '@ngrx/store';

import { BulkExportSchedule } from 'libs/models/jdm';
import { UserFilter } from 'libs/models/user-profile/index';
import * as fromJdmAdminReducer from '../../reducers/index';
import * as fromJdmBulkExportScheduleActions from '../../actions/bulk-export-schedule.actions';


@Component({
  selector: 'pf-bulk-export-scheduler-form',
  templateUrl: './bulk-export-scheduler-form.component.html',
  styleUrls: ['./bulk-export-scheduler-form.component.scss']
})
export class BulkExportSchedulerFormComponent {
  @Input() views: string[];
  @Input() filters: UserFilter[];
  @Input() schedules: BulkExportSchedule[];

  schedule: BulkExportSchedule = new BulkExportSchedule();
  validSchedule: boolean;
  clickedSchedule: string;
  addingSchedule$: Observable<boolean>;
  removingSchedule$: Observable<boolean>;

  constructor(private store: Store<fromJdmAdminReducer.State>) {
    this.schedule.Frequency = 'One-time';
    this.validSchedule = true;
    this.addingSchedule$ = this.store.select(fromJdmAdminReducer.getBulkExportScheduleAdding);
    this.removingSchedule$ = this.store.select(fromJdmAdminReducer.getBulkExportScheduleRemoving);
  }

  submitForm() {
    this.validSchedule = this.isValidSchedule();

    if (this.validSchedule) {
      this.store.dispatch(new fromJdmBulkExportScheduleActions.AddingSchedule(this.schedule));
      this.schedule = new BulkExportSchedule();
      this.schedule.Frequency = 'One-time';
    }
  }

  removeSchedule(fileName) {
    this.store.dispatch(new fromJdmBulkExportScheduleActions.RemovingSchedule(fileName));
  }

  onScheduleClick(identifier) {
    this.clickedSchedule = this.clickedSchedule !== identifier ? identifier : '';
  }

  isValidSchedule() {
    if (!this.schedule.FileName || this.fileNameExists(this.schedule.FileName)) {
      return false;
    }

    if (!this.schedule.View || !this.schedule.Filter) {
      return false;
    }
    return true;
  }

  fileNameExists(filename) {
    return this.schedules.some(x => x.FileName === filename);
  }
}
