import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalaryTrendChartComponent } from './salary-trend-chart.component';
import { generateMockJobSalaryTrend } from '../../models';

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
    instance.salaryTrendData = {...generateMockJobSalaryTrend(), PercentageChange: -1.7659648419365186};
    instance.isHourly = false;

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should not display plus or minus sign when percentage change is 0', () => {
    instance.salaryTrendData = {...generateMockJobSalaryTrend(), PercentageChange: 0};
    instance.isHourly = false;

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

});
