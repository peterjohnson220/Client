import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { generateMockEmployeeRewardsData } from 'libs/models/payfactors-api/total-rewards';

import { TrsRichTextControlComponent } from './trs-rich-text-control.component';
import { StatementModeEnum } from '../../models';

const markupWithDataFields = `
  <p>start</p>
  <p>
    <span class="mention" data-index="1" data-denotation-char="" data-id="EmployeeFirstName" data-value="Employee First Name">
      <span contenteditable="false">
        <span class="ql-mention-denotation-char"></span>Employee First Name
      </span>
    </span>
    <span class="mention" data-index="2" data-denotation-char="" data-id="EmployeeLastName" data-value="Employee Last Name">
      <span contenteditable="false">
        <span class="ql-mention-denotation-char"></span>Employee Last Name
      </span>
    </span>
  </p>
  <p>end</p>`;

const markupWithFormatting = `
  <p><span class="ql-size-small">small</span></p>
  <p>medium</p>
  <p><span class="ql-size-large">large</span></p>
  <p><strong>bold</strong></p>
  <p><em>italic</em></p>
  <p><u>underline</u></p>
  <p><span style="color: rgb(255, 153, 0);">orange</span></p>
  <p class="ql-align-center">centered</p>
  <ul>
    <li>bullet 1</li>
    <li>bullet 2</li>
  </ul>`;

const markupWithDataFieldsAndFormatting = `
  <p>start</p>
  <ul>
    <li>
      <u>
        <span class="mention" data-index="3" data-denotation-char="" data-id="EmployeeLastName" data-value="Employee Last Name">
          <span contenteditable="false"><span class="ql-mention-denotation-char"></span>Employee Last Name</span>
        </span>
      </u>
    </li>
    <li>Dept:
      <span class="mention" data-index="0" data-denotation-char="" data-id="EmployeeDepartment" data-value="Employee Department">
        <span contenteditable="false">
          <span class="ql-mention-denotation-char"></span>Employee Department
        </span>
      </span>
    </li>
    <li>Email:
      <strong>
        <span class="mention" data-index="1" data-denotation-char="" data-id="EmployeeEmailAddress" data-value="Employee Email Address">
          <span contenteditable="false">
            <span class="ql-mention-denotation-char"></span>Employee Email Address
          </span>
        </span>
      </strong>
    </li>
  </ul>
  <p>end</p>`;

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

  it('bindEmployeeDataHtml should maintain simple content with no data fields used', () => {
    // arrange
    component.controlData = { Title: { Default: 'Title' } } as any;
    component.mode = StatementModeEnum.Preview;
    component.htmlContent = '<p>static text that should not change</p>';

    // act
    const boundHtml = component.bindEmployeeDataHtml() as any;

    // assert
    const testDiv = document.createElement('div');
    testDiv.innerHTML = boundHtml.changingThisBreaksApplicationSecurity;
    expect(testDiv.textContent).toEqual('static text that should not change');
  });

  it('bindEmployeeDataHtml should persist styling attributes with no data fields used', () => {
    // arrange
    component.controlData = { Title: { Default: 'Title' } } as any;
    component.mode = StatementModeEnum.Preview;
    const rewardsData = generateMockEmployeeRewardsData();
    component.employeeRewardsData = rewardsData;
    component.htmlContent = markupWithFormatting;

    // act
    const boundHtml = component.bindEmployeeDataHtml() as any;

    // assert
    const testDiv = document.createElement('div');
    testDiv.innerHTML = boundHtml.changingThisBreaksApplicationSecurity;
    expect(testDiv.innerHTML).toContain(markupWithFormatting);
  });

  it('bindEmployeeData should replace data field placeholders with actual employee data', () => {
    // arrange
    component.controlData = {
      Title: { Default: 'Title' },
      DataFields: [
        { Key: 'EmployeeFirstName', Value: 'Employee First Name' },
        { Key: 'EmployeeLastName', Value: 'Employee Last Name' },
      ]
    } as any;
    component.mode = StatementModeEnum.Preview;
    const rewardsData = generateMockEmployeeRewardsData();
    component.employeeRewardsData = rewardsData;
    component.htmlContent = markupWithDataFields;

    // act
    const boundHtml = component.bindEmployeeDataHtml() as any;

    // assert
    const testDiv = document.createElement('div');
    testDiv.innerHTML = boundHtml.changingThisBreaksApplicationSecurity;

    expect(testDiv.textContent).toContain(rewardsData['EmployeeFirstName']);
    expect(testDiv.textContent).toContain(rewardsData['EmployeeLastName']);
    expect(testDiv.textContent).toContain('start');
    expect(testDiv.textContent).toContain('end');
    expect(testDiv.textContent).not.toContain('EmployeeFirstName');
    expect(testDiv.textContent).not.toContain('EmployeeLastName');
  });

  it('bindEmployeeData should maintain formatting when data fields are used', () => {
    // arrange
    component.controlData = {
      Title: { Default: 'Title' },
      DataFields: [
        { Key: 'EmployeeLastName', Value: 'Employee Last Name' },
        { Key: 'EmployeeDepartment', Value: 'Employee Department' },
        { Key: 'EmployeeEmailAddress', Value: 'Employee Email Address' },
      ]
    } as any;
    component.mode = StatementModeEnum.Preview;
    const rewardsData = generateMockEmployeeRewardsData();
    component.employeeRewardsData = rewardsData;
    component.htmlContent = markupWithDataFieldsAndFormatting;

    // act
    const boundHtml = component.bindEmployeeDataHtml() as any;

    // assert
    const testDiv = document.createElement('div');
    testDiv.innerHTML = boundHtml.changingThisBreaksApplicationSecurity;

    expect(testDiv.querySelectorAll('ul').length).toBe(1);
    expect(testDiv.querySelectorAll('li').length).toBe(3);
    expect(testDiv.querySelectorAll('u').length).toBe(1);
    expect(testDiv.querySelector('u').innerHTML).toContain(rewardsData['EmployeeLastName']);
    expect(testDiv.querySelectorAll('strong').length).toBe(1);
    expect(testDiv.querySelector('strong').innerHTML).toContain(rewardsData['EmployeeEmailAddress']);
  });

  it('formatDataFieldValue should return an empty string for non string, number or date values', () => {
    // arrange, act, assert
    expect(component.formatDataFieldValue(undefined)).toBe('');
    expect(component.formatDataFieldValue({})).toBe('');
    expect(component.formatDataFieldValue(null)).toBe('');
    expect(component.formatDataFieldValue([])).toBe('');
  });

  it('formatDataFieldValue should return numbers as a string', () => {
    // arrange, act, assert
    expect(component.formatDataFieldValue(12)).toBe('12');
    expect(component.formatDataFieldValue(99999)).toBe('99999');
    expect(component.formatDataFieldValue(0)).toBe('0');
  });

  it('formatDataFieldValue should return dates in format MMM dd yyyy', () => {
    // arrange, act, assert
    expect(component.formatDataFieldValue(new Date('5/8/2020'))).toBe('May 8 2020');
    expect(component.formatDataFieldValue(new Date('1/22/1981'))).toBe('Jan 22 1981');
    expect(component.formatDataFieldValue(new Date('11/1/2082'))).toBe('Nov 1 2082');
  });

  it('formatDataFieldValue should return strings as is', () => {
    // arrange, act, assert
    expect(component.formatDataFieldValue('')).toBe('');
    expect(component.formatDataFieldValue('string with spaces')).toBe('string with spaces');
    expect(component.formatDataFieldValue('nospaces')).toBe('nospaces');
  });

  it('quillToolbarContainer should contain supported font families when enabled', () => {
    // arrange
    component.showFontFamilyMenu = true;

    // act
    const config = component.quillToolbarContainer;

    // assert
    expect(config[0][0].font).toStrictEqual(['Arial', 'Georgia', 'TimesNewRoman', 'Verdana']);
  });

  it('quillToolbarContainer should not contain font families when disabled', () => {
    // arrange
    component.showFontFamilyMenu = false;

    // act
    const config = component.quillToolbarContainer;

    // assert
    expect(config[0][0].font).toBeUndefined();
  });

  it('should not include Quill editor in print mode', () => {
    // arrange
    component.mode = StatementModeEnum.Print;
    component.controlData = { Title: {} } as any;

    // act
    fixture.detectChanges();

    // assert
    expect(fixture.debugElement.nativeElement.querySelector('quill-editor')).toBeFalsy();
  });

  it('should not include Quill editor in preview mode', () => {
    // arrange
    component.mode = StatementModeEnum.Preview;
    component.controlData = { Title: {} } as any;

    // act
    fixture.detectChanges();

    // assert
    expect(fixture.debugElement.nativeElement.querySelector('quill-editor')).toBeFalsy();
  });

  it('should include Quill editor in edit mode', () => {
    // arrange
    component.mode = StatementModeEnum.Edit;
    component.controlData = { Title: {} } as any;

    // act
    fixture.detectChanges();

    // assert
    expect(fixture.debugElement.nativeElement.querySelector('quill-editor')).toBeTruthy();
  });
});
