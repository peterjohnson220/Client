import { Store } from '@ngrx/store';
import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';

import cloneDeep from 'lodash/cloneDeep';

import { TabularReportExportSchedule } from 'libs/features/reports/models';
import { ExportScheduleHelper } from 'libs/features/export-scheduler/models';
import { CronExpressionHelper } from 'libs/features/export-scheduler/helpers';
import { ExportFormatComponent, ExportFrequencyComponent } from 'libs/features/export-scheduler/components';

import * as fromTabularReportExportSchedulerPageActions from '../../actions/tabular-report-export-scheduler-page.actions';
import * as fromTabularReportExportSchedulerPageReducer from '../../reducers';

@Component({
  selector: 'pf-export-schedule-details',
  templateUrl: './export-schedule-details.component.html',
  styleUrls: ['./export-schedule-details.component.scss']
})
export class ExportScheduleDetailsComponent {
  @Input() schedule: TabularReportExportSchedule;
  @Output() deleteClicked = new EventEmitter<TabularReportExportSchedule>();
  @ViewChild(ExportFormatComponent) exportFormat: ExportFormatComponent;
  @ViewChild(ExportFrequencyComponent) exportFrequency: ExportFrequencyComponent;

  dataViewIdClicked: number;
  csvFileFormat = ExportScheduleHelper.csvFileFormat;

  constructor(
    public store: Store<fromTabularReportExportSchedulerPageReducer.State>
  ) {}

  get changesMade(): boolean {
    return (this.exportFormat?.changesMade || this.exportFrequency?.changesMade) && this.exportFrequency?.isValid;
  }

  handleEditClicked(dataViewId: number): void {
    this.dataViewIdClicked = dataViewId;
  }

  handleDeleteClicked(schedule: TabularReportExportSchedule): void {
    this.deleteClicked.emit(schedule);
  }

  handleCancelClicked(): void {
    this.dataViewIdClicked = null;
  }

  handleSaveClicked() {
    const updatedSchedule = cloneDeep(this.schedule);
    this.dataViewIdClicked = null;
    updatedSchedule.Format = this.exportFormat.selectedFormat;
    updatedSchedule.FormatSeparatorType = this.exportFormat?.selectedSeparatorType;
    updatedSchedule.Frequency = this.exportFrequency.selectedFrequency;
    updatedSchedule.CronExpression = CronExpressionHelper.generateCronExpression(
      this.exportFrequency.selectedFrequency,
      this.exportFrequency.selectedDaysOfWeek,
      this.exportFrequency.selectedMonthlyOccurrence);
    updatedSchedule.FrequencyTextFormat = ExportScheduleHelper.getFrequencyTextFormat(this.exportFrequency.selectedFrequency, updatedSchedule.CronExpression);
    this.store.dispatch(new fromTabularReportExportSchedulerPageActions.UpdateExportSchedule(updatedSchedule));
  }
}
