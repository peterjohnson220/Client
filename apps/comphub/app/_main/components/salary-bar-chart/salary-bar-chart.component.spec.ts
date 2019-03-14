import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalaryBarChartComponent } from './salary-bar-chart.component';

describe('Comphub - Salary Bar Chart Component', () => {
  let instance: SalaryBarChartComponent;
  let fixture: ComponentFixture<SalaryBarChartComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ SalaryBarChartComponent ],
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    fixture = TestBed.createComponent(SalaryBarChartComponent);
    instance = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should values to 2 decimal places when using hourly', () => {

    instance.isHourly = true;
    instance.salary25 = 100000;
    instance.salary50 = 125000;
    instance.salary75 = 150000;

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should display values to 1 decimal place when using annual', () => {

    instance.isHourly = false;
    instance.salary25 = 100000;
    instance.salary50 = 125000;
    instance.salary75 = 150000;

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should convert annual values to hourly values', () => {
    instance.isHourly = true;
    const actualValue = instance.calculateDataByRate(100000);

    expect(actualValue).toEqual(100000 / 2080);
  });

  it('should convert annual values to thousands when annual', () => {
    instance.isHourly = false;
    const actualValue = instance.calculateDataByRate(100000);

    expect(actualValue).toEqual(100000 / 1000);
  });


});
