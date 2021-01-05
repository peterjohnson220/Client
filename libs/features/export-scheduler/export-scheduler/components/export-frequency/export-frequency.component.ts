import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

import cloneDeep from 'lodash/cloneDeep';
import isEqual from 'lodash/isEqual';
import orderBy from 'lodash/orderBy';

import { TabularReportExportSchedule } from 'libs/features/reports/models/tabular-report-export-schedule.model';
import { CronExpressionHelper, DayOfWeek, ExportFrequencyType } from '../../helpers';
import { ScheduledMonthlyFrequency } from '../../models';

@Component({
  selector: 'pf-export-frequency',
  templateUrl: './export-frequency.component.html',
  styleUrls: ['./export-frequency.component.scss']
})
export class ExportFrequencyComponent implements OnChanges {
  @Input() schedule: TabularReportExportSchedule;
  @Output() scheduledFrequencyChanged: EventEmitter<string> = new EventEmitter<string>();

  selectedDaysOfWeek: DayOfWeek [];
  selectedMonthlyOccurrence: string;
  selectedFrequency = ExportFrequencyType.OneTime;

  exportFrequencyType = ExportFrequencyType;
  daysOfWeek: DayOfWeek [];
  monthlyOccurrence: string [];
  frequency = 'frequency';
  changesMade = false;
  scheduledWeeklyFrequency: DayOfWeek[];
  scheduledMonthlyFrequency: ScheduledMonthlyFrequency;

  constructor() {
    this.selectedDaysOfWeek = [];
    this.daysOfWeek = CronExpressionHelper.daysOfWeek;
    this.monthlyOccurrence = CronExpressionHelper.weeksOfMonth.map(x => x.Name);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes?.schedule) {
      this.populateSelectedScheduledFrequency();
    }
  }

  onFrequencyChange(): void {
    this.selectedDaysOfWeek = [];
    if (this.selectedFrequency === ExportFrequencyType.Monthly) {
      this.selectedDaysOfWeek = [this.daysOfWeek[0]];
      this.selectedMonthlyOccurrence = 'First';
    }
    if (!!this.schedule) {
      this.changesMade = !isEqual(this.schedule.Frequency, this.selectedFrequency);
    }
  }

  onDayOfWeekChange(day: DayOfWeek): void {
    const isChecked = this.selectedDaysOfWeek.some(x => x.Name === day.Name);
    if (isChecked) {
      this.selectedDaysOfWeek = this.selectedDaysOfWeek.filter(x => x.Name !== day.Name);
    } else {
      this.selectedDaysOfWeek.push(day);
    }
    this.selectedDaysOfWeek = this.selectedDaysOfWeek.length ? orderBy(this.selectedDaysOfWeek, ['Order'], 'asc') : this.selectedDaysOfWeek;
    if (!!this.schedule) {
      this.changesMade = !isEqual(this.scheduledWeeklyFrequency, this.selectedDaysOfWeek);
    }
  }

  handleMonthlyOccurrenceChange(): void {
    if (!!this.schedule) {
      const monthlyDayOfWeekChanged = !isEqual(this.scheduledMonthlyFrequency?.ScheduledDayOfWeek, this.selectedDaysOfWeek);
      this.changesMade = !isEqual(this.scheduledMonthlyFrequency?.ScheduledMonthlyOccurrence, this.selectedMonthlyOccurrence) || monthlyDayOfWeekChanged;
    }
  }

  handleMonthlyDayOfWeekChange(day: DayOfWeek): void {
    this.selectedDaysOfWeek = [day];
    if (!!this.schedule) {
      const monthlyOccurrenceChanged = !isEqual(this.scheduledMonthlyFrequency?.ScheduledMonthlyOccurrence, this.selectedMonthlyOccurrence);
      this.changesMade = !isEqual(this.scheduledMonthlyFrequency?.ScheduledDayOfWeek, this.selectedDaysOfWeek) || monthlyOccurrenceChanged;
    }
  }

  trackByFn(index) {
    return index;
  }

  isDaySelected(day: DayOfWeek): boolean {
    return this.selectedDaysOfWeek && this.selectedDaysOfWeek.some(x => x.Name === day.Name);
  }

  reset(): void {
    this.changesMade = false;
    this.selectedFrequency = ExportFrequencyType.OneTime;
    this.selectedDaysOfWeek = [];
  }

  get isValid(): boolean {
    switch (this.selectedFrequency) {
      case ExportFrequencyType.OneTime:
        return true;
      case ExportFrequencyType.Weekly:
        return this.selectedDaysOfWeek?.length > 0;
      case ExportFrequencyType.Monthly:
        return this.selectedMonthlyOccurrence?.length > 0 && this.selectedDaysOfWeek?.length > 0;
      default:
        return false;
    }
  }

  populateSelectedScheduledFrequency(): void {
    switch (this.schedule.Frequency) {
      case ExportFrequencyType.Weekly:
        this.selectedFrequency = ExportFrequencyType.Weekly;
        this.scheduledWeeklyFrequency = CronExpressionHelper.getWeeklyFrequencyFromCronExpression(this.schedule.CronExpression);
        this.selectedDaysOfWeek = cloneDeep(this.scheduledWeeklyFrequency);
        break;
      case ExportFrequencyType.Monthly:
        this.selectedFrequency = ExportFrequencyType.Monthly;
        this.scheduledMonthlyFrequency = CronExpressionHelper.getMonthlyFrequencyFromCronExpression(this.schedule.CronExpression);
        const scheduledMonthlyFrequencyClone = cloneDeep(this.scheduledMonthlyFrequency);
        this.selectedMonthlyOccurrence = scheduledMonthlyFrequencyClone.ScheduledMonthlyOccurrence;
        this.selectedDaysOfWeek = scheduledMonthlyFrequencyClone.ScheduledDayOfWeek;
        break;
      default:
        this.selectedFrequency = ExportFrequencyType.OneTime;
    }
  }

}
