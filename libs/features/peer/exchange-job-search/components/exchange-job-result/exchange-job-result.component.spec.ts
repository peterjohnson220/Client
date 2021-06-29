import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { EmployeeSearchResult } from 'libs/models/payfactors-api/total-rewards/response/employee-search-response.model';

import { ExchangeJobResultComponent } from './exchange-job-result.component';

describe('ExchangeJobResultComponent', () => {
  let component: ExchangeJobResultComponent;
  let fixture: ComponentFixture<ExchangeJobResultComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ExchangeJobResultComponent ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExchangeJobResultComponent);
    component = fixture.componentInstance;
    component.exchangeJob = {} as EmployeeSearchResult;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display employee info when available', () => {
    // arrange
    component.exchangeJob = {
      FirstName: 'Test',
      LastName: 'Employee',
      EmployeeId: 'EMP123',
      JobTitle: 'Test Job Title'
    } as EmployeeSearchResult;

    // act
    fixture.detectChanges();

    // assert
    expect(fixture).toMatchSnapshot();
  });
});
