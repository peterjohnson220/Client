import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CurrencyPipe } from '@angular/common';

import { generateMockEmployeeRewardsData } from 'libs/models/payfactors-api/total-rewards';

import { TrsCalculationControlComponent } from './trs-calculation-control.component';
import { CompensationFieldPipe } from '../../pipes/compensation-field-pipe';
import {
  CalculationControl,
  CompensationField,
  generateMockCalculationControl,
  LabelWithOverride,
  StatementModeEnum
} from '../../models';
import { StringEditorComponent } from '../string-editor';

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
          useValue: { transform: (x) => x }
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

  it('should render the supplied title', () => {
    component.mode = StatementModeEnum.Preview;
    component.employeeRewardsData = {
      EmployeeBase: 65000
    } as any;
    component.controlData = {
      Title: { Default: 'test title' } as LabelWithOverride,
      Summary: {} as LabelWithOverride,
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

  it('should display the Add Field button if a field has been removed', () => {
    component.mode = StatementModeEnum.Edit;
    component.controlData = {
      Title: { Default: '' } as LabelWithOverride,
      Summary: { Default: 'test summary'} as LabelWithOverride,
      DataFields: [
        {
          FieldInDatabase: 'first',
          Placeholder: 'First',
          Name: '',
          IsVisible: false
        }
      ]
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
});
