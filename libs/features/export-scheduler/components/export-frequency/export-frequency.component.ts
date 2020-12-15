import { Component } from '@angular/core';

import { CronExpressionHelper, ExportFrequencyType } from '../../helpers';

@Component({
  selector: 'pf-export-frequency',
  templateUrl: './export-frequency.component.html',
  styleUrls: ['./export-frequency.component.scss']
})
export class ExportFrequencyComponent {

  selectedDaysOfWeek: string[];
  selectedMonthlyOccurrence: string;
  selectedFrequency = ExportFrequencyType.OneTime;

  exportFrequencyType = ExportFrequencyType;
  daysOfWeek: string [];
  monthlyOccurrence: string [];

  constructor() {
    this.selectedDaysOfWeek = [];
    this.daysOfWeek = CronExpressionHelper.daysOfWeek.map(x => x.Name);
    this.monthlyOccurrence = CronExpressionHelper.weeksOfMonth.map(x => x.Name);
  }

  onFrequencyChange(): void {
    this.selectedDaysOfWeek = [];
    if (this.selectedFrequency === ExportFrequencyType.Monthly) {
      this.selectedDaysOfWeek = ['Sunday'];
      this.selectedMonthlyOccurrence = 'First';
    }
  }

  onDayOfWeekChange(day: string): void {
    const isChecked = this.selectedDaysOfWeek.includes(day);
    if (isChecked) {
      this.selectedDaysOfWeek = this.selectedDaysOfWeek.filter(x => x !== day);
    } else {
      this.selectedDaysOfWeek.push(day);
    }
  }

  handleMonthlyDayOfWeekChange(day: string): void {
    this.selectedDaysOfWeek = [day];
  }

  trackByFn(index) {
    return index;
  }

  isDaySelected(day: string): boolean {
    return this.selectedDaysOfWeek && this.selectedDaysOfWeek.includes(day);
  }

  reset(): void {
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

}
