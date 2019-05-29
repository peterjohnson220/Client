import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';

import { BulkExportSchedule } from 'libs/models/jdm';
import { JdmListFilter } from 'libs/models/user-profile/index';
import * as fromJdmAdminReducer from '../../reducers/index';
import * as fromJdmBulkExportScheduleActions from '../../actions/bulk-export-schedule.actions';
import { JobDescriptionViewModel } from 'libs/models/jdm/job-description-view.model';

@Component({
  selector: 'pf-bulk-export-scheduler-form',
  templateUrl: './bulk-export-scheduler-form.component.html',
  styleUrls: ['./bulk-export-scheduler-form.component.scss']
})
export class BulkExportSchedulerFormComponent implements OnInit, OnDestroy {
  @Input() views: JobDescriptionViewModel[];
  @Input() filters: JdmListFilter[];
  @Input() schedules: BulkExportSchedule[];

  schedule: BulkExportSchedule = new BulkExportSchedule();
  daysOfWeekSelected: string[];
  validSchedule: boolean;
  clickedSchedule: string;
  addingSchedule$: Observable<boolean>;
  addingScheduleError$: Observable<boolean>;
  addScheduleErrorSubscription: Subscription;
  removingSchedule$: Observable<boolean>;

  weekday: string[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  occurence: string[] = ['First', 'Second', 'Third', 'Fourth'];

  constructor(private store: Store<fromJdmAdminReducer.State>) {
    this.setDefaultPageValues();

    this.addingSchedule$ = this.store.select(fromJdmAdminReducer.getBulkExportScheduleAdding);
    this.addingScheduleError$ = this.store.select(fromJdmAdminReducer.getBulkExportScheduleAddingError);
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
    this.schedule.MonthlyOccurrence = this.schedule.Frequency === 'Monthly' ? '1' : '';
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

      this.setDefaultPageValues();
    }
  }

  generateCronExpression() {
    this.schedule.CronExpression = '* * * ? ';

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

    if (!this.schedule.ViewId || !this.schedule.Filter) {
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

  getViewName(viewId) {
    for (const view of this.views) {
      if (view.Id === viewId) {
        return view.Name;
      }
    }

    return '';
  }

  setDefaultPageValues() {
    this.schedule.DayOfWeek = '';
    this.schedule.Frequency = 'One-time';
    this.schedule.IncludeDelimiters = false;
    this.schedule.Format = 'xlsx';

    this.daysOfWeekSelected = [];
    this.validSchedule = true;
  }

  // Lifecycle
  ngOnInit() {
    this.addScheduleErrorSubscription = this.addingScheduleError$.subscribe(error => {
      if (error) {
        alert('There was an error saving the schedule.');
      }
    });
  }

  ngOnDestroy() {
    this.addScheduleErrorSubscription.unsubscribe();
  }
}
