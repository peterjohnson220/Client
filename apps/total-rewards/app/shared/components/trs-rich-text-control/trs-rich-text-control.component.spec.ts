import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { generateMockEmployeeRewardsData } from 'libs/models/payfactors-api/total-rewards';

import { TrsRichTextControlComponent } from './trs-rich-text-control.component';
import { StatementModeEnum } from '../../models';

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

  it('bindEmployeeData should not change ops when no data fields exist', () => {
    // arrange
    const staticOps = [{ insert: 'static text' }, { insert: '!@#$%^&*()' }, { insert: '!@#$%^&*()' } ];
    component.quillApi = { editor: { delta: { ops: staticOps } }, setContents: jest.fn()};
    component.quillApi.container = { firstChild: { setAttribute: () => ({}) } };
    spyOn(component.quillApi, 'setContents');

    // act
    component.bindEmployeeData();

    // assert
    expect(component.quillApi.setContents).toHaveBeenCalledTimes(1);
    expect(component.quillApi.setContents).toHaveBeenCalledWith(staticOps);
  });

  it('bindEmployeeData should replace data field placeholders with employee values in Preview mode', () => {
    // arrange, mock quill canvas content to be:
    //
    // test
    // [Employee First Name] [Employee Last Name]
    // end

    const employeeRewardsData = generateMockEmployeeRewardsData();
    component.employeeRewardsData = employeeRewardsData;
    component.mode = StatementModeEnum.Preview;

    const dynamicOps = [
      { insert: 'test↵' },
      { insert: { mention: { index: '0', denotationChar: '', id: 'EmployeeFirstName', value: 'Employee First Name'} } },
      { insert: ' ' },
      { insert: { mention: { index: '0', denotationChar: '', id: 'EmployeeLastName', value: 'Employee Last Name'} } },
      { insert: ' ↵end↵↵' }
    ];
    let actualOpsParam: any;
    component.quillApi = { editor: { delta: { ops: dynamicOps } }, setContents: (ops: any) => { actualOpsParam = ops; } };
    component.quillApi.container = { firstChild: { setAttribute: () => ({}) } };

    // act
    component.bindEmployeeData();

    // assert
    const expectedOps = dynamicOps as any;
    expectedOps[1].insert.mention.value = employeeRewardsData.EmployeeFirstName;
    expectedOps[3].insert.mention.value = employeeRewardsData.EmployeeLastName;
    expect(actualOpsParam).toEqual(expectedOps);
  });

  it('bindEmployeeData should replace employee data with placeholders in Edit mode', () => {
    // arrange, mock quill canvas content to be:
    //
    // test
    // [Employee First Name] [Employee Last Name]
    // end

    const employeeRewardsData = generateMockEmployeeRewardsData();
    component.employeeRewardsData = employeeRewardsData;
    component.mode = StatementModeEnum.Edit;
    component.controlData = {
      DataFields: [
        { Key: 'EmployeeFirstName', Value: 'Employee First Name' },
        { Key: 'EmployeeLastName', Value: 'Employee Last Name' }
      ]
    } as any;

    const dynamicOps = [
      { insert: 'test↵' },
      { insert: { mention: { index: '0', denotationChar: '', id: 'EmployeeFirstName', value: employeeRewardsData.EmployeeFirstName } } },
      { insert: ' ' },
      { insert: { mention: { index: '0', denotationChar: '', id: 'EmployeeLastName', value: employeeRewardsData.EmployeeLastName } } },
      { insert: ' ↵end↵↵' }
    ];
    let actualOpsParam: any;
    component.quillApi = { editor: { delta: { ops: dynamicOps } }, setContents: (ops: any) => { actualOpsParam = ops; } };
    component.quillApi.container = { firstChild: { setAttribute: () => ({}) } };

    // act
    component.bindEmployeeData();

    // assert
    const expectedOps = dynamicOps as any;
    expectedOps[1].insert.mention.value = 'Employee Firsst Name';
    expectedOps[3].insert.mention.value = 'Employee Last Name';
    expect(actualOpsParam).toEqual(expectedOps);
  });

  it('bindEmployeeData should persist styling attributes', () => {
    // arrange, mock quill canvas content to be:
    //
    // -bullet1
    // -bullet2
    // <b>[Current Year]</b>

    const employeeRewardsData = generateMockEmployeeRewardsData();
    component.employeeRewardsData = employeeRewardsData;
    component.mode = StatementModeEnum.Edit;
    component.controlData = { DataFields: [{ Key: 'CompanyName', Value: 'Company Name' }] } as any;

    const dynamicOps = [
      { insert: 'bullet1'},
      { insert: '\n', attributes: { list: 'bullet' } },
      { insert: 'bullet2'},
      { insert: '\n', attributes: { list: 'bullet' } },
      { insert: { mention: { index: '0', denotationChar: '', id: 'CompanyName', value: 'Company Name' } }, attributes: { bold: true } },
      { insert: '\n'}
    ];
    let actualOpsParam: any;
    component.quillApi = { editor: { delta: { ops: dynamicOps } }, setContents: (ops: any) => { actualOpsParam = ops; } };
    component.quillApi.container = { firstChild: { setAttribute: () => ({}) } };

    // act
    component.bindEmployeeData();

    // assert
    expect(actualOpsParam[0].attributes).toBeUndefined();
    expect(actualOpsParam[1].attributes).toEqual({ list: 'bullet' });
    expect(actualOpsParam[2].attributes).toBeUndefined();
    expect(actualOpsParam[3].attributes).toEqual({ list: 'bullet' });
    expect(actualOpsParam[4].attributes).toEqual({ bold: true });
    expect(actualOpsParam[5].attributes).toBeUndefined();
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
});
