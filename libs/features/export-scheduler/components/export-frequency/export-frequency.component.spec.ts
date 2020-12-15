import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportFrequencyComponent } from './export-frequency.component';

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
    instance.selectedDaysOfWeek = ['Monday'];

    instance.onDayOfWeekChange('Tuesday');

    expect(instance.selectedDaysOfWeek).toEqual(['Monday', 'Tuesday']);
  });

  it('should remove selected day from selectedDaysOfWeek when day checkbox is unchecked', () => {
    instance.selectedDaysOfWeek = ['Monday', 'Tuesday'];

    instance.onDayOfWeekChange('Tuesday');

    expect(instance.selectedDaysOfWeek).toEqual(['Monday']);
  });
});
