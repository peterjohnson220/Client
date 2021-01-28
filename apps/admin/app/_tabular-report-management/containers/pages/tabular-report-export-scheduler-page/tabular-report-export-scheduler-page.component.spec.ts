import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { combineReducers, Store, StoreModule } from '@ngrx/store';

import { ExportFrequencyType } from 'libs/features/export-scheduler/export-scheduler/helpers';
import * as fromRootState from 'libs/state/state';
import { generateMockWorkbook, TabularReportExportSchedule } from 'libs/features/surveys/reports/models';

import * as fromTabularReportExportSchedulerPageReducer from '../../../reducers';
import * as fromTabularReportExportSchedulerPageActions from '../../../actions/tabular-report-export-scheduler-page.actions';
import { TabularReportExportSchedulerPageComponent } from './tabular-report-export-scheduler-page.component';

describe('Company Admin - Tabular Report Export Schedule', () => {
  let instance: TabularReportExportSchedulerPageComponent;
  let fixture: ComponentFixture<TabularReportExportSchedulerPageComponent>;
  let store: Store<fromTabularReportExportSchedulerPageReducer.State>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          tabularReportManagement_main: combineReducers(fromTabularReportExportSchedulerPageReducer.reducers)
        })
      ],
      declarations: [ TabularReportExportSchedulerPageComponent ],
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    fixture = TestBed.createComponent(TabularReportExportSchedulerPageComponent);
    instance = fixture.componentInstance;
    store = TestBed.inject(Store);
    instance.exportFormat = {
      selectedFormat: '',
      selectedSeparatorType: '',
      fileFormats: [],
      csvFileFormat: 'CSV',
      csvDelimiters: [],
      reset: jest.fn(),
      handleFormatChange: jest.fn(),
      isValid: true,
      changesMade: false,
      scheduledFormat: '',
      scheduledFormatSeparatorType: '',
      handleSeparatorTypeChange: jest.fn(),
      ngOnChanges: jest.fn()
    };
    instance.exportFrequency = {
      selectedDaysOfWeek: [],
      selectedMonthlyOccurrence: '',
      selectedFrequency: ExportFrequencyType.OneTime,
      exportFrequencyType: ExportFrequencyType,
      daysOfWeek: [],
      monthlyOccurrence: [],
      reset: jest.fn(),
      onFrequencyChange: jest.fn(),
      onDayOfWeekChange: jest.fn(),
      handleMonthlyDayOfWeekChange: jest.fn(),
      trackByFn: jest.fn(),
      isDaySelected: jest.fn(),
      isValid: true,
      changesMade: false,
      frequency: '',
      schedule: undefined,
      scheduledFrequencyChanged: undefined,
      scheduledMonthlyFrequency: undefined,
      scheduledWeeklyFrequency: undefined,
      handleMonthlyOccurrenceChange: jest.fn(),
      populateSelectedScheduledFrequency: jest.fn(),
      ngOnChanges: jest.fn()
    };

    fixture.detectChanges();
  });

  it.each([
    ['Excel', null, ExportFrequencyType.OneTime, null, null, null],
    ['CSV', 'Comma', ExportFrequencyType.Weekly,
      [{Name: 'Monday', Value: 'MON', Order: 1}, {Name: 'Friday', Value: 'FRI', Order: 5 }], null, '* * * ? * MON,FRI'],
    ['CSV', 'Pipe', ExportFrequencyType.Monthly, [{Name: 'Monday', Value: 'MON', Order: 1}], 'First', '* * * ? * MON#1']
  ])
  ('should dispatch save schedule with correct data',
  (format, separatorType, frequency, daysOfWeek, monthlyOccurrence, cronExpression) => {
    spyOn(store, 'dispatch');

    instance.selectedReport = { ...generateMockWorkbook(), WorkbookId: '12345' };
    instance.exportFormat.selectedFormat = format;
    instance.exportFormat.selectedSeparatorType = separatorType;
    instance.exportFrequency.selectedFrequency = frequency;
    instance.exportFrequency.selectedDaysOfWeek = daysOfWeek;
    instance.exportFrequency.selectedMonthlyOccurrence = monthlyOccurrence;
    const schedule: TabularReportExportSchedule = {
      DataViewId: 12345,
      Format: format,
      FormatSeparatorType: separatorType,
      Frequency: frequency,
      CronExpression: cronExpression
    };
    const expectedAction = new fromTabularReportExportSchedulerPageActions.SaveSchedule(schedule);
    fixture.detectChanges();

    instance.handleSaveClicked();

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });
});
