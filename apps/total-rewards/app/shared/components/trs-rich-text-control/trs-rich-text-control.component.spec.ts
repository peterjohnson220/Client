import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { TrsRichTextControlComponent } from './trs-rich-text-control.component';
import { StatementModeEnum, generateMockEmployeeRewardsData } from '../../models';

const htmlWithFirstName =
  `<p>Test</p>
   <p>
     <span class="mention" data-index="0" data-denotation-char="" data-id="EmployeeFirstName" data-value="Employee First Name">
       <span contenteditable="false">
         <span class="ql-mention-denotation-char"></span>Employee First Name
       </span>
     </span>
   </p>`;

const htmlWithDateOfBirth =
  `<p>Test</p>
   <p>
     <span class="mention" data-index="0" data-denotation-char="" data-id="EmployeeDOB" data-value="Employee Date Of Birth">
       <span contenteditable="false">
         <span class="ql-mention-denotation-char"></span>Employee Date Of Birth
       </span>
     </span>
   </p>`;

const htmlWithDateOfHire =
  `<p>Test</p>
   <p>
     <span class="mention" data-index="2" data-denotation-char="" data-id="EmployeeDOH" data-value="Employee Date Of Hire">
       <span contenteditable="false">
         <span class="ql-mention-denotation-char"></span>Employee Date Of Hire
       </span>
     </span>
   </p>`;

const htmlWithFullTimeEmployees =
  `<p>Test</p>
   <p>
     <span class="mention" data-index="0" data-denotation-char="" data-id="EmployeeFTE" data-value="Employee Full Time Employee">
       <span contenteditable="false">
         <span class="ql-mention-denotation-char"></span>Employee Full Time Employee
       </span>
     </span>
   </p>`;

describe('TrsChartControlComponent', () => {
  let component: TrsRichTextControlComponent;
  let fixture: ComponentFixture<TrsRichTextControlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TrsRichTextControlComponent],
      schemas: [NO_ERRORS_SCHEMA]
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrsRichTextControlComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    // arrange
    component.controlData = { Title: {} } as any;

    // act
    fixture.detectChanges();

    // assert
    expect(component).toBeTruthy();
  });

  it('bindEmployeeData should maintain data field placeholders when not in preview mode', () => {
    // arrange
    component.controlData = { Title: {}, Content: htmlWithFirstName, DataFields: [] } as any;
    component.employeeRewardsData = generateMockEmployeeRewardsData();
    component.mode = StatementModeEnum.Edit;

    // act
    component.bindEmployeeData();

    // assert
    expect(component.htmlContent).toEqual(htmlWithFirstName);
  });

  it('bindEmployeeData should maintain STATIC TEXT when no data fields exist in preview mode', () => {
    // arrange
    const staticText = '<p>static text</p><p>static text</p><p>static text</p><p>static text</p>';
    component.controlData = { Title: {}, Content: staticText, DataFields: [] } as any;
    component.employeeRewardsData = generateMockEmployeeRewardsData();
    component.mode = StatementModeEnum.Preview;

    // act
    component.bindEmployeeData();

    // assert
    expect(component.htmlContent).toEqual(staticText);
  });

  it('bindEmployeeData should populate STRING placeholder data fields with employee rewards data when in preview mode', () => {
    // arrange
    component.employeeRewardsData = generateMockEmployeeRewardsData();
    component.controlData = { Title: {}, Content: htmlWithFirstName, DataFields: [{ Key: 'EmployeeFirstName', Value: 'Employee First Name' }] } as any;
    component.mode = StatementModeEnum.Preview;

    // act
    component.bindEmployeeData();

    // assert
    expect(component.htmlContent !== htmlWithFirstName).toBeTruthy();
    expect(component.htmlContent.indexOf('Employee First Name')).toBe(-1);
    expect(component.htmlContent.indexOf('John')).toBeTruthy();
  });

  it('bindEmployeeData should populate DATE placeholder data fields with employee rewards data when in preview mode', () => {
    // arrange
    const employeeRewardsData = generateMockEmployeeRewardsData();
    component.employeeRewardsData = employeeRewardsData;
    component.controlData = { Title: {}, Content: htmlWithDateOfBirth, DataFields: [{ Key: 'EmployeeDOB', Value: 'Employee DOB' }] } as any;
    component.mode = StatementModeEnum.Preview;

    // act
    component.bindEmployeeData();

    // assert
    expect(component.htmlContent !== htmlWithDateOfBirth).toBeTruthy();
    expect(component.htmlContent.indexOf('Employee DOB')).toBe(-1);
    expect(component.htmlContent.indexOf(component.formatDataFieldValue(employeeRewardsData.EmployeeDOB))).toBeGreaterThan(0);
  });

  it('bindEmployeeData should populate NUMBER placeholder data fields with employee rewards data when in preview mode', () => {
    // arrange
    const employeeRewardsData = generateMockEmployeeRewardsData();
    component.employeeRewardsData = employeeRewardsData;
    component.controlData = {
      Title: {},
      Content: htmlWithFullTimeEmployees,
      DataFields: [{ Key: 'EmployeeFTE', Value: 'Employee FTE' }]
    } as any;
    component.mode = StatementModeEnum.Preview;

    // act
    component.bindEmployeeData();

    // assert
    expect(component.htmlContent !== htmlWithFullTimeEmployees).toBeTruthy();
    expect(component.htmlContent.indexOf('Employee FTE')).toBe(-1);
    expect(component.htmlContent.indexOf(component.formatDataFieldValue(employeeRewardsData.EmployeeFTE))).toBeGreaterThan(0);
  });

  it('bindEmployeeData should populate MULTIPLE placeholder data fields with employee rewards data when in preview mode', () => {
    // arrange
    const employeeRewardsData = generateMockEmployeeRewardsData();
    component.employeeRewardsData = employeeRewardsData;
    component.controlData = {
      Title: {},
      Content: htmlWithFullTimeEmployees + htmlWithDateOfBirth + htmlWithDateOfHire + htmlWithFirstName,
      DataFields: [
        { Key: 'EmployeeFTE', Value: 'Employee FTE' },
        { Key: 'EmployeeDOB', Value: 'Employee DOB' },
        { Key: 'EmployeeDOH', Value: 'Employee DOH' },
        { Key: 'EmployeeFirstName', Value: 'Employee First Name' }
      ]
    } as any;
    component.mode = StatementModeEnum.Preview;

    // act
    component.bindEmployeeData();

    // assert
    expect(component.htmlContent !== (htmlWithFullTimeEmployees + htmlWithDateOfBirth + htmlWithDateOfHire + htmlWithFirstName)).toBeTruthy();

    expect(component.htmlContent.indexOf('Employee FTE')).toBe(-1);
    expect(component.htmlContent.indexOf('Employee DOB')).toBe(-1);
    expect(component.htmlContent.indexOf('Employee DOH')).toBe(-1);
    expect(component.htmlContent.indexOf('Employee First Name')).toBe(-1);

    expect(component.htmlContent.indexOf(employeeRewardsData.EmployeeFTE.toString())).toBeGreaterThan(0);
    expect(component.htmlContent.indexOf(component.formatDataFieldValue(employeeRewardsData.EmployeeDOB))).toBeGreaterThan(0);
    expect(component.htmlContent.indexOf(component.formatDataFieldValue(employeeRewardsData.EmployeeDOH))).toBeGreaterThan(0);
    expect(component.htmlContent.indexOf(employeeRewardsData.EmployeeFirstName)).toBeGreaterThan(0);
  });
});
