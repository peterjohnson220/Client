import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportFrequencyComponent } from './export-frequency.component';
import { DayOfWeek } from '../../helpers';

describe('Export Scheduler Module - Export Frequency Component', () => {
  let fixture: ComponentFixture<ExportFrequencyComponent>;
  let instance: ExportFrequencyComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ExportFrequencyComponent],
      schemas: [NO_ERRORS_SCHEMA]
    });

    fixture = TestBed.createComponent(ExportFrequencyComponent);
    instance = fixture.componentInstance;
  });

  it('should add selected day into selectedDaysOfWeek when day checkbox is checked', () => {
    instance.selectedDaysOfWeek = [{
      Name: 'Monday',
      Value: 'MON',
      Order: 1
    }];

    const tuesday: DayOfWeek = {
      Name: 'Tuesday',
      Value: 'TUES',
      Order: 2
    };

    const expectedResults: DayOfWeek[] = [
      {
        Name: 'Monday',
        Value: 'MON',
        Order: 1
      },
      {
        Name: 'Tuesday',
        Value: 'TUES',
        Order: 2
      }
      ];

    instance.onDayOfWeekChange(tuesday);

    expect(instance.selectedDaysOfWeek).toEqual(expectedResults);
  });

  it('should remove selected day from selectedDaysOfWeek when day checkbox is unchecked', () => {
    const selectedDaysOfWeek: DayOfWeek[] = [
      {
        Name: 'Monday',
        Value: 'MON',
        Order: 1
      },
      {
        Name: 'Tuesday',
        Value: 'TUES',
        Order: 2
      }
    ];

    const expectedResults: DayOfWeek[] = [{
      Name: 'Monday',
      Value: 'MON',
      Order: 1
    }];

    instance.selectedDaysOfWeek = selectedDaysOfWeek;

    instance.onDayOfWeekChange(selectedDaysOfWeek[1]);

    expect(instance.selectedDaysOfWeek).toEqual(expectedResults);
  });
});
