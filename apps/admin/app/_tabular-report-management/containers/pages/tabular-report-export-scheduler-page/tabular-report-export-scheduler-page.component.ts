import { Component, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { AsyncStateObj } from 'libs/models/state';
import { Workbook } from 'libs/features/reports/models';
import { ExportFrequencyType } from 'libs/features/export-scheduler/models/export-schedule.model';
import { ExportFormatComponent, ExportFrequencyComponent } from 'libs/features/export-scheduler/components';

import * as fromTabularReportExportSchedulerPageReducer from '../../../reducers';
import * as fromTabularReportExportSchedulerPageActions from '../../../actions/tabular-report-export-scheduler-page.actions';
import { environment } from 'environments/environment';
import { DropDownFilterSettings } from '@progress/kendo-angular-dropdowns';

@Component({
  selector: 'pf-tabular-report-export-scheduler-page',
  templateUrl: './tabular-report-export-scheduler-page.component.html',
  styleUrls: ['./tabular-report-export-scheduler-page.component.scss']
})
export class TabularReportExportSchedulerPageComponent implements OnInit {
  @ViewChild('exportFormat', { static: true }) exportFormat: ExportFormatComponent;
  @ViewChild('exportFrequency', { static: true }) exportFrequency: ExportFrequencyComponent;

  tabularReportsAsync$: Observable<AsyncStateObj<Workbook[]>>;

  selectedReport: Workbook;
  env = environment;
  filterSettings: DropDownFilterSettings = {
    caseSensitive: false,
    operator: 'contains'
  };

  get disabled() {
    const isFrequencySelectionValid = this.isFrequencySelectionValid();
    return !(!!this.selectedReport && !!this.exportFormat.selectedFileExtension && isFrequencySelectionValid);
  }
  constructor(
    private store: Store<fromTabularReportExportSchedulerPageReducer.State>
  ) {
    this.tabularReportsAsync$ = this.store.select(fromTabularReportExportSchedulerPageReducer.getTabularReportsAsync);
  }

  ngOnInit(): void {
    this.store.dispatch(new fromTabularReportExportSchedulerPageActions.GetTabularReports());
  }

  private isFrequencySelectionValid(): boolean {
    if (this.exportFrequency.frequencySelected === ExportFrequencyType.OneTime) {
      return true;
    }
    if (this.exportFrequency.frequencySelected === ExportFrequencyType.Weekly) {
      return !!this.exportFrequency.selectedDaysOfWeek?.length;
    }
    if (this.exportFrequency.frequencySelected === ExportFrequencyType.Monthly) {
      const occurrenceSelected = !!this.exportFrequency.selectedMonthlyFrequency.Occurrence?.length;
      const dayOfWeekSelected = !!this.exportFrequency.selectedMonthlyFrequency.DayOfWeek.Value?.length;
      return occurrenceSelected && dayOfWeekSelected;
    }
  }

}
