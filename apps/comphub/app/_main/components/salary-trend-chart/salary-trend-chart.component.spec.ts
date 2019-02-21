import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalaryTrendChartComponent } from './salary-trend-chart.component';
import { generateMockJobSalaryTrend, generateMockJobSalaryTrendNegativePercentageChange } from '../../models';

describe('Comphub - Salary Bar Trend Component', () => {
  let instance: SalaryTrendChartComponent;
  let fixture: ComponentFixture<SalaryTrendChartComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ SalaryTrendChartComponent ],
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    fixture = TestBed.createComponent(SalaryTrendChartComponent);
    instance = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should display plus sign when percentage change is positive', () => {
    instance.salaryTrendData = generateMockJobSalaryTrend();
    instance.isHourly = false;

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should display minus sign when percentage change is negative', () => {
    instance.salaryTrendData = generateMockJobSalaryTrendNegativePercentageChange();
    instance.isHourly = false;

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

});
