import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { CompanyEmployee } from 'libs/models/company';

import { UnassignEmployeesModalComponent } from './unassign-employees-modal.component';

describe('UnassignEmployeesModalComponent', () => {
  let component: UnassignEmployeesModalComponent;
  let fixture: ComponentFixture<UnassignEmployeesModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnassignEmployeesModalComponent ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnassignEmployeesModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show employee name in modal message when single employee action', () => {
    // arrange
    component.isSingleEmployeeUnassign = true;
    component.singleEmployee = {
      FirstName: 'John',
      LastName: 'Smith'
    } as CompanyEmployee;

    // act
    fixture.detectChanges();

    // assert
    const message = fixture.debugElement.nativeElement.querySelector('p');
    expect(message.textContent.indexOf('John Smith')).toBeTruthy();
  });

  it('should show the expected number of employees in the modal message', () => {
    // arrange
    component.isSingleEmployeeUnassign = false;
    component.selectedCompanyEmployeeIds = [1, 2, 3];

    // act
    fixture.detectChanges();

    // assert
    const message = fixture.debugElement.nativeElement.querySelector('p');
    expect(message.textContent.indexOf('3 employees')).toBeTruthy();
  });

  it('should hide the employee pluralization when 1 employee is selected', () => {
    // arrange
    component.isSingleEmployeeUnassign = false;
    component.selectedCompanyEmployeeIds = [3];

    // act
    fixture.detectChanges();

    // assert
    const message = fixture.debugElement.nativeElement.querySelector('p');
    expect(message.textContent.indexOf('1 employee')).toBeTruthy();
  });
});
