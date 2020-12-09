import { Component } from '@angular/core';
import {
  DaysOfWeek, DaysOfWeekAbbreviations,
  ExportDayOfWeek,
  ExportFrequencyType, ExportMonthlyFrequency,
  ExportMonthlyOccurrence
} from 'libs/features/export-scheduler/models/export-schedule.model';

import { initializeDaysOfWeek } from '../../helpers/model-mapping.helper';

@Component({
  selector: 'pf-export-frequency',
  templateUrl: './export-frequency.component.html',
  styleUrls: ['./export-frequency.component.scss']
})
export class ExportFrequencyComponent {

  selectedDaysOfWeek: ExportDayOfWeek[];
  selectedMonthlyFrequency = this.initializeEmptyMonthlyFrequency();
  frequencySelected = ExportFrequencyType.OneTime;
  exportFrequencyType = ExportFrequencyType;
  daysOfWeek = initializeDaysOfWeek();
  monthlyOccurrence = [ExportMonthlyOccurrence.First, ExportMonthlyOccurrence.Second, ExportMonthlyOccurrence.Third, ExportMonthlyOccurrence.Fourth];

  onFrequencyChange(): void {
    if (!!this.daysOfWeek.filter(x => x.IsSelected === true).length) {
      this.daysOfWeek.map(x => x.IsSelected = false);
    }
    if (this.selectedDaysOfWeek?.length) {
      this.selectedDaysOfWeek = [];
    }
    if (this.selectedMonthlyFrequency.Occurrence?.length || this.selectedMonthlyFrequency.DayOfWeek.Value?.length) {
      this.selectedMonthlyFrequency = this.initializeEmptyMonthlyFrequency();
    }
  }

  onDayOfWeekChange(): void {
    if (this.frequencySelected === 'Weekly') {
      this.selectedDaysOfWeek = this.daysOfWeek.filter(x => x.IsSelected === true);
    }
  }

  handleMonthlyDayOfWeekChange(): void {
    this.selectedMonthlyFrequency.DayOfWeek = {...this.selectedMonthlyFrequency.DayOfWeek, IsSelected: true};
  }

  trackByFn(index) {
    return index;
  }

  private initializeEmptyMonthlyFrequency(): ExportMonthlyFrequency {
    return {
      Occurrence: ExportMonthlyOccurrence.First,
      DayOfWeek: { Name: DaysOfWeek.Sunday, Value: DaysOfWeekAbbreviations.Sunday, IsSelected: true}
    };
  }

}
