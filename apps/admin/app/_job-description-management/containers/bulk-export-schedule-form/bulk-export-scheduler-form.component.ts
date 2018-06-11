import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs';
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
  daysOfWeekSelected: string[];
  validSchedule: boolean;
  clickedSchedule: string;
  addingSchedule$: Observable<boolean>;
  removingSchedule$: Observable<boolean>;

  weekday: string[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  occurence: string[] = ['First', 'Second', 'Third', 'Fourth'];

  constructor(private store: Store<fromJdmAdminReducer.State>) {
    this.schedule.DayOfWeek = '';
    this.daysOfWeekSelected = [];
    this.schedule.Frequency = 'One-time';
    this.validSchedule = true;
    this.addingSchedule$ = this.store.select(fromJdmAdminReducer.getBulkExportScheduleAdding);
    this.removingSchedule$ = this.store.select(fromJdmAdminReducer.getBulkExportScheduleRemoving);
  }

  onDayOfWeekChange(event) {
    if (this.schedule.Frequency === 'Weekly') {
      if (event.srcElement.checked) {
        this.daysOfWeekSelected.push(event.srcElement.value);
      } else {
        const index = this.daysOfWeekSelected.indexOf(event.srcElement.value);
        if (index > -1) {
          this.daysOfWeekSelected.splice(index, 1);
        }
      }
    }
  }

  onFrequencyChange() {
    this.schedule.DayOfWeek = '';
    this.schedule.Occurrence = '';
    this.daysOfWeekSelected = [];
    this.schedule.MonthlyOccurrence = '';
  }

  submitForm() {
    if (this.daysOfWeekSelected.length > 0) {
      this.schedule.DayOfWeek = this.daysOfWeekSelected.join(',');
    }

    this.validSchedule = this.isValidSchedule();

    if (this.validSchedule) {
      if (this.schedule.Frequency !== 'One-time') {
        this.generateCronExpression();
      }
      this.store.dispatch(new fromJdmBulkExportScheduleActions.AddingSchedule(this.schedule));
      this.schedule = new BulkExportSchedule();
      this.schedule.Frequency = 'One-time';
      this.daysOfWeekSelected = [];
    }
  }

  generateCronExpression() {
    this.schedule.CronExpression = '0 0 3 ? ';

    if (this.schedule.Frequency === 'Monthly') {
      this.schedule.CronExpression += (new Date().getMonth() + 1) +
        (this.schedule.MonthlyOccurrence !== '1' ? '/' + this.schedule.MonthlyOccurrence + ' ' : ' ');
    } else {
      this.schedule.CronExpression += '* ';
    }

    if (this.schedule.Frequency === 'Monthly') {
      this.schedule.CronExpression += this.schedule.DayOfWeek + '#' + this.schedule.Occurrence + ' ';
    } else {
      this.schedule.CronExpression += this.schedule.DayOfWeek + ' ';
    }
    this.schedule.CronExpression += '*';
  }

  removeSchedule(fileName) {
    this.store.dispatch(new fromJdmBulkExportScheduleActions.RemovingSchedule(fileName));
  }

  daysOfWeekAsString(dayNumbers) {
    const days = dayNumbers.split(',');
    let daysString = '';
    days.sort();

    for (const day of days) {
      daysString += this.weekday[day - 1] + ', ';
    }

    return daysString.slice(0, -2);
  }

  occurrenceAsString(occurrence) {
    return this.occurence[occurrence - 1];
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
    if (!this.schedule.Frequency) {
      return false;
    } else if (this.schedule.Frequency === 'Weekly') {
      if (this.schedule.DayOfWeek.length === 0) {
        return false;
      }
    } else if (this.schedule.Frequency === 'Monthly') {
      if (!this.schedule.Occurrence || !this.schedule.DayOfWeek || !this.schedule.MonthlyOccurrence) {
        return false;
      }
    }
    return true;
  }

  fileNameExists(filename) {
    return this.schedules.some(x => x.FileName === filename);
  }
}
