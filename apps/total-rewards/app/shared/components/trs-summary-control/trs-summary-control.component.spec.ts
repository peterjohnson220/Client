import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CurrencyPipe } from '@angular/common';

import { generateMockEmployeeRewardsData } from 'libs/models/payfactors-api/total-rewards';

import { TrsSummaryControlComponent } from './trs-summary-control.component';
import {
  generateMockCalculationControl,
  LabelWithOverride,
  StatementModeEnum
} from '../../models';

describe('TrsSummaryControlComponent', () => {
  let component: TrsSummaryControlComponent;
  let fixture: ComponentFixture<TrsSummaryControlComponent>;
  let currencyPipe: CurrencyPipe;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TrsSummaryControlComponent],
      providers: [{
        provide: CurrencyPipe,
        useValue: { transform: (x) => ('$' + x)  }
      }],
      schemas: [NO_ERRORS_SCHEMA]
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrsSummaryControlComponent);
    component = fixture.componentInstance;
    currencyPipe = TestBed.inject(CurrencyPipe);
  });

  it('should create', () => {
    component.controlData = {
      Title: { Default: 'Your Total Rewards Value', Override: '' } as LabelWithOverride
    } as any;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should display in edit mode', () => {
    component.controlData = {
      Title: { Default: 'Your Total Rewards Value', Override: '' } as LabelWithOverride
    } as any;
    component.mode = StatementModeEnum.Edit;
    fixture.detectChanges();
    expect(fixture).toMatchSnapshot();
  });

  it('should display in preview mode', () => {
    component.controlData = {
      Title: { Default: 'Your Total Rewards Value', Override: '' } as LabelWithOverride
    } as any;
    component.mode = StatementModeEnum.Preview;
    fixture.detectChanges();
    expect(fixture).toMatchSnapshot();
  });

  it('should display in preview mode w/ data', () => {
    component.controlData = {
      Title: { Default: 'Your Total Rewards Value', Override: '' } as LabelWithOverride
    } as any;
    component.mode = StatementModeEnum.Preview;
    component.calculationControls = [generateMockCalculationControl()];
    component.employeeRewardsData = generateMockEmployeeRewardsData();
    fixture.detectChanges();
    expect(fixture).toMatchSnapshot();
  });
});
