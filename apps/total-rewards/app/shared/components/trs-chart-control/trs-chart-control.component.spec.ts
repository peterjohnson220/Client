import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { TrsChartControlComponent } from './trs-chart-control.component';
import { StatementModeEnum, TotalRewardsControlEnum, CalculationControl } from '../../models';

describe('TrsChartControlComponent', () => {
  let component: TrsChartControlComponent;
  let fixture: ComponentFixture<TrsChartControlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TrsChartControlComponent],
      schemas: [NO_ERRORS_SCHEMA]
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrsChartControlComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    // arrange
    component.controlData = { Title: 'test title' } as any;
    component.calculationControls = [];

    // act
    fixture.detectChanges();

    // assert
    expect(component).toBeTruthy();
  });

  it('should show the title component and a settings link', () => {
    // arrange
    component.controlData = { Title: { Default: 'test title' } } as any;
    component.calculationControls = [];

    // act
    fixture.detectChanges();

    // assert
    expect(fixture).toMatchSnapshot();
  });

  it('should set a `preview-mode` class when in preview mode', () => {
    // arrange
    component.controlData = { Title: { Default: 'test title' } } as any;
    component.mode = StatementModeEnum.Preview;
    component.calculationControls = [];

    // act
    fixture.detectChanges();

    // assert
    expect(fixture.nativeElement.querySelector('.trs-chart.preview-mode')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('.trs-chart.edit-mode')).toBeFalsy();
    expect(fixture.nativeElement.querySelector('.trs-chart.print-mode')).toBeFalsy();
  });

  it('should set an `edit-mode` class when in edit mode', () => {
    // arrange
    component.controlData = { Title: { Default: 'test title' } } as any;
    component.mode = StatementModeEnum.Edit;
    component.calculationControls = [];

    // act
    fixture.detectChanges();

    // assert
    expect(fixture.nativeElement.querySelector('.trs-chart.edit-mode')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('.trs-chart.preview-mode')).toBeFalsy();
    expect(fixture.nativeElement.querySelector('.trs-chart.print-mode')).toBeFalsy();
  });

  it('should calc `getChartPreviewData` as an empty array when no calculation controls exist', () => {
    // arrange
    component.calculationControls = [];

    // act
    const chartPreviewData = component.getChartPreviewData();

    // assert
    expect(chartPreviewData).toEqual([]);
  });

  it('should calc `getChartPreviewData` with the expected category when no override is defined', () => {
    // arrange
    component.calculationControls = [{ DataFields: [], Title: { Default: 'Default' } as any, ControlType: TotalRewardsControlEnum.Calculation } as any];

    // act
    const chartPreviewData = component.getChartPreviewData();

    // assert
    expect(chartPreviewData[0].category).toBe('Default');
  });

  it('should calc `getChartPreviewData` with the expected category when an override is defined', () => {
    // arrange
    const control = { DataFields: [], Title: { Default: 'Default', Override: 'Override' }, ControlType: TotalRewardsControlEnum.Calculation };
    component.calculationControls = [control as any];

    // act
    const chartPreviewData = component.getChartPreviewData();

    // assert
    expect(chartPreviewData[0].category).toBe('Override');
  });

  it('should calc `getChartPreviewData` with `value` 0 when no DataFields exist', () => {
    // arrange
    component.calculationControls = [{ DataFields: [], Title: {} as any, ControlType: TotalRewardsControlEnum.Calculation } as any];
    component.employeeRewardsData = { EmployeeBase: 100000 } as any;

    // act
    const chartPreviewData = component.getChartPreviewData();

    // assert
    expect(chartPreviewData[0].value).toBe(0);
  });

  it('should calc `getChartPreviewData` as 0 when no visible DataFields exist', () => {
    // arrange
    const dataFields = [{ Id: '1', DatabaseField: 'EmployeeBase', Name: { Default: 'Base Salary' }, IsVisible: false }];
    component.calculationControls = [{ DataFields: dataFields, Title: {} as any, ControlType: TotalRewardsControlEnum.Calculation } as any];
    component.employeeRewardsData = { EmployeeBase: 100000 } as any;

    // act
    const chartPreviewData = component.getChartPreviewData();

    // assert
    expect(chartPreviewData[0].value).toBe(0);
  });

  it('should calc `getChartPreviewData` as the expected value when visible DataFields exists', () => {
    // arrange
    const dataFields = [
      { Id: '1', DatabaseField: 'EmployeeMedicalInsurance', Name: { Default: 'Medical Insurance' }, IsVisible: true },
      { Id: '2', DatabaseField: 'EmployeeDentalInsurance', Name: { Default: 'Dental Insurance' }, IsVisible: false },
      { Id: '3', DatabaseField: 'EmployeeVisionInsurance', Name: { Default: 'Vision Insurance' }, IsVisible: true }
    ];
    component.calculationControls = [{ DataFields: dataFields, Title: {} as any, ControlType: TotalRewardsControlEnum.Calculation } as any];
    component.employeeRewardsData = { EmployeeMedicalInsurance: 10000, EmployeeDentalInsurance: 20000, EmployeeVisionInsurance: 30000 } as any;

    // act
    const chartPreviewData = component.getChartPreviewData();

    // assert
    expect(chartPreviewData[0].value).toBe(40);
  });

  it('should calc `getChartPreviewData` without a decimal when a visible DataField exists that maps to a non-whole number when formatted', () => {
    // arrange
    const dataFields = [{ Id: '1', DatabaseField: 'EmployeeBase', Name: { Default: 'Base Salary' }, IsVisible: true }];
    component.calculationControls = [{ DataFields: dataFields, Title: {} as any, ControlType: TotalRewardsControlEnum.Calculation } as any];
    component.employeeRewardsData = { EmployeeBase: 99555 } as any;

    // act
    const chartPreviewData = component.getChartPreviewData();

    // assert
    expect(chartPreviewData[0].value.toString().indexOf('.')).toBe(-1);
  });

  it('should calc `getChartPreviewData` with multiple items when more than 1 calc controls are present', () => {
    // arrange
    const cashDataFields = [{ Id: '1', DatabaseField: 'EmployeeBase', Name: { Default: 'Base Salary' }, IsVisible: true }];
    const retirementDataFields = [{ Id: '1', DatabaseField: 'EmployeePensionPlan', Name: { Default: 'Pension Plan' }, IsVisible: true }];

    const cashCalcControl = { DataFields: cashDataFields, Title: { Default: 'Cash' }, ControlType: TotalRewardsControlEnum.Calculation };
    const retirementCalcControl = { DataFields: retirementDataFields, Title: { Default: 'Health' }, ControlType: TotalRewardsControlEnum.Calculation };

    component.calculationControls = [cashCalcControl as any, retirementCalcControl as any];
    component.employeeRewardsData = { EmployeeBase: 100000, EmployeePensionPlan: 20000 } as any;

    // act
    const chartPreviewData = component.getChartPreviewData();

    // assert
    expect(chartPreviewData.length).toBe(2);
    expect(chartPreviewData[0].category).toBeTruthy();
    expect(chartPreviewData[1].category).toBeTruthy();
    expect(chartPreviewData[0].category !== chartPreviewData[1].category).toBeTruthy();
  });

  it('should calc `getChartEditData` with the default calc control titles', () => {
    // arrange
    const cashCalcControl = { Title: { Default: 'Default Cash', Override: 'Override' }, ControlType: TotalRewardsControlEnum.Calculation };
    const retirementCalcControl = { Title: { Default: 'Default Health', Override: null }, ControlType: TotalRewardsControlEnum.Calculation };

    component.calculationControls = [cashCalcControl as any, retirementCalcControl as any];

    // act
    const chartEditData = component.getChartEditData();

    // assert
    expect(chartEditData.length).toBe(2);
    expect(chartEditData[0].category).toBe('Default Cash');
    expect(chartEditData[1].category).toBe('Default Health');
  });

  it('should calc `getChartEditData` with numeric, whole values greater than 0', () => {
    // arrange
    const cashCalcControl = { Title: { Default: 'Default Cash', Override: 'Override' }, ControlType: TotalRewardsControlEnum.Calculation };
    component.calculationControls = [cashCalcControl as any];

    // act
    const chartEditData = component.getChartEditData();

    // assert
    expect(isNaN(chartEditData[0].value)).toBeFalsy();
    expect(chartEditData[0].value).toBeTruthy();
    expect(chartEditData[0].value.toString().indexOf('.')).toBe(-1);
  });
});
