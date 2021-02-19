import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import cloneDeep from 'lodash/cloneDeep';
import isObject from 'lodash/isObject';
import omit from 'lodash/omit';
import { merge, Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { BulkExportSchedule, JobDescriptionViewModel, BulkExportScheduleParameters } from 'libs/models/jdm';
import { JdmListFilter } from 'libs/models/user-profile';

import * as fromJdmAdminReducer from '../../reducers';
import * as fromJdmBulkExportScheduleActions from '../../actions/bulk-export-schedule.actions';

@Component({
  selector: 'pf-bulk-export-scheduler-form',
  templateUrl: './bulk-export-scheduler-form.component.html',
  styleUrls: [ './bulk-export-scheduler-form.component.scss' ]
})
export class BulkExportSchedulerFormComponent implements OnInit, OnDestroy {
  @Input() views: JobDescriptionViewModel[];
  @Input() filters: JdmListFilter[];
  @Input() schedules: BulkExportSchedule[];
  @Input() exportType: '';

  editing: boolean;
  schedule: BulkExportSchedule = new BulkExportSchedule();
  daysOfWeekSelected: string[];
  validSchedule: boolean;
  clickedSchedule: string;
  addingSchedule$: Observable<boolean>;
  addingScheduleError$: Observable<boolean>;
  editing$: Observable<boolean>;
  editSchedule$: Observable<BulkExportSchedule>;
  updateSchedule$: Observable<boolean>;
  updateScheduleError$: Observable<boolean>;

  weekday: string[] = [ 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday' ];
  occurence: string[] = [ 'First', 'Second', 'Third', 'Fourth' ];

  private unsubscribe$ = new Subject<void>();

  constructor(private store: Store<fromJdmAdminReducer.State>) {
    this.addingSchedule$ = this.store.select(fromJdmAdminReducer.getBulkExportScheduleAdding);
    this.addingScheduleError$ = this.store.select(fromJdmAdminReducer.getBulkExportScheduleAddingError);
    this.editing$ = this.store.select(fromJdmAdminReducer.getBulkExportScheduleEditing);
    this.editSchedule$ = this.store.select(fromJdmAdminReducer.getBulkExportScheduleEditSchedule);
    this.updateSchedule$ = this.store.select(fromJdmAdminReducer.getBulkExportScheduleUpdating);
    this.updateScheduleError$ = this.store.select(fromJdmAdminReducer.getBulkExportScheduleUpdatingError);
  }

  // Lifecycle
  ngOnInit() {
    this.setDefaultPageValues();
    merge(
      this.addingScheduleError$,
      this.updateScheduleError$,
    )
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(error => {
        if (error) {
          alert('There was an error saving the schedule.');
        }
      });
    this.editSchedule$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(schedule => {
        this.schedule = isObject(schedule) ? cloneDeep(schedule) : new BulkExportSchedule();
        this.daysOfWeekSelected = schedule?.DayOfWeek.split(',') ?? [];
      });
    this.editing$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(editing => this.editing = editing);
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
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

  onScheduleFormatChange() {
    if (this.schedule.Format === 'xlsx' || this.schedule.Format === 'json') {
      this.schedule.FormatSeparatorType = null;
    } else {
      this.schedule.FormatSeparatorType = 'comma';
    }
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

      if (this.editing) {
        this.store.dispatch(new fromJdmBulkExportScheduleActions.UpdateSchedule(<BulkExportScheduleParameters> {
          ...omit(this.schedule, ['ExportCount', 'Id', 'View']),
        }));
      } else {
        this.store.dispatch(new fromJdmBulkExportScheduleActions.AddingSchedule(this.schedule));
      }
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

  isValidSchedule() {
    if (!this.schedule.FileName || (this.fileNameExists(this.schedule.FileName) && !this.editing)) {
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

  setDefaultPageValues() {
    this.schedule.DayOfWeek = '';
    this.schedule.Frequency = 'One-time';
    this.schedule.IncludeDelimiters = false;
    this.schedule.IncludeFormatting = false;
    this.schedule.Format = !this.exportType ? 'xlsx' : 'json';

    this.daysOfWeekSelected = [];
    this.validSchedule = true;
  }
}
