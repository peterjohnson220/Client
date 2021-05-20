import { ComponentFixture, TestBed, tick, fakeAsync, waitForAsync } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';

import { generateMockEmployeeRewardsData } from 'libs/models/payfactors-api/total-rewards';
import { AbstractFeatureFlagService } from 'libs/core/services/feature-flags';

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

const markupWithEmployeesUdfDataField = `
  <p>
    <span class="mention" data-index="0" data-denotation-char="" data-id="EmployeesUdf_UDF_CHAR_1" data-value="1 (custom)">
      <span contenteditable="false">
        <span class="ql-mention-denotation-char"></span>1 (custom)
      </span>
    </span>
  </p>`;

const markupWithJobsUdfDataField = `
  <p>
    <span class="mention" data-index="14" data-denotation-char="" data-id="JobsUdf_UDF_CHAR_1" data-value="Custom (Custom)">
      <span contenteditable="false">
        <span class="ql-mention-denotation-char"></span>Custom (Custom)
      </span>
    </span>
  </p>
`;

describe('TrsRichTextControlComponent', () => {
  let component: TrsRichTextControlComponent;
  let fixture: ComponentFixture<TrsRichTextControlComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [TrsRichTextControlComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [{
        provide: AbstractFeatureFlagService,
        useValue: { enabled: jest.fn(), bindEnabled: jest.fn() }
      }]
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrsRichTextControlComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    // arrange
    component.controlData = { Title: { Default: 'Title' } } as any;

    // act
    fixture.detectChanges();

    // assert
    expect(component).toBeTruthy();
  });

  it('should show a tooltip outside of print mode with at least one `AvailableDatafields` and `ShowTitle` true', () => {
    // arrange
    component.controlData = {
      Title: { Default: 'Title' },
      AvailableDataFields: [{ Key: 'Key', Value: 'Value' }],
      ShowTitle: true
    } as any;
    component.mode = StatementModeEnum.Preview;

    // act
    fixture.detectChanges();

    // assert
    const tooltipLabel = fixture.debugElement.nativeElement.querySelector('.tooltip-wrapper');
    expect(tooltipLabel).toBeTruthy();
  });

  it('should hide the tooltip in print mode when `AvailableDatafields` is falsy', () => {
    // arrange
    component.controlData = {
      Title: { Default: 'Title' },
      ShowTitle: true
    } as any;
    component.showTitle = true;
    component.mode = StatementModeEnum.Print;

    // act
    fixture.detectChanges();

    // assert
    const tooltipLabel = fixture.debugElement.nativeElement.querySelector('.tooltip-wrapper');
    expect(tooltipLabel).toBeFalsy();
  });

  it('should show a tooltip when not in print mode with at least one `AvailableDatafields`', () => {
    // arrange
    component.controlData = {
      Title: { Default: 'Title' },
      AvailableDataFields: [{ Key: 'Key', Value: 'Value' }],
    } as any;
    component.mode = StatementModeEnum.Preview;

    // act
    fixture.detectChanges();

    // assert
    const tooltipLabel = fixture.debugElement.nativeElement.querySelector('.tooltip-wrapper');
    expect(tooltipLabel).toBeTruthy();
  });

  it('should hide the tooltip in print mode when `AvailableDatafields` is falsy', () => {
    // arrange
    component.controlData = { Title: { Default: 'Title' } } as any;
    component.mode = StatementModeEnum.Print;

    // act
    fixture.detectChanges();

    // assert
    const tooltipLabel = fixture.debugElement.nativeElement.querySelector('.tooltip-wrapper');
    expect(tooltipLabel).toBeFalsy();
  });

  it('bindDataFields should maintain simple content with no data fields used', () => {
    // arrange
    component.controlData = { Title: { Default: 'Title' } } as any;
    component.mode = StatementModeEnum.Preview;
    component.htmlContent = '<p>static text that should not change</p>';

    // act
    const boundHtml = component.bindDataFields() as any;

    // assert
    const testDiv = document.createElement('div');
    testDiv.innerHTML = boundHtml.changingThisBreaksApplicationSecurity;
    expect(testDiv.textContent).toEqual('static text that should not change');
  });

  it('bindDataFields should persist styling attributes with no data fields used', () => {
    // arrange
    component.controlData = { Title: { Default: 'Title' } } as any;
    component.mode = StatementModeEnum.Preview;
    component.employeeRewardsData = generateMockEmployeeRewardsData();
    component.htmlContent = markupWithFormatting;

    // act
    const boundHtml = component.bindDataFields() as any;

    // assert
    const testDiv = document.createElement('div');
    testDiv.innerHTML = boundHtml.changingThisBreaksApplicationSecurity;
    expect(testDiv.innerHTML).toContain(markupWithFormatting);
  });

  it('bindDataFields should replace data field placeholders with actual employee data', () => {
    // arrange
    component.controlData = {
      Title: { Default: 'Title' },
      AvailableDataFields: [
        { Key: 'EmployeeFirstName', Value: 'Employee First Name' },
        { Key: 'EmployeeLastName', Value: 'Employee Last Name' },
      ]
    } as any;
    component.mode = StatementModeEnum.Preview;
    const rewardsData = generateMockEmployeeRewardsData();
    component.employeeRewardsData = rewardsData;
    component.htmlContent = markupWithDataFields;

    // act
    const boundHtml = component.bindDataFields() as any;

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

  it('bindDataFields should maintain formatting when data fields are used', () => {
    // arrange
    component.controlData = {
      Title: { Default: 'Title' },
      AvailableDataFields: [
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
    const boundHtml = component.bindDataFields() as any;

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

  it('bindDataFields should insert the appropriate value when an Employees UDF is defined for an employee', () => {
    // arrange
    component.controlData = {
      Title: { Default: 'Title' },
      AvailableDataFields: [{ Key: 'EmployeesUdf_UDF_CHAR_1', Value: '1 (custom)' }]
    } as any;
    component.mode = StatementModeEnum.Print;
    const rewardsData = { ...generateMockEmployeeRewardsData(), EmployeesUdf: { UDF_CHAR_1: 12345 } } as any;
    component.employeeRewardsData = rewardsData;
    component.htmlContent = markupWithEmployeesUdfDataField;

    // act
    const boundHtml = component.bindDataFields() as any;

    // assert
    const testDiv = document.createElement('div');
    testDiv.innerHTML = boundHtml.changingThisBreaksApplicationSecurity;
    expect(testDiv.textContent).toContain('12345');
  });

  it('bindDataFields should insert whitespace when a UDF is not defined for an employee', () => {
    // arrange
    component.controlData = {
      Title: { Default: 'Title' },
      AvailableDataFields: [{ Key: 'EmployeesUdf_UDF_CHAR_1', Value: '1 (custom)' }]
    } as any;
    component.mode = StatementModeEnum.Print;
    const rewardsData = { ...generateMockEmployeeRewardsData(), EmployeesUdf: { } } as any;
    component.employeeRewardsData = rewardsData;
    component.htmlContent = markupWithEmployeesUdfDataField;

    // act
    const boundHtml = component.bindDataFields() as any;

    // assert
    const testDiv = document.createElement('div');
    testDiv.innerHTML = boundHtml.changingThisBreaksApplicationSecurity;
    expect(testDiv.textContent.replace('/n', '').trim()).toBeFalsy();
  });

  it('bindDataFields should insert the appropriate value when a Jobs UDF is defined for an employee', () => {
    // arrange
    component.controlData = {
      Title: { Default: 'Title' },
      AvailableDataFields: [{ Key: 'JobsUdf_UDF_CHAR_1', Value: 'Custom (Custom)' }]
    } as any;
    component.mode = StatementModeEnum.Print;
    const rewardsData = { ...generateMockEmployeeRewardsData(), EmployeesUdf: { UDF_CHAR_1: 'emps' }, JobsUdf: { UDF_CHAR_1: 'jobs' } } as any;
    component.employeeRewardsData = rewardsData;
    component.htmlContent = markupWithJobsUdfDataField;

    // act
    const boundHtml = component.bindDataFields() as any;

    // assert
    const testDiv = document.createElement('div');
    testDiv.innerHTML = boundHtml.changingThisBreaksApplicationSecurity;
    expect(testDiv.textContent).toContain('jobs');
    expect(testDiv.textContent).not.toContain('emps');
  });

  it('bindDataFields should escape scripts and markup masquerading as employee data field content', () => {
    // arrange
    component.controlData = {
      Title: { Default: 'Title' },
      AvailableDataFields: [
        { Key: 'EmployeeFirstName', Value: 'Employee First Name' },
        { Key: 'EmployeeLastName', Value: 'Employee Last Name' },
      ]
    } as any;
    component.mode = StatementModeEnum.Print;
    const rewardsData = {
      ...generateMockEmployeeRewardsData(),
      EmployeeFirstName: '<script>alert(`nooooo`)</script>',
      EmployeeLastName: '<h1>h1 content</h1>`'
    } as any;
    component.employeeRewardsData = rewardsData;
    component.htmlContent = markupWithDataFields;

    // act
    const boundHtml = component.bindDataFields() as any;

    // assert
    expect(boundHtml.toString().indexOf('<h1>h1 content</h1>')).toBe(-1);
    expect(boundHtml.toString().indexOf('h1 content')).toBeGreaterThan(-1);
    expect(boundHtml.toString().indexOf('<script>')).toBe(-1);
    expect(boundHtml.toString().indexOf('nooooo')).toBeGreaterThan(-1);
  });

  it('bindDataFields should escape scripts and markup masquerading as UDF data field content', () => {
    // arrange
    component.controlData = {
      Title: { Default: 'Title' },
      AvailableDataFields: [{ Key: 'EmployeesUdf_UDF_CHAR_1', Value: '1 (custom)' }]
    } as any;
    component.mode = StatementModeEnum.Print;
    const rewardsData = { ...generateMockEmployeeRewardsData(), EmployeesUdf: { UDF_CHAR_1: '<script>alert(`nooooo`)</script><h1>h1 content</h1>`' } } as any;
    component.employeeRewardsData = rewardsData;
    component.htmlContent = markupWithEmployeesUdfDataField;

    // act
    const boundHtml = component.bindDataFields() as any;

    // assert
    expect(boundHtml.toString().indexOf('<h1>h1 content</h1>')).toBe(-1);
    expect(boundHtml.toString().indexOf('h1 content')).toBeGreaterThan(-1);
    expect(boundHtml.toString().indexOf('<script>')).toBe(-1);
    expect(boundHtml.toString().indexOf('nooooo')).toBeGreaterThan(-1);
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

  it('should not include Quill editor in print mode', () => {
    // arrange
    component.mode = StatementModeEnum.Print;
    component.controlData = { Title: { Default: 'Title' } } as any;

    // act
    fixture.detectChanges();

    // assert
    expect(fixture.debugElement.nativeElement.querySelector('quill-editor')).toBeFalsy();
  });

  it('should not include Quill editor in preview mode', () => {
    // arrange
    component.mode = StatementModeEnum.Preview;
    component.controlData = { Title: { Default: 'Title' } } as any;

    // act
    fixture.detectChanges();

    // assert
    expect(fixture.debugElement.nativeElement.querySelector('ql-editor')).toBeFalsy();
  });

  it('should include Quill editor in edit mode', () => {
    // arrange
    const controlId = '123-dfg-456';
    const toolbar = document.createElement('div');
    toolbar.setAttribute('id', 'quill-editor-toolbar-' + controlId);
    document.body.appendChild(toolbar);
    component.controlData = {
      Id: controlId,
      Title: {
        Default: 'Title'
      }
    } as any;
    component.mode = StatementModeEnum.Edit;

    // act
    fixture.detectChanges();

    // assert
    expect(fixture.debugElement.queryAll(By.css('.ql-editor'))).toBeTruthy();
  });

  it('should only validate content length when changes unrelated to mode occur', () => {
    // arrange
    component.mode = StatementModeEnum.Preview;
    component.controlData = { Title: { Default: 'Title' } } as any;
    component.closeQuillMention = jest.fn();
    component.isContentHeightGreaterThanContainerHeight = jest.fn();
    component.createQuillEditor = jest.fn();

    // act
    component.ngOnChanges({} as any);

    // assert
    expect(component.isContentHeightGreaterThanContainerHeight).toHaveBeenCalledTimes(1);
    expect(component.closeQuillMention).toHaveBeenCalledTimes(0);
    expect(component.createQuillEditor).toHaveBeenCalledTimes(0);
  });

  it('should close quill mention when changing from edit to preview', () => {
    // arrange
    component.mode = StatementModeEnum.Edit;
    component.controlData = { Title: { Default: 'Title' } } as any;
    component.closeQuillMention = jest.fn();
    component.isContentHeightGreaterThanContainerHeight = jest.fn();
    component.createQuillEditor = jest.fn();

    // act
    component.ngOnChanges({ mode: { currentValue: StatementModeEnum.Preview, previousValue: StatementModeEnum.Edit } } as any);

    // assert
    expect(component.createQuillEditor).not.toBeCalled();
    expect(component.closeQuillMention).toHaveBeenCalledTimes(1);
    expect(component.isContentHeightGreaterThanContainerHeight).toHaveBeenCalledTimes(1);
  });

  it('should create the quill editor behind a setTimeout when changing from preview to edit', fakeAsync(() => {
    // arrange
    component.mode = StatementModeEnum.Preview;
    component.controlData = { Title: { Default: 'Title' } } as any;
    component.closeQuillMention = jest.fn();
    component.isContentHeightGreaterThanContainerHeight = jest.fn();
    component.createQuillEditor = jest.fn();

    // act
    component.ngOnChanges({ mode: { currentValue: StatementModeEnum.Edit, previousValue: StatementModeEnum.Preview } } as any);

    // assert
    expect(component.createQuillEditor).not.toBeCalled();
    expect(component.closeQuillMention).toHaveBeenCalledTimes(0);
    expect(component.isContentHeightGreaterThanContainerHeight).toHaveBeenCalledTimes(1);

    tick(0);

    expect(component.createQuillEditor).toHaveBeenCalledTimes(1);
  }));

  const isEditorFocused = true;
  const isFeatureEnabled = true;
  const shouldExpectRadialCounter = true;

  it.each([
    [isEditorFocused, isFeatureEnabled, shouldExpectRadialCounter],
    [isEditorFocused, !isFeatureEnabled, !shouldExpectRadialCounter],
    [!isEditorFocused, isFeatureEnabled, !shouldExpectRadialCounter],
    [!isEditorFocused, !isFeatureEnabled, !shouldExpectRadialCounter],
  ])
  ('rich text editor focused (%s), feature flag enabled (%s), expect radial text counter displayed (%s)',
  (editorFocused: boolean, featureEnabled: boolean, expectRadialCounter: boolean) => {
    // arrange
    component.mode = StatementModeEnum.Edit;
    component.controlData = { Title: { Default: 'Title' } } as any;
    component.closeQuillMention = jest.fn();
    component.isContentHeightGreaterThanContainerHeight = jest.fn();
    component.createQuillEditor = jest.fn();
    component.quillEditor = {
      hasFocus: function() { return editorFocused; },
      container: {
        querySelectorAll: function() { return []; },
        querySelector: function() { return {offsetHeight: 0}; }
      },
      getText: jest.fn()
    };
    component.totalRewardsRadialTextCountersFeatureFlag.value = featureEnabled;

    // act
    fixture.detectChanges();

    // assert
    const found = fixture.debugElement.nativeElement.querySelector('.radial-text-counter') !== null;
    expect(found).toBe(expectRadialCounter);
  });
});
