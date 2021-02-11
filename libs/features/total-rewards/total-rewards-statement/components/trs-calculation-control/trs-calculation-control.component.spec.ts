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
    const employerContribution = component.getEmployerContributionValue(
      { Id: 'abc-123', DatabaseField: 'EmployeeBase', IsVisible: true, CanHaveEmployeeContribution: false, Name: {} as any}
   );

    // assert
    expect(employerContribution).toBe('50000');
  });

  it('getEmployerContributionValue should return "" value for a 0 valued standard field', () => {
    // arrange
    component.controlData = generateMockCalculationControl();
    component.mode = StatementModeEnum.Preview;
    component.employeeRewardsData = { ...generateMockEmployeeRewardsData(), EmployeeBonus: 0 };

    // act
    const employerContribution = component.getEmployerContributionValue(
      { Id: 'abc-123', DatabaseField: 'EmployeeBonus', IsVisible: true, CanHaveEmployeeContribution: false, Name: {} as any });

    // assert
    expect(employerContribution).toBe('');
  });

  it('getEmployerContributionValue should return TrsConstants.UDF_DEFAULT_VALUE for UDF fields in mock data', () => {
    // arrange
    component.controlData = generateMockCalculationControl();
    component.mode = StatementModeEnum.Preview;
    component.employeeRewardsData = { ...generateMockEmployeeRewardsData(), IsMockData: true };
    const udfField = {
      Id: 'abc-123', DatabaseField: 'UDF_CHAR_4_Name', IsVisible: true, CanHaveEmployeeContribution: false, Name: {} as any, Type: 'EmployeesUdf' };

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
    const udfField = {
      Id: 'abc-123', DatabaseField: 'UDF_CHAR_4_Name', IsVisible: true, CanHaveEmployeeContribution: false, Name: {} as any, Type: 'EmployeesUdf' };

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
    component.getEmployerContributionValue(
      { Id: 'abc-123', DatabaseField: 'EmployeeLTI', IsVisible: true, CanHaveEmployeeContribution: false, Name: {} as any });

    // assert
    expect(currencyPipe.transform).toHaveBeenCalledTimes(1);
    expect(currencyPipe.transform).toHaveBeenCalledWith(77777, 'INR', 'symbol-narrow', '1.0-0');
  });

  it('getEmployerContributionValue should call currencyPipe with the expected parameters for UDF fields', () => {
    // arrange
    component.controlData = generateMockCalculationControl();
    component.mode = StatementModeEnum.Preview;
    component.employeeRewardsData = { ...generateMockEmployeeRewardsData(), Bonus: 10000, IsMockData: false, Currency: 'CAD'} as any;
    component.employeeRewardsData.EmployeesUdf = { 'UDF_CHAR_2_Name': 12345 } as any;

    // act
    component.getEmployerContributionValue(
      { Id: 'abc-123', DatabaseField: 'UDF_CHAR_2_Name', IsVisible: true, CanHaveEmployeeContribution: false, Name: {} as any, Type: 'EmployeesUdf' });

    // assert
    expect(currencyPipe.transform).toHaveBeenCalledTimes(1);
    expect(currencyPipe.transform).toHaveBeenCalledWith(12345, 'CAD', 'symbol-narrow', '1.0-0');
  });

  it('getEmployerContributionValue should truncate two decimals after the period when showDecimals is falsy', () => {
    // arrange
    component.controlData = generateMockCalculationControl();
    component.mode = StatementModeEnum.Preview;
    component.showDecimals = false;
    component.employeeRewardsData = { ...generateMockEmployeeRewardsData(), Bonus: 10000.50, IsMockData: false, Currency: 'USD' } as any;

    // act
    const employerContribution = component.getEmployerContributionValue(
      { Id: 'abc-123', DatabaseField: 'Bonus', IsVisible: true, CanHaveEmployeeContribution: false, Name: {} as any });

    // assert
    expect(currencyPipe.transform).toHaveBeenCalledTimes(1);
    expect(currencyPipe.transform).toHaveBeenCalledWith(10000.50, 'USD', 'symbol-narrow', '1.0-0');
    expect(employerContribution).toBe('10000');
  });

  it('getEmployerContributionValue should truncate one decimal after the period when showDecimals is falsy', () => {
    // arrange
    component.controlData = generateMockCalculationControl();
    component.mode = StatementModeEnum.Preview;
    component.showDecimals = false;
    component.employeeRewardsData = { ...generateMockEmployeeRewardsData(), Bonus: 10000.5, IsMockData: false, Currency: 'USD' } as any;

    // act
    const employerContribution = component.getEmployerContributionValue(
      { Id: 'abc-123', DatabaseField: 'Bonus', IsVisible: true, CanHaveEmployeeContribution: false, Name: {} as any });

    // assert
    expect(currencyPipe.transform).toHaveBeenCalledTimes(1);
    expect(currencyPipe.transform).toHaveBeenCalledWith(10000.5, 'USD', 'symbol-narrow', '1.0-0');
    expect(employerContribution).toBe('10000');
  });

  it('getEmployerContributionValue values with one decimal should show two decimals after the period when showDecimals is truthy', () => {
    // arrange
    component.controlData = generateMockCalculationControl();
    component.mode = StatementModeEnum.Preview;
    component.showDecimals = true;
    component.employeeRewardsData = { ...generateMockEmployeeRewardsData(), Bonus: 10000.5, IsMockData: false, Currency: 'USD' } as any;

    // act
    const employerContribution = component.getEmployerContributionValue(
      { Id: 'abc-123', DatabaseField: 'Bonus', IsVisible: true, CanHaveEmployeeContribution: false, Name: {} as any });

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
    const employerContribution = component.getEmployerContributionValue(
      { Id: 'abc-123', DatabaseField: 'Bonus', IsVisible: true, CanHaveEmployeeContribution: true, Name: {} as any });

    // assert
    expect(currencyPipe.transform).toHaveBeenCalledTimes(1);
    expect(currencyPipe.transform).toHaveBeenCalledWith(10000.5, 'USD', 'symbol-narrow', '1.2-2');
    expect(employerContribution).toBe('10000.50');
  });

  // BenefitsData Tests
  it('should not display field if BenefitsData is null', () => {
    // arrange
    component.controlData = generateMockCalculationControl();
    component.mode = StatementModeEnum.Preview;
    component.showDecimals = true;
    component.showEmployeeContributions = false;
    component.employeeRewardsData = { ...generateMockEmployeeRewardsData(), IsMockData: false, Currency: 'USD' } as any;
    component.employeeRewardsData.BenefitsData = null;
    const field = { Id: 'abc-123', DatabaseField: 'Savings_401K_Match', IsVisible: true, CanHaveEmployeeContribution: true, Name: {} as any };

    // act
    fixture.detectChanges();
    const fieldIsBenefitsFieldVisible = component.isBenefitsFieldVisible(field);
    const fieldEmployeeContribution = component.getEmployeeContributionValue(field);
    const fieldEmployerContribution = component.getEmployerContributionValue(field);

    // assert
    expect(fieldIsBenefitsFieldVisible).toBe(false);
    expect(fieldEmployeeContribution).toBe('');
    expect(fieldEmployerContribution).toBe('');

    expect(fixture).toMatchSnapshot();
  });

  it('should not display field if BenefitsData is undefined', () => {
    // arrange
    component.controlData = generateMockCalculationControl();
    component.mode = StatementModeEnum.Preview;
    component.showDecimals = true;
    component.showEmployeeContributions = false;
    component.employeeRewardsData = { ...generateMockEmployeeRewardsData(), IsMockData: false, Currency: 'USD' } as any;
    component.employeeRewardsData.BenefitsData = undefined;
    const field = { Id: 'abc-123', DatabaseField: 'Savings_401K_Match', IsVisible: true, CanHaveEmployeeContribution: true, Name: {} as any };

    // act
    fixture.detectChanges();
    const fieldIsBenefitsFieldVisible = component.isBenefitsFieldVisible(field);
    const fieldEmployeeContribution = component.getEmployeeContributionValue(field);
    const fieldEmployerContribution = component.getEmployerContributionValue(field);

    // assert
    expect(fieldIsBenefitsFieldVisible).toBe(false);
    expect(fieldEmployeeContribution).toBe('');
    expect(fieldEmployerContribution).toBe('');

    expect(fixture).toMatchSnapshot();
  });

  it('should not display field if invalid benefit field', () => {
    // arrange
    component.controlData = generateMockCalculationControl();
    component.mode = StatementModeEnum.Preview;
    component.showDecimals = true;
    component.showEmployeeContributions = false;
    component.employeeRewardsData = { ...generateMockEmployeeRewardsData(), IsMockData: false, Currency: 'USD' } as any;
    const field = { Id: 'abc-123', DatabaseField: 'INVALID_FIELD', IsVisible: true, CanHaveEmployeeContribution: true, Name: {} as any };

    // act
    // fixture.detectChanges();
    const fieldIsBenefitsFieldVisible = component.isBenefitsFieldVisible(field);
    const fieldEmployeeContribution = component.getEmployeeContributionValue(field);
    const fieldEmployerContribution = component.getEmployerContributionValue(field);

    // assert
    expect(fieldIsBenefitsFieldVisible).toBe(false);
    expect(fieldEmployeeContribution).toBe('');
    expect(fieldEmployerContribution).toBe('');

    // expect(fixture).toMatchSnapshot();
  });

  it('should not display field if benefit field is null or undefined', () => {
    // arrange
    component.controlData = generateMockCalculationControl();
    component.mode = StatementModeEnum.Preview;
    component.showDecimals = true;
    component.showEmployeeContributions = false;
    component.employeeRewardsData = { ...generateMockEmployeeRewardsData(), IsMockData: false, Currency: 'USD' } as any;
    component.employeeRewardsData.BenefitsData['Savings_401K_Match'] = null;
    component.employeeRewardsData.BenefitsData['Pension_Plan'] = undefined;

    const field1 = { Id: 'abc-123', DatabaseField: 'Savings_401K_Match', IsVisible: true, CanHaveEmployeeContribution: true, Name: {} as any };
    const field2 = { Id: 'abc-123', DatabaseField: 'Pension_Plan', IsVisible: true, CanHaveEmployeeContribution: true, Name: {} as any };

    // act
    // fixture.detectChanges();
    const field1IsBenefitsFieldVisible = component.isBenefitsFieldVisible(field1);
    const field1EmployeeContribution = component.getEmployeeContributionValue(field1);
    const field1EmployerContribution = component.getEmployerContributionValue(field1);

    const field2IsBenefitsFieldVisible = component.isBenefitsFieldVisible(field2);
    const field2EmployeeContribution = component.getEmployeeContributionValue(field2);
    const field2EmployerContribution = component.getEmployerContributionValue(field2);

    // assert
    expect(field1IsBenefitsFieldVisible).toBe(false);
    expect(field1EmployeeContribution).toBe('');
    expect(field1EmployerContribution).toBe('');

    expect(field2IsBenefitsFieldVisible).toBe(false);
    expect(field2EmployeeContribution).toBe('');
    expect(field2EmployerContribution).toBe('');

    // expect(fixture).toMatchSnapshot();
  });

  // BenefitsData tests with showEmployeeContributions disabled
  // has data: employer yes, employee yes
  it('should display field if employer has a value and employee has a value with showEmployeeContributions disabled', () => {
    // arrange
    component.controlData = generateMockCalculationControl();
    component.mode = StatementModeEnum.Preview;
    component.showDecimals = true;
    component.showEmployeeContributions = false;
    component.employeeRewardsData = { ...generateMockEmployeeRewardsData(), IsMockData: false, Currency: 'USD' } as any;
    component.employeeRewardsData.BenefitsData['Savings_401K_Match'].EmployerValue = 1000;
    component.employeeRewardsData.BenefitsData['Savings_401K_Match'].CompanyEmployeeValue = 500;
    const field = { Id: 'abc-123', DatabaseField: 'Savings_401K_Match', IsVisible: true, CanHaveEmployeeContribution: true, Name: {} as any };

    // act
    fixture.detectChanges();
    const fieldIsBenefitsFieldVisible = component.isBenefitsFieldVisible(field);
    const fieldEmployeeContribution = component.getEmployeeContributionValue(field);
    const fieldEmployerContribution = component.getEmployerContributionValue(field);

    // assert
    expect(fieldIsBenefitsFieldVisible).toBe(true);
    expect(fieldEmployeeContribution).toBe('500');
    expect(fieldEmployerContribution).toBe('1000');

    expect(fixture).toMatchSnapshot();
  });

  // has data: employer yes, employee no
  it('should display field if employer has a value and employee does not have a value with showEmployeeContributions disabled', () => {
    // arrange
    component.controlData = generateMockCalculationControl();
    component.mode = StatementModeEnum.Preview;
    component.showDecimals = true;
    component.showEmployeeContributions = false;
    component.employeeRewardsData = { ...generateMockEmployeeRewardsData(), IsMockData: false, Currency: 'USD' } as any;
    component.employeeRewardsData.BenefitsData['Savings_401K_Match'].EmployerValue = 1000;
    component.employeeRewardsData.BenefitsData['Savings_401K_Match'].CompanyEmployeeValue = 0;
    component.employeeRewardsData.BenefitsData['Pension_Plan'].EmployerValue = 1000;
    component.employeeRewardsData.BenefitsData['Pension_Plan'].CompanyEmployeeValue = null;
    const field1 =
      { Id: 'abc-123', DatabaseField: 'Savings_401K_Match', IsVisible: true, CanHaveEmployeeContribution: true, Name: {} as any } as CompensationField;
    const field2 = { Id: 'abc-456', DatabaseField: 'Pension_Plan', IsVisible: true, CanHaveEmployeeContribution: true, Name: {} as any } as CompensationField;

    // act
    fixture.detectChanges();
    const field1IsBenefitsFieldVisible = component.isBenefitsFieldVisible(field1);
    const field1EmployerContribution = component.getEmployerContributionValue(field1);
    const field1EmployeeContribution = component.getEmployeeContributionValue(field1);

    const field2IsBenefitsFieldVisible = component.isBenefitsFieldVisible(field2);
    const field2EmployerContribution = component.getEmployerContributionValue(field2);
    const field2EmployeeContribution = component.getEmployeeContributionValue(field2);

    // assert
    expect(field1IsBenefitsFieldVisible).toBe(true);
    expect(field1EmployerContribution).toBe('1000');
    expect(field1EmployeeContribution).toBe('');

    expect(field2IsBenefitsFieldVisible).toBe(true);
    expect(field2EmployerContribution).toBe('1000');
    expect(field2EmployeeContribution).toBe('');

    expect(fixture).toMatchSnapshot();
  });

  // has data: employer no, employee yes
  it('should not display field if employer does not have a value and employee has a value with showEmployeeContributions disabled', () => {
    // arrange
    component.controlData = generateMockCalculationControl();
    component.mode = StatementModeEnum.Preview;
    component.showDecimals = true;
    component.showEmployeeContributions = false;
    component.employeeRewardsData = { ...generateMockEmployeeRewardsData(), IsMockData: false, Currency: 'USD' } as any;
    component.employeeRewardsData.BenefitsData['Savings_401K_Match'].EmployerValue = 0;
    component.employeeRewardsData.BenefitsData['Savings_401K_Match'].CompanyEmployeeValue = 1000;
    component.employeeRewardsData.BenefitsData['Pension_Plan'].EmployerValue = null;
    component.employeeRewardsData.BenefitsData['Pension_Plan'].CompanyEmployeeValue = 1000;
    const field1 =
      { Id: 'abc-123', DatabaseField: 'Savings_401K_Match', IsVisible: true, CanHaveEmployeeContribution: true, Name: {} as any } as CompensationField;
    const field2 = { Id: 'abc-456', DatabaseField: 'Pension_Plan', IsVisible: true, CanHaveEmployeeContribution: true, Name: {} as any } as CompensationField;

    // act
    fixture.detectChanges();
    const field1IsBenefitsFieldVisible = component.isBenefitsFieldVisible(field1);
    const field1EmployerContribution = component.getEmployerContributionValue(field1);
    const field1EmployeeContribution = component.getEmployeeContributionValue(field1);

    const field2IsBenefitsFieldVisible = component.isBenefitsFieldVisible(field2);
    const field2EmployerContribution = component.getEmployerContributionValue(field2);
    const field2EmployeeContribution = component.getEmployeeContributionValue(field2);

    // assert
    expect(field1IsBenefitsFieldVisible).toBe(false);
    expect(field1EmployerContribution).toBe('');
    expect(field1EmployeeContribution).toBe('1000');

    expect(field2IsBenefitsFieldVisible).toBe(false);
    expect(field2EmployerContribution).toBe('');
    expect(field2EmployeeContribution).toBe('1000');

    expect(fixture).toMatchSnapshot();
  });

  // has data: employer no, employee no
  it('should not display field if employer and employee do not have values with showEmployeeContributions disabled', () => {
    // arrange
    component.controlData = generateMockCalculationControl();
    component.mode = StatementModeEnum.Preview;
    component.showDecimals = true;
    component.showEmployeeContributions = false;
    component.employeeRewardsData = { ...generateMockEmployeeRewardsData(), IsMockData: false, Currency: 'USD' } as any;
    component.employeeRewardsData.BenefitsData['Savings_401K_Match'].EmployerValue = 0;
    component.employeeRewardsData.BenefitsData['Savings_401K_Match'].CompanyEmployeeValue = null;
    component.employeeRewardsData.BenefitsData['Pension_Plan'].EmployerValue = 0;
    component.employeeRewardsData.BenefitsData['Pension_Plan'].CompanyEmployeeValue = null;
    const field1 =
      { Id: 'abc-123', DatabaseField: 'Savings_401K_Match', IsVisible: true, CanHaveEmployeeContribution: true, Name: {} as any } as CompensationField;
    const field2 = { Id: 'abc-456', DatabaseField: 'Pension_Plan', IsVisible: true, CanHaveEmployeeContribution: true, Name: {} as any } as CompensationField;

    // act
    fixture.detectChanges();
    const field1IsBenefitsFieldVisible = component.isBenefitsFieldVisible(field1);
    const field1EmployerContribution = component.getEmployerContributionValue(field1);
    const field1EmployeeContribution = component.getEmployeeContributionValue(field1);

    const field2IsBenefitsFieldVisible = component.isBenefitsFieldVisible(field2);
    const field2EmployerContribution = component.getEmployerContributionValue(field2);
    const field2EmployeeContribution = component.getEmployeeContributionValue(field2);

    // assert
    expect(field1IsBenefitsFieldVisible).toBe(false);
    expect(field1EmployerContribution).toBe('');
    expect(field1EmployeeContribution).toBe('');

    expect(field2IsBenefitsFieldVisible).toBe(false);
    expect(field2EmployerContribution).toBe('');
    expect(field2EmployeeContribution).toBe('');

    expect(fixture).toMatchSnapshot();
  });

  // BenefitsData tests with showEmployeeContributions enabled
  // has data: employer yes, employee yes
  it('should display field if employer has a value and employee has a value with showEmployeeContributions enabled', () => {
    // arrange
    component.controlData = generateMockCalculationControl();
    component.mode = StatementModeEnum.Preview;
    component.showDecimals = true;
    component.showEmployeeContributions = true;
    component.employeeRewardsData = { ...generateMockEmployeeRewardsData(), IsMockData: false, Currency: 'USD' } as any;
    component.employeeRewardsData.BenefitsData['Savings_401K_Match'].EmployerValue = 1000;
    component.employeeRewardsData.BenefitsData['Savings_401K_Match'].CompanyEmployeeValue = 500;
    const field =
      { Id: 'abc-123', DatabaseField: 'Savings_401K_Match', IsVisible: true, CanHaveEmployeeContribution: true, Name: {} as any } as CompensationField;

    // act
    fixture.detectChanges();
    const fieldIsBenefitsFieldVisible = component.isBenefitsFieldVisible(field);
    const fieldEmployeeContribution = component.getEmployeeContributionValue(field);
    const fieldEmployerContribution = component.getEmployerContributionValue(field);

    // assert
    expect(fieldIsBenefitsFieldVisible).toBe(true);
    expect(fieldEmployeeContribution).toBe('500');
    expect(fieldEmployerContribution).toBe('1000');

    expect(fixture).toMatchSnapshot();
  });

  // has data: employer yes, employee no
  it('should display field if employer has a value and employee does not have a value with showEmployeeContributions enabled', () => {
    // arrange
    component.controlData = generateMockCalculationControl();
    component.mode = StatementModeEnum.Preview;
    component.showDecimals = true;
    component.showEmployeeContributions = true;
    component.employeeRewardsData = { ...generateMockEmployeeRewardsData(), IsMockData: false, Currency: 'USD' } as any;
    component.employeeRewardsData.BenefitsData['Savings_401K_Match'].EmployerValue = 500;
    component.employeeRewardsData.BenefitsData['Savings_401K_Match'].CompanyEmployeeValue = 0;
    component.employeeRewardsData.BenefitsData['Pension_Plan'].EmployerValue = 500;
    component.employeeRewardsData.BenefitsData['Pension_Plan'].CompanyEmployeeValue = null;
    const field1 =
      { Id: 'abc-123', DatabaseField: 'Savings_401K_Match', IsVisible: true, CanHaveEmployeeContribution: true, Name: {} as any } as CompensationField;
    const field2 = { Id: 'abc-456', DatabaseField: 'Pension_Plan', IsVisible: true, CanHaveEmployeeContribution: true, Name: {} as any } as CompensationField;

    // act
    fixture.detectChanges();
    const field1IsBenefitsFieldVisible = component.isBenefitsFieldVisible(field1);
    const field1EmployeeContribution = component.getEmployeeContributionValue(field1);
    const field1EmployerContribution = component.getEmployerContributionValue(field1);

    const field2IsBenefitsFieldVisible = component.isBenefitsFieldVisible(field2);
    const field2EmployeeContribution = component.getEmployeeContributionValue(field2);
    const field2EmployerContribution = component.getEmployerContributionValue(field2);

    // assert
    expect(field1IsBenefitsFieldVisible).toBe(true);
    expect(field1EmployeeContribution).toBe('');
    expect(field1EmployerContribution).toBe('500');

    expect(field2IsBenefitsFieldVisible).toBe(true);
    expect(field2EmployeeContribution).toBe('');
    expect(field2EmployerContribution).toBe('500');
    expect(fixture).toMatchSnapshot();
  });

  // has data: employer no, employee yes
  it('should display field if employer does not have a value and employee has a value with showEmployeeContributions enabled', () => {
    // arrange
    component.controlData = generateMockCalculationControl();
    component.mode = StatementModeEnum.Preview;
    component.showDecimals = true;
    component.showEmployeeContributions = true;
    component.employeeRewardsData = { ...generateMockEmployeeRewardsData(), IsMockData: false, Currency: 'USD' } as any;
    component.employeeRewardsData.BenefitsData['Savings_401K_Match'].EmployerValue = 0;
    component.employeeRewardsData.BenefitsData['Savings_401K_Match'].CompanyEmployeeValue = 500;
    component.employeeRewardsData.BenefitsData['Pension_Plan'].EmployerValue = null;
    component.employeeRewardsData.BenefitsData['Pension_Plan'].CompanyEmployeeValue = 500;
    const field1 =
      { Id: 'abc-123', DatabaseField: 'Savings_401K_Match', IsVisible: true, CanHaveEmployeeContribution: true, Name: {} as any } as CompensationField;
    const field2 = { Id: 'abc-456', DatabaseField: 'Pension_Plan', IsVisible: true, CanHaveEmployeeContribution: true, Name: {} as any } as CompensationField;

    // act
    fixture.detectChanges();
    const field1IsBenefitsFieldVisible = component.isBenefitsFieldVisible(field1);
    const field1EmployeeContribution = component.getEmployeeContributionValue(field1);
    const field1EmployerContribution = component.getEmployerContributionValue(field1);

    const field2IsBenefitsFieldVisible = component.isBenefitsFieldVisible(field2);
    const field2EmployeeContribution = component.getEmployeeContributionValue(field2);
    const field2EmployerContribution = component.getEmployerContributionValue(field2);

    // assert
    expect(field1IsBenefitsFieldVisible).toBe(true);
    expect(field1EmployeeContribution).toBe('500');
    expect(field1EmployerContribution).toBe('');

    expect(field2IsBenefitsFieldVisible).toBe(true);
    expect(field2EmployeeContribution).toBe('500');
    expect(field2EmployerContribution).toBe('');
    expect(fixture).toMatchSnapshot();
  });

  // has data: employer no, employee no
  it('should not display field if employer and employee do not have values with showEmployeeContributions enabled', () => {
    // arrange
    component.controlData = generateMockCalculationControl();
    component.mode = StatementModeEnum.Preview;
    component.showDecimals = true;
    component.showEmployeeContributions = true;
    component.employeeRewardsData = { ...generateMockEmployeeRewardsData(), IsMockData: false, Currency: 'USD' } as any;
    component.employeeRewardsData.BenefitsData['Savings_401K_Match'].EmployerValue = 0;
    component.employeeRewardsData.BenefitsData['Savings_401K_Match'].CompanyEmployeeValue = null;
    component.employeeRewardsData.BenefitsData['Pension_Plan'].EmployerValue = 0;
    component.employeeRewardsData.BenefitsData['Pension_Plan'].CompanyEmployeeValue = null;
    const field1 =
      { Id: 'abc-123', DatabaseField: 'Savings_401K_Match', IsVisible: true, CanHaveEmployeeContribution: true, Name: {} as any } as CompensationField;
    const field2 = { Id: 'abc-456', DatabaseField: 'Pension_Plan', IsVisible: true, CanHaveEmployeeContribution: true, Name: {} as any } as CompensationField;

    // act
    fixture.detectChanges();
    const field1IsBenefitsFieldVisible = component.isBenefitsFieldVisible(field1);
    const field1EmployerContribution = component.getEmployerContributionValue(field1);
    const field1EmployeeContribution = component.getEmployeeContributionValue(field1);

    const field2IsBenefitsFieldVisible = component.isBenefitsFieldVisible(field2);
    const field2EmployerContribution = component.getEmployerContributionValue(field2);
    const field2EmployeeContribution = component.getEmployeeContributionValue(field2);

    // assert
    expect(field1IsBenefitsFieldVisible).toBe(false);
    expect(field1EmployerContribution).toBe('');
    expect(field1EmployeeContribution).toBe('');

    expect(field2IsBenefitsFieldVisible).toBe(false);
    expect(field2EmployerContribution).toBe('');
    expect(field2EmployeeContribution).toBe('');

    expect(fixture).toMatchSnapshot();
  });

  // BenefitsData tests with CanHaveEmployeeContribution is false
  it('should display field if employer has a value and employee has a value with CanHaveEmployeeContribution is false', () => {
    // arrange
    component.controlData = generateMockCalculationControl();
    component.mode = StatementModeEnum.Preview;
    component.showDecimals = true;
    component.showEmployeeContributions = true;
    component.employeeRewardsData = { ...generateMockEmployeeRewardsData(), IsMockData: false, Currency: 'USD' } as any;
    component.employeeRewardsData.BenefitsData['Tuition_Reimbursement'].EmployerValue = 1000;
    component.employeeRewardsData.BenefitsData['Tuition_Reimbursement'].CompanyEmployeeValue = 1000;
    component.employeeRewardsData.BenefitsData['PTO'].EmployerValue = 1000;
    component.employeeRewardsData.BenefitsData['PTO'].CompanyEmployeeValue = 1000;
    const field1 =
      { Id: 'abc-123', DatabaseField: 'Tuition_Reimbursement', IsVisible: true, CanHaveEmployeeContribution: false, Name: {} as any } as CompensationField;
    const field2 = { Id: 'abc-456', DatabaseField: 'PTO', IsVisible: true, CanHaveEmployeeContribution: false, Name: {} as any } as CompensationField;

    // act
    fixture.detectChanges();
    const field1IsBenefitsFieldVisible = component.isBenefitsFieldVisible(field1);
    const field1EmployerContribution = component.getEmployerContributionValue(field1);
    const field1EmployeeContribution = component.getEmployeeContributionValue(field1);

    const field2IsBenefitsFieldVisible = component.isBenefitsFieldVisible(field2);
    const field2EmployerContribution = component.getEmployerContributionValue(field2);
    const field2EmployeeContribution = component.getEmployeeContributionValue(field2);

    // assert
    // Should only display employer value
    expect(field1IsBenefitsFieldVisible).toBe(true);
    expect(field1EmployerContribution).toBe('1000');
    expect(field1EmployeeContribution).toBe('');

    expect(field2IsBenefitsFieldVisible).toBe(true);
    expect(field2EmployerContribution).toBe('1000');
    expect(field2EmployeeContribution).toBe('');

    expect(fixture).toMatchSnapshot();
  });

  it('should not display field if employer does not have a value and employee has a value with CanHaveEmployeeContribution set false', () => {
    // arrange
    component.controlData = generateMockCalculationControl();
    component.mode = StatementModeEnum.Preview;
    component.showDecimals = true;
    component.showEmployeeContributions = true;
    component.employeeRewardsData = { ...generateMockEmployeeRewardsData(), IsMockData: false, Currency: 'USD' } as any;
    component.employeeRewardsData.BenefitsData['Tuition_Reimbursement'].EmployerValue = 0;
    component.employeeRewardsData.BenefitsData['Tuition_Reimbursement'].CompanyEmployeeValue = 1000;
    component.employeeRewardsData.BenefitsData['PTO'].EmployerValue = null;
    component.employeeRewardsData.BenefitsData['PTO'].CompanyEmployeeValue = 1000;
    const field1 =
      { Id: 'abc-123', DatabaseField: 'Tuition_Reimbursement', IsVisible: true, CanHaveEmployeeContribution: false, Name: {} as any } as CompensationField;
    const field2 = { Id: 'abc-456', DatabaseField: 'PTO', IsVisible: true, CanHaveEmployeeContribution: false, Name: {} as any } as CompensationField;

    // act
    fixture.detectChanges();
    const field1IsBenefitsFieldVisible = component.isBenefitsFieldVisible(field1);
    const field1EmployerContribution = component.getEmployerContributionValue(field1);
    const field1EmployeeContribution = component.getEmployeeContributionValue(field1);

    const field2IsBenefitsFieldVisible = component.isBenefitsFieldVisible(field2);
    const field2EmployerContribution = component.getEmployerContributionValue(field2);
    const field2EmployeeContribution = component.getEmployeeContributionValue(field2);

    // assert
    expect(field1IsBenefitsFieldVisible).toBe(false);
    expect(field1EmployerContribution).toBe('');
    expect(field1EmployeeContribution).toBe('');

    expect(field2IsBenefitsFieldVisible).toBe(false);
    expect(field2EmployerContribution).toBe('');
    expect(field2EmployeeContribution).toBe('');

    expect(fixture).toMatchSnapshot();
  });

});
