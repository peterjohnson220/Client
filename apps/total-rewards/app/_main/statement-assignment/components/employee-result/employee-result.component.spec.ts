import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { EmployeeSearchResult } from 'libs/models/payfactors-api/total-rewards/response/employee-search-response.model';

import { EmployeeResultComponent } from './employee-result.component';

describe('EmployeeResultComponent', () => {
  let component: EmployeeResultComponent;
  let fixture: ComponentFixture<EmployeeResultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeeResultComponent ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeResultComponent);
    component = fixture.componentInstance;
    component.employee = {} as EmployeeSearchResult;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display employee info when available', () => {
    // arrange
    component.employee = {
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
