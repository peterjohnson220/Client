import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { combineReducers, Store, StoreModule } from '@ngrx/store';

import { ExportFrequencyType } from 'libs/features/export-scheduler/export-scheduler/helpers';
import { TabularReportExportSchedule } from 'libs/features/surveys/reports/models';
import { generateMockTabularReportExportSchedule } from 'libs/features/reports/models/tabular-report-export-schedule.model';
import { DataViewAccessLevel } from 'libs/ui/formula-editor/models';
import { ExportScheduleHelper } from 'libs/features/export-scheduler/export-scheduler/models';
import * as fromRootState from 'libs/state/state';
import * as fromAppNotificationsMainReducer from 'libs/features/infrastructure/app-notifications/reducers';
import { DataViewScope } from 'libs/models/payfactors-api';

import * as fromScheduleExportModalReducer from '../../reducers';
import * as fromDataViewMainReducer from '../../reducers';
import * as fromScheduleExportModalActions from '../../actions/schedule-export-modal.actions';
import * as fromSharedReducer from '../../../_shared/reducers';
import { ScheduleExportModalComponent } from './schedule-export-modal.component';

describe('Data Insights - Date Field Formatting Modal Component', () => {
  let instance: ScheduleExportModalComponent;
  let fixture: ComponentFixture<ScheduleExportModalComponent>;
  let store: Store<fromScheduleExportModalReducer.State>;
  let ngbModal: NgbModal;


  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        StoreModule.forRoot({
          ...fromRootState.reducers,
          tabularReportManagement_main: combineReducers(fromScheduleExportModalReducer.reducers),
          dataView_main: combineReducers(fromDataViewMainReducer.reducers),
          feature_appnotifications: combineReducers(fromAppNotificationsMainReducer.reducers),
          dataInsightsShared_main: combineReducers(fromSharedReducer.reducers)
        })
      ],
      declarations: [ScheduleExportModalComponent],
      providers: [
        {
          provide: NgbModal,
          useValue: {open: jest.fn(), dismissAll: jest.fn()},
        },
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });

    fixture = TestBed.createComponent(ScheduleExportModalComponent);
    instance = fixture.componentInstance;

    store = TestBed.inject(Store);
    ngbModal = TestBed.inject(NgbModal);

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
  ])('should dispatch save schedule with correct data',
    (format, separatorType, frequency, daysOfWeek, monthlyOccurrence, cronExpression) => {
      spyOn(store, 'dispatch');

      instance.currentSchedule = { ...generateMockTabularReportExportSchedule() };
      instance.exportFormat.selectedFormat = format;
      instance.exportFormat.selectedSeparatorType = separatorType;
      instance.exportFrequency.selectedFrequency = frequency;
      instance.exportFrequency.selectedDaysOfWeek = daysOfWeek;
      instance.exportFrequency.selectedMonthlyOccurrence = monthlyOccurrence;
      const schedule: TabularReportExportSchedule = {
        DataViewId: undefined,
        Format: format,
        FormatSeparatorType: separatorType,
        Frequency: frequency,
        CronExpression: cronExpression
      };
      const expectedAction = new fromScheduleExportModalActions.SaveSchedule(schedule);
      fixture.detectChanges();

      instance.handleSaveClicked();

      expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
    });

  it.each([
    ['Excel', null, ExportFrequencyType.OneTime, null, null, ''],
    ['CSV', 'Comma', ExportFrequencyType.Weekly,
      [{Name: 'Monday', Value: 'MON', Order: 1}, {Name: 'Friday', Value: 'FRI', Order: 5 }], null, '* * * ? * MON,FRI'],
    ['CSV', 'Pipe', ExportFrequencyType.Monthly, [{Name: 'Monday', Value: 'MON', Order: 1}], 'First', '* * * ? * MON#1']
  ])('should dispatch update schedule with correct data',
    (format, separatorType, frequency, daysOfWeek, monthlyOccurrence, cronExpression) => {
      spyOn(store, 'dispatch');

      instance.currentSchedule = { ...generateMockTabularReportExportSchedule() };
      instance.exportFormat.selectedFormat = format;
      instance.exportFormat.selectedSeparatorType = separatorType;
      instance.exportFrequency.selectedFrequency = frequency;
      instance.exportFrequency.selectedDaysOfWeek = daysOfWeek;
      instance.exportFrequency.selectedMonthlyOccurrence = monthlyOccurrence;
      const schedule: TabularReportExportSchedule = {
        DataViewId: 0,
        Format: format,
        FormatSeparatorType: separatorType,
        Frequency: frequency,
        CronExpression: cronExpression,
        FrequencyTextFormat: ExportScheduleHelper.getFrequencyTextFormat(frequency, cronExpression),
        UserDataView: {
          AccessLevel: DataViewAccessLevel.Owner,
          Entity: {
            Id: 2,
            IsBaseEntity: true,
            Name: 'Jobs',
         },
          Name: 'New Name',
          Summary: 'Test summary',
          UserDataViewId: 1,
          Scope: DataViewScope.Personal
      },
    };
      const expectedAction = new fromScheduleExportModalActions.UpdateExportSchedule(schedule);

      fixture.detectChanges();

      instance.handleUpdateClicked();

      expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
    });

});

