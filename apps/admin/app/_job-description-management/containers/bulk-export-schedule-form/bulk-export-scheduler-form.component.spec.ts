import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BulkExportSchedulerFormComponent } from './bulk-export-scheduler-form.component';
import { combineReducers, Store, StoreModule } from '@ngrx/store';
import * as fromRootState from 'libs/state/state';
import * as fromJdmReducer from '../../reducers';
import * as fromBulkExportScheduleActions from '../../actions/bulk-export-schedule.actions';
import { FormsModule } from '@angular/forms';
import { PfCommonModule } from 'libs/core';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { generateMockBulkExportSchedule } from 'libs/models/jdm';

describe('Bulk Export Schedule Form', () => {
  let fixture: ComponentFixture<BulkExportSchedulerFormComponent>;
  let instance: BulkExportSchedulerFormComponent;
  let store: Store<fromRootState.State>;

  // Configure Testing Module for before each test
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          jdmAdmin: combineReducers(fromJdmReducer.reducers)
        }),
        FormsModule,
        PfCommonModule
      ],
      declarations: [
        BulkExportSchedulerFormComponent
      ],
      // Shallow Testing
      schemas: [NO_ERRORS_SCHEMA]
    });

    store = TestBed.get(Store);

    spyOn(store, 'dispatch');

    fixture = TestBed.createComponent(BulkExportSchedulerFormComponent);
    instance = fixture.componentInstance;
  });

  it('should add a day to daysOfWeekSelected if day is checked when onDayOfWeekChange is triggered', () => {
    const evt = {srcElement: {checked: true, value: '1'}};
    fixture.detectChanges();

    instance.daysOfWeekSelected = [];
    instance.schedule = generateMockBulkExportSchedule();

    instance.onDayOfWeekChange(evt);

    fixture.detectChanges();

    expect(instance.daysOfWeekSelected).toContain('1');
  });

  it('should remove a day from daysOfWeekSelected if day is unchecked when onDayOfWeekChange is triggered', () => {
    const evt = {srcElement: {checked: false, value: '1'}};
    fixture.detectChanges();

    instance.daysOfWeekSelected = ['1', '3'];
    instance.schedule = generateMockBulkExportSchedule();

    instance.onDayOfWeekChange(evt);

    fixture.detectChanges();

    expect(instance.daysOfWeekSelected).not.toContain('1');
  });

  it('should reset the schedule parts when onFrequencyChange is triggered', () => {
    fixture.detectChanges();

    instance.daysOfWeekSelected = ['1', '3'];
    instance.schedule = generateMockBulkExportSchedule();
    instance.schedule.Frequency = 'Monthly';

    instance.onFrequencyChange();

    expect(instance.schedule.DayOfWeek).toBe('');
    expect(instance.schedule.Occurrence).toBe('');
    expect(instance.schedule.MonthlyOccurrence).toBe('');
    expect(instance.daysOfWeekSelected).toEqual([]);
  });

  it('should call RemovingSchedule with a filename when removeSchedule is called', () => {
    const fileName = 'Test.xlsx';

    spyOn(fromBulkExportScheduleActions, 'RemovingSchedule');

    fixture.detectChanges();

    instance.removeSchedule(fileName);

    fixture.detectChanges();

    expect(fromBulkExportScheduleActions.RemovingSchedule).toHaveBeenCalledWith(fileName);
  });

  it('should return true if a fileName exists when fileNameExists is called', () => {
    const fileName = 'Mock';
    fixture.detectChanges();

    instance.schedules = [generateMockBulkExportSchedule()];

    expect(instance.fileNameExists(fileName)).toEqual(true);
  });

  it('should return false if a fileName does not exists when fileNameExists is called', () => {
    const fileName = 'Test';
    fixture.detectChanges();

    instance.schedules = [generateMockBulkExportSchedule()];

    expect(instance.fileNameExists(fileName)).toEqual(false);
  });

  it('should return true if validSchedule is called and a valid schedule is submitted', () => {
    fixture.detectChanges();

    instance.schedule = generateMockBulkExportSchedule();
    // Change the filename because we can't have a duplicate filename
    instance.schedule.FileName = 'Test';
    instance.schedules = [generateMockBulkExportSchedule()];

    expect(instance.validSchedule()).toEqual(true);
  });

  it('should return false if validSchedule is called and a invalid schedule is submitted', () => {
    fixture.detectChanges();

    instance.schedule = generateMockBulkExportSchedule();
    instance.schedule.FileName = 'Test';
    instance.schedule.Frequency = null;
    instance.schedules = [generateMockBulkExportSchedule()];

    expect(instance.validSchedule()).toEqual(false);
  });

  it('should generate a cron expression when generateCronExpression is called', () => {
    fixture.detectChanges();
    instance.schedule = generateMockBulkExportSchedule();

    instance.generateCronExpression();

    fixture.detectChanges();

    expect(instance.schedule.CronExpression).toBe('0 0 3 ? * 2,4,6 *');
  });

  it('should call AddingSchedule when submitForm is triggered and a valid schedule is submitted', () => {
    fixture.detectChanges();

    instance.schedule = generateMockBulkExportSchedule();
    // Change the filename because we can't have a duplicate filename
    instance.schedule.FileName = 'Test';
    instance.schedules = [generateMockBulkExportSchedule()];

    // Need to copy the schedule because instance.schedule will be cleared in the workflow
    const scheduleCopy = instance.schedule;

    spyOn(fromBulkExportScheduleActions, 'AddingSchedule');

    instance.submitForm();

    fixture.detectChanges();

    expect(fromBulkExportScheduleActions.AddingSchedule).toHaveBeenCalledWith(scheduleCopy);
  });
});
