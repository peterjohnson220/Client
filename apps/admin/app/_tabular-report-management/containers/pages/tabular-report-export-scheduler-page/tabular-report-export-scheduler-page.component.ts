import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { DropDownFilterSettings } from '@progress/kendo-angular-dropdowns';
import isNumber from 'lodash/isNumber';
import toNumber from 'lodash/toNumber';
import cloneDeep from 'lodash/cloneDeep';

import { environment } from 'environments/environment';
import { AsyncStateObj } from 'libs/models/state';
import { TabularReportExportSchedule, Workbook } from 'libs/features/reports/models';
import { ExportFormatComponent, ExportFrequencyComponent } from 'libs/features/export-scheduler/components';
import { ExportFrequencyType, CronExpressionHelper } from 'libs/features/export-scheduler/helpers';
import { ExportScheduleHelper } from 'libs/features/export-scheduler/models';

import * as fromTabularReportExportSchedulerPageReducer from '../../../reducers';
import * as fromTabularReportExportSchedulerPageActions from '../../../actions/tabular-report-export-scheduler-page.actions';

@Component({
  selector: 'pf-tabular-report-export-scheduler-page',
  templateUrl: './tabular-report-export-scheduler-page.component.html',
  styleUrls: ['./tabular-report-export-scheduler-page.component.scss']
})
export class TabularReportExportSchedulerPageComponent implements OnInit, OnDestroy {
  @ViewChild('exportFormat', { static: true }) exportFormat: ExportFormatComponent;
  @ViewChild('exportFrequency', { static: true }) exportFrequency: ExportFrequencyComponent;

  tabularReportsAsync$: Observable<AsyncStateObj<Workbook[]>>;
  savedSchedulesAsync$: Observable<AsyncStateObj<TabularReportExportSchedule[]>>;
  savingSchedule$: Observable<boolean>;
  savingScheduleError$: Observable<string>;

  savingScheduleSubscription: Subscription;
  savedSchedulesSubscription: Subscription;

  selectedReport: Workbook;
  env = environment;
  filterSettings: DropDownFilterSettings = {
    caseSensitive: false,
    operator: 'contains'
  };
  savingSchedule: boolean;
  savedSchedules: TabularReportExportSchedule[];

  get disabled() {
    return !this.selectedReport || !this.exportFormat.isValid || !this.exportFrequency.isValid ||
      this.savingSchedule;
  }
  constructor(
    private store: Store<fromTabularReportExportSchedulerPageReducer.State>
  ) {
    this.tabularReportsAsync$ = this.store.select(fromTabularReportExportSchedulerPageReducer.getTabularReportsAsync);
    this.savedSchedulesAsync$ = this.store.select(fromTabularReportExportSchedulerPageReducer.getSavedSchedulesAsync);
    this.savingSchedule$ = this.store.select(fromTabularReportExportSchedulerPageReducer.getSavingSchedule);
    this.savingScheduleError$ = this.store.select(fromTabularReportExportSchedulerPageReducer.getSavingScheduleError);
  }

  ngOnInit(): void {
    this.store.dispatch(new fromTabularReportExportSchedulerPageActions.GetSavedSchedules());
    this.savingScheduleSubscription = this.savingSchedule$.subscribe(value => this.savingSchedule = value);
    this.savedSchedulesSubscription = this.savedSchedulesAsync$.subscribe(schedules => {
      if (!!schedules.obj.length) {
        this.savedSchedules = cloneDeep(schedules.obj);
      }
    });
  }

  ngOnDestroy(): void {
    this.savingScheduleSubscription.unsubscribe();
    this.savedSchedulesSubscription.unsubscribe();
  }

  handleSaveClicked(): void {
    const dataViewId = toNumber(this.selectedReport.WorkbookId);
    const cronExpression = this.exportFrequency.selectedFrequency === ExportFrequencyType.OneTime
      ? null
      : CronExpressionHelper.generateCronExpression(this.exportFrequency.selectedFrequency,
        this.exportFrequency.selectedDaysOfWeek,
        this.exportFrequency.selectedMonthlyOccurrence);
    if (!isNumber(dataViewId) || (this.exportFrequency.selectedFrequency !== ExportFrequencyType.OneTime && cronExpression === '')) {
      this.reset();
      return;
    }
    const schedule: TabularReportExportSchedule = {
      DataViewId: dataViewId,
      Format: this.exportFormat.selectedFormat,
      FormatSeparatorType: this.exportFormat.selectedFormat === ExportScheduleHelper.csvFileFormat ?
        this.exportFormat.selectedSeparatorType : null,
      Frequency: this.exportFrequency.selectedFrequency,
      CronExpression: cronExpression
    };

    this.store.dispatch(new fromTabularReportExportSchedulerPageActions.SaveSchedule(schedule));
    this.reset();
  }

  private reset(): void {
    this.selectedReport = null;
    this.exportFormat.reset();
    this.exportFrequency.reset();
  }

}
