import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CurrencyPipe } from '@angular/common';

import { generateMockEmployeeRewardsData } from 'libs/models/payfactors-api/total-rewards';

import { TrsCalculationControlComponent } from './trs-calculation-control.component';
import { CompensationFieldPipe } from '../../pipes/compensation-field-pipe';
import { CalculationControl, CompensationField, generateMockCalculationControl, LabelWithOverride, StatementModeEnum } from '../../models';
import { StringEditorComponent } from '../string-editor';
import { TrsConstants } from '../../constants/trs-constants';

describe('TrsCalculationControlComponent', () => {
  let component: TrsCalculationControlComponent;
  let fixture: ComponentFixture<TrsCalculationControlComponent>;
  let currencyPipe: CurrencyPipe;
  let compensationField: CompensationFieldPipe;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TrsCalculationControlComponent, CompensationFieldPipe, StringEditorComponent],
      providers: [{
          provide: CurrencyPipe,
          useValue: { transform: jest.fn((x) => x?.toString()) }
        },
        {
          provide: CompensationFieldPipe,
          useValue: { transform: (x) => x }
        }],
      schemas: [NO_ERRORS_SCHEMA]
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrsCalculationControlComponent);
    component = fixture.componentInstance;
    currencyPipe = TestBed.inject(CurrencyPipe);
    compensationField = TestBed.inject(CompensationFieldPipe);
  });

  it('should create', () => {
    component.controlData = {
      Title: { } as LabelWithOverride,
      Summary: { } as LabelWithOverride,
      DataFields: []
    } as CalculationControl;

    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('should render the supplied data fields', () => {
    component.mode = StatementModeEnum.Edit;
    component.controlData = {
      Title: {} as LabelWithOverride,
      Summary: {} as LabelWithOverride,
      DataFields: [
        {
          DatabaseField: 'first',
          Name: { Default: 'First' },
          IsVisible: true
        } as CompensationField,
        {
          DatabaseField: 'second',
          Name: { Default: 'Second' },
          IsVisible: true
        } as CompensationField,
        {
          DatabaseField: 'third',
          Name: { Default: 'Third' },
          IsVisible: true
        } as CompensationField] as CompensationField[]
    } as CalculationControl;
    component.employeeRewardsData = generateMockEmployeeRewardsData();

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should render additional content in the table head when ShowTitle is true', () => {
    component.mode = StatementModeEnum.Preview;
    component.employeeRewardsData = { EmployeeBase: 65000 } as any;
    component.controlData = {
      Title: { Default: 'test title' } as LabelWithOverride,
      Summary: {} as LabelWithOverride,
      ShowTitle: true,
      DataFields: [
        {
          Id: '123',
          DatabaseField: 'EmployeeBase',
          Name: {} as LabelWithOverride,
          IsVisible: false
        }
      ] as CompensationField[]
    } as CalculationControl;

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should hide all content in the table head when ShowTitle is false', () => {
    component.mode = StatementModeEnum.Preview;
    component.employeeRewardsData = { EmployeeBase: 65000 } as any;
    component.controlData = {
      Title: { Default: 'test title' } as LabelWithOverride,
      Summary: {} as LabelWithOverride,
      ShowTitle: false,
      DataFields: [
        {
          Id: '123',
          DatabaseField: 'EmployeeBase',
          Name: {} as LabelWithOverride,
          IsVisible: false
        }
      ] as CompensationField[]
    } as CalculationControl;

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should render the supplied Summary', () => {
    component.mode = StatementModeEnum.Edit;
    component.controlData = {
      Title: { Default: '' } as LabelWithOverride,
      Summary: { Default: 'test summary'} as LabelWithOverride,
      DataFields: []
    } as any;

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should display contribution values and total when in preview mode', () => {
    component.employeeRewardsData = generateMockEmployeeRewardsData();
    component.controlData = generateMockCalculationControl();
    component.mode = StatementModeEnum.Preview;

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should exclude fields in preview mode if employee data is null for a given field', () => {
    component.employeeRewardsData = generateMockEmployeeRewardsData();
    component.controlData = generateMockCalculationControl();
    component.mode = StatementModeEnum.Preview;

    component.employeeRewardsData.EmployeeSTI = null;

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should exclude fields in preview mode if employee data is 0 for a given field', () => {
    component.employeeRewardsData = generateMockEmployeeRewardsData();
    component.controlData = generateMockCalculationControl();
    component.mode = StatementModeEnum.Preview;

    component.employeeRewardsData.EmployeeSTI = 0;

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('getEmployerContributionValue should return an empty string in Edit mode', () => {
    // arrange
    component.controlData = generateMockCalculationControl();
    component.mode = StatementModeEnum.Edit;

    // act
    const employerContribution = component.getEmployerContributionValue({} as any);

    // assert
    expect(employerContribution).toBe('');
  });

  it('getEmployerContributionValue should return an empty string if no rewards data exists', () => {
    // arrange
    component.controlData = generateMockCalculationControl();
    component.mode = StatementModeEnum.Preview;

    // act
    const employerContribution = component.getEmployerContributionValue({} as any);

    // assert
    expect(employerContribution).toBe('');
  });

  it('getEmployerContributionValue should return non a 0 rewards value for a non 0 standard field', () => {
    // arrange
    component.controlData = generateMockCalculationControl();
    component.mode = StatementModeEnum.Preview;
    component.employeeRewardsData = { ...generateMockEmployeeRewardsData(), EmployeeBase: 50000 };

    // act
    const employerContribution = component.getEmployerContributionValue({ Id: 'abc-123', DatabaseField: 'EmployeeBase', IsVisible: true, Name: {} as any });

    // assert
    expect(employerContribution).toBe('50000');
  });

  it('getEmployerContributionValue should return a 0 value for a 0 valued standard field', () => {
    // arrange
    component.controlData = generateMockCalculationControl();
    component.mode = StatementModeEnum.Preview;
    component.employeeRewardsData = { ...generateMockEmployeeRewardsData(), EmployeeBonus: 0 };

    // act
    const employerContribution = component.getEmployerContributionValue({ Id: 'abc-123', DatabaseField: 'EmployeeBonus', IsVisible: true, Name: {} as any });

    // assert
    expect(employerContribution).toBe('0');
  });

  it('getEmployerContributionValue should return TrsConstants.UDF_DEFAULT_VALUE for UDF fields in mock data', () => {
    // arrange
    component.controlData = generateMockCalculationControl();
    component.mode = StatementModeEnum.Preview;
    component.employeeRewardsData = { ...generateMockEmployeeRewardsData(), IsMockData: true };
    const udfField = { Id: 'abc-123', DatabaseField: 'UDF_CHAR_4_Name', IsVisible: true, Name: {} as any, Type: 'EmployeesUdf' };

    // act
    const employerContribution = component.getEmployerContributionValue(udfField);

    // assert
    expect(employerContribution).toBe(TrsConstants.UDF_DEFAULT_VALUE.toString());
  });

  it('getEmployerContributionValue should return the UDF value for UDF fields with matching employee values', () => {
    // arrange
    component.controlData = generateMockCalculationControl();
    component.mode = StatementModeEnum.Preview;
    component.employeeRewardsData = { ...generateMockEmployeeRewardsData(), IsMockData: false, EmployeesUdf: { 'UDF_CHAR_4_Name': 123123 } as any };
    const udfField = { Id: 'abc-123', DatabaseField: 'UDF_CHAR_4_Name', IsVisible: true, Name: {} as any, Type: 'EmployeesUdf' };

    // act
    const employerContribution = component.getEmployerContributionValue(udfField);

    // assert
    expect(employerContribution).toBe('123123');
  });

  it('getEmployerContributionValue should call currencyPipe with the expected parameters for standard fields', () => {
    // arrange
    component.controlData = generateMockCalculationControl();
    component.mode = StatementModeEnum.Preview;
    component.employeeRewardsData = { ...generateMockEmployeeRewardsData(), Currency: 'INR', EmployeeLTI: 77777 };

    // act
    component.getEmployerContributionValue({ Id: 'abc-123', DatabaseField: 'EmployeeLTI', IsVisible: true, Name: {} as any });

    // assert
    expect(currencyPipe.transform).toHaveBeenCalledTimes(1);
    expect(currencyPipe.transform).toHaveBeenCalledWith(77777, 'INR', 'symbol-narrow', '1.0');
  });

  it('getEmployerContributionValue should call currencyPipe with the expected parameters for UDF fields', () => {
    // arrange
    component.controlData = generateMockCalculationControl();
    component.mode = StatementModeEnum.Preview;
    component.employeeRewardsData = { ...generateMockEmployeeRewardsData(), Bonus: 10000, IsMockData: false, Currency: 'CAD'} as any;
    component.employeeRewardsData.EmployeesUdf = { 'UDF_CHAR_2_Name': 12345 } as any;

    // act
    component.getEmployerContributionValue({ Id: 'abc-123', DatabaseField: 'UDF_CHAR_2_Name', IsVisible: true, Name: {} as any, Type: 'EmployeesUdf' });

    // assert
    expect(currencyPipe.transform).toHaveBeenCalledTimes(1);
    expect(currencyPipe.transform).toHaveBeenCalledWith(12345, 'CAD', 'symbol-narrow', '1.0');
  });

  it('getEmployerContributionValue should truncate two decimals after the period when showDecimals is falsy', () => {
    // arrange
    component.controlData = generateMockCalculationControl();
    component.mode = StatementModeEnum.Preview;
    component.showDecimals = false;
    component.employeeRewardsData = { ...generateMockEmployeeRewardsData(), Bonus: 10000.50, IsMockData: false, Currency: 'USD' } as any;

    // act
    const employerContribution = component.getEmployerContributionValue({ Id: 'abc-123', DatabaseField: 'Bonus', IsVisible: true, Name: {} as any });

    // assert
    expect(currencyPipe.transform).toHaveBeenCalledTimes(1);
    expect(currencyPipe.transform).toHaveBeenCalledWith(10000.50, 'USD', 'symbol-narrow', '1.0');
    expect(employerContribution).toBe('10000');
  });

  it('getEmployerContributionValue should truncate one decimal after the period when showDecimals is falsy', () => {
    // arrange
    component.controlData = generateMockCalculationControl();
    component.mode = StatementModeEnum.Preview;
    component.showDecimals = false;
    component.employeeRewardsData = { ...generateMockEmployeeRewardsData(), Bonus: 10000.5, IsMockData: false, Currency: 'USD' } as any;

    // act
    const employerContribution = component.getEmployerContributionValue({ Id: 'abc-123', DatabaseField: 'Bonus', IsVisible: true, Name: {} as any });

    // assert
    expect(currencyPipe.transform).toHaveBeenCalledTimes(1);
    expect(currencyPipe.transform).toHaveBeenCalledWith(10000.5, 'USD', 'symbol-narrow', '1.0');
    expect(employerContribution).toBe('10000');
  });

  it('getEmployerContributionValue values with one decimal should show two decimals after the period when showDecimals is truthy', () => {
    // arrange
    component.controlData = generateMockCalculationControl();
    component.mode = StatementModeEnum.Preview;
    component.showDecimals = true;
    component.employeeRewardsData = { ...generateMockEmployeeRewardsData(), Bonus: 10000.5, IsMockData: false, Currency: 'USD' } as any;

    // act
    const employerContribution = component.getEmployerContributionValue({ Id: 'abc-123', DatabaseField: 'Bonus', IsVisible: true, Name: {} as any });

    // assert
    expect(currencyPipe.transform).toHaveBeenCalledTimes(1);
    expect(currencyPipe.transform).toHaveBeenCalledWith(10000.5, 'USD', 'symbol-narrow', '1.2-2');
    expect(employerContribution).toBe('10000.50');
  });

  it('getEmployerContributionValue values with multiple decimals should show two decimals after the period when showDecimals is truthy', () => {
    // arrange
    component.controlData = generateMockCalculationControl();
    component.mode = StatementModeEnum.Preview;
    component.showDecimals = true;
    component.employeeRewardsData = { ...generateMockEmployeeRewardsData(), Bonus: 10000.50, IsMockData: false, Currency: 'USD' } as any;

    // act
    const employerContribution = component.getEmployerContributionValue({ Id: 'abc-123', DatabaseField: 'Bonus', IsVisible: true, Name: {} as any });

    // assert
    expect(currencyPipe.transform).toHaveBeenCalledTimes(1);
    expect(currencyPipe.transform).toHaveBeenCalledWith(10000.5, 'USD', 'symbol-narrow', '1.2-2');
    expect(employerContribution).toBe('10000.50');
  });
});
