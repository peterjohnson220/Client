import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { generateMockEmployeeRewardsData } from 'libs/models/payfactors-api/total-rewards';

import { TrsTitleControlComponent } from './trs-title-control.component';
import { generateMockTitleControl, StatementModeEnum } from '../../models';

describe('TrsTitleControlComponent', () => {
  let component: TrsTitleControlComponent;
  let fixture: ComponentFixture<TrsTitleControlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrsTitleControlComponent ],
      schemas: [NO_ERRORS_SCHEMA]
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrsTitleControlComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    // arrange
    component.controlData = generateMockTitleControl();

    // act
    fixture.detectChanges();

    // assert
    expect(component).toBeTruthy();
  });

  it('should show in edit mode', () => {
    // arrange
    component.controlData = generateMockTitleControl();
    component.mode = StatementModeEnum.Edit;

    // act
    fixture.detectChanges();

    // assert
    expect(fixture).toMatchSnapshot();
  });

  it('should show when in preview mode', () => {
    // arrange
    component.controlData = generateMockTitleControl();
    component.mode = StatementModeEnum.Preview;

    // act
    fixture.detectChanges();

    // assert
    expect(fixture).toMatchSnapshot();
  });

  it('should show placeholder employee info in edit mode', () => {
    // arrange
    component.controlData = generateMockTitleControl();
    component.mode = StatementModeEnum.Edit;
    component.showEmployee = true;

    // act
    fixture.detectChanges();

    // assert
    const employeeHeader = fixture.debugElement.nativeElement.querySelector('h3.employee');
    expect(employeeHeader.textContent).toContain('Employee Name');
    expect(employeeHeader.textContent).toContain('Employee Id');
  });

  it('should not render the employee header when in preview mode with no employee rewards data available', () => {
    // arrange
    component.controlData = generateMockTitleControl();
    component.mode = StatementModeEnum.Preview;
    component.showEmployee = true;

    // act
    fixture.detectChanges();

    // assert
    const employeeHeader = fixture.debugElement.nativeElement.querySelector('h3.employee');
    expect(employeeHeader.textContent).toBeFalsy();
  });

  it('should render mock data in the employee header when in preview mode employee rewards data is available', () => {
    // arrange
    component.controlData = generateMockTitleControl();
    component.mode = StatementModeEnum.Preview;
    const employeeRewardsData = generateMockEmployeeRewardsData();
    component.employeeRewardsData = employeeRewardsData;
    component.showEmployee = true;

    // act
    fixture.detectChanges();

    // assert
    const employeeHeader = fixture.debugElement.nativeElement.querySelector('h3.employee');
    expect(employeeHeader.textContent).toBeTruthy();
    expect(employeeHeader.textContent).toContain(employeeRewardsData.EmployeeFirstName + ' ' + employeeRewardsData.EmployeeLastName);
    expect(employeeHeader.textContent).toContain(employeeRewardsData.EmployeeId);
  });

  it('should set the innerTitleWidth as the width of the container', () => {
    // arrange
    component.controlData = generateMockTitleControl();
    component.mode = StatementModeEnum.Edit;
    component.titleInnerWidth = '66.67%';

    // act
    fixture.detectChanges();

    // assert
    expect(fixture).toMatchSnapshot();
  });

  it('should add a `background-graphics` class to the container when graphics are enabled', () => {
    // arrange
    component.controlData = generateMockTitleControl();
    component.mode = StatementModeEnum.Edit;
    component.backgroundGraphicsEnabled = true;

    // act
    fixture.detectChanges();

    // assert
    expect(fixture).toMatchSnapshot();
  });
});
