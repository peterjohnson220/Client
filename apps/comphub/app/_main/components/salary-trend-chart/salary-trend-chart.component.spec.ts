import { NO_ERRORS_SCHEMA, SimpleChange, SimpleChanges } from '@angular/core';
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
    const salaryTrendData = generateMockJobSalaryTrend();
    const changesObj: SimpleChanges = {
      salaryTrendData: new SimpleChange(null, salaryTrendData, true)
    };

    instance.salaryTrendData = salaryTrendData;
    instance.isHourly = false;

    instance.ngOnChanges(changesObj);
    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should display minus sign when percentage change is negative', () => {
    const salaryTrendData = {...generateMockJobSalaryTrend(), PercentageChange: -1.7659648419365186};
    const changesObj: SimpleChanges = {
      salaryTrendData: new SimpleChange(null, salaryTrendData, true)
    };

    instance.salaryTrendData = salaryTrendData;
    instance.isHourly = false;

    instance.ngOnChanges(changesObj);
    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should not display plus or minus sign when percentage change is 0', () => {
    const salaryTrendData = {...generateMockJobSalaryTrend(), PercentageChange: 0};
    const changesObj: SimpleChanges = {
      salaryTrendData: new SimpleChange(null, salaryTrendData, true)
    };

    instance.salaryTrendData = {...generateMockJobSalaryTrend(), PercentageChange: 0};
    instance.isHourly = false;

    instance.ngOnChanges(changesObj);
    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

});
