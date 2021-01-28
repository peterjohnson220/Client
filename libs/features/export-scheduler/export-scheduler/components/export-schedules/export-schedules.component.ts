import { Component, Input } from '@angular/core';

import { TabularReportExportSchedule } from 'libs/features/surveys/reports/models';

import { ExportScheduleHelper } from '../../models/export-schedule.model';

@Component({
  selector: 'pf-export-schedules',
  templateUrl: './export-schedules.component.html',
  styleUrls: ['./export-schedules.component.scss']
})
export class ExportSchedulesComponent {
  @Input() schedules: TabularReportExportSchedule[];

  csvFileFormat = ExportScheduleHelper.csvFileFormat;

  trackByFn(index: any, item: TabularReportExportSchedule): number {
    return item.DataViewId;
  }
}
