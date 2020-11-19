import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { generateMockEmployeeRewardsData } from 'libs/models/payfactors-api/total-rewards';

import {
  generateMockStatement,
  generateMockStatementWithSingleCalculationControl,
  generateMockStatementWithSingleCalculationControlAndNoVisibleFields,
  generateMockStatementWithSingleControl,
  generateMockSettings,
  StatementModeEnum,
  TotalRewardsControlEnum,
} from '../../models';
import { TotalRewardsStatementComponent } from './total-rewards-statement.component';

describe('TotalRewardsStatementComponent', () => {
  let component: TotalRewardsStatementComponent;
  let fixture: ComponentFixture<TotalRewardsStatementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TotalRewardsStatementComponent],
      schemas: [NO_ERRORS_SCHEMA]
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TotalRewardsStatementComponent);
    component = fixture.componentInstance;
  });

  it('should create with initial state', () => {
    // arrange
    component.statement = generateMockStatement();
    component.employeeRewardsData = generateMockEmployeeRewardsData();

    // act
    fixture.detectChanges();

    // assert
    expect(component).toBeTruthy();
  });

  it('should render a mock statement derived from template A', () => {
    // arrange
    component.statement = generateMockStatement();
    component.employeeRewardsData = generateMockEmployeeRewardsData();

    // act
    fixture.detectChanges();

    // assert
    expect(fixture).toMatchSnapshot();
  });

  it('should render the expected number of pages', () => {
    // arrange
    component.statement = generateMockStatement();
    component.statement.Pages = [{} as any, {} as any];
    component.employeeRewardsData = generateMockEmployeeRewardsData();

    // act
    fixture.detectChanges();

    // assert
    const pages = fixture.nativeElement.querySelectorAll('.trs-page');
    expect(pages.length).toBe(2);
  });

  it('should render the expected number of sections', () => {
    // arrange
    component.statement = generateMockStatement();
    component.statement.Pages = [{ Sections: [{}, {}, {}, {}, {}] }] as any;
    component.employeeRewardsData = generateMockEmployeeRewardsData();

    // act
    fixture.detectChanges();

    // assert
    const sections = fixture.nativeElement.querySelectorAll('section.trs-section');
    expect(sections.length).toBe(5);
  });

  it('should render the expected number of columns', () => {
    // arrange
    component.statement = generateMockStatement();
    component.statement.Pages = [{ Sections: [{ Columns: [{}] } as any ] }];
    component.employeeRewardsData = generateMockEmployeeRewardsData();

    // act
    fixture.detectChanges();

    // assert
    const columns = fixture.nativeElement.querySelectorAll('.trs-column');
    expect(columns.length).toBe(1);
  });

  it('should render a rich text control', () => {
    // arrange
    component.statement = generateMockStatementWithSingleControl(TotalRewardsControlEnum.RichTextEditor, null);
    component.mode = StatementModeEnum.Edit;

    // act
    fixture.detectChanges();

    // assert
    const richTextEditors = fixture.nativeElement.querySelectorAll('pf-trs-rich-text-control');
    expect(richTextEditors.length).toBe(1);
  });

  it('should render an image control', () => {
    // arrange
    component.statement = generateMockStatementWithSingleControl(TotalRewardsControlEnum.Image, null);
    component.mode = StatementModeEnum.Edit;

    // act
    fixture.detectChanges();

    // assert
    const imageControls = fixture.nativeElement.querySelectorAll('pf-trs-image-control');
    expect(imageControls.length).toBe(1);
  });

  it('should render a calculation control', () => {
    // arrange
    component.statement = generateMockStatementWithSingleCalculationControl();
    component.employeeRewardsData = generateMockEmployeeRewardsData();

    // act
    fixture.detectChanges();

    // assert
    const calculationControls = fixture.nativeElement.querySelectorAll('pf-trs-calculation-control');
    expect(calculationControls.length).toBe(1);
  });

  it('should render a chart control', () => {
    // arrange
    component.statement = generateMockStatementWithSingleControl(TotalRewardsControlEnum.Chart, null);
    component.mode = StatementModeEnum.Edit;

    // act
    fixture.detectChanges();

    // assert
    const chartControls = fixture.nativeElement.querySelectorAll('pf-trs-chart-control');
    expect(chartControls.length).toBe(1);
  });

  it('should render a title control', () => {
    // arrange
    component.statement = generateMockStatementWithSingleControl(TotalRewardsControlEnum.Title, null);
    component.mode = StatementModeEnum.Edit;

    // act
    fixture.detectChanges();

    // assert
    const titleControls = fixture.nativeElement.querySelectorAll('pf-trs-title-control');
    expect(titleControls.length).toBe(1);
  });

  it('should render a summary control', () => {
    // arrange
    component.statement = generateMockStatementWithSingleControl(TotalRewardsControlEnum.CalculationSummary, null);
    component.mode = StatementModeEnum.Edit;

    // act
    fixture.detectChanges();

    // assert
    const summaryControls = fixture.nativeElement.querySelectorAll('pf-trs-summary-control');
    expect(summaryControls.length).toBe(1);
  });

  it('should not include calc control if no valid rewards data', () => {
    // arrange
    component.statement = generateMockStatement();
    component.employeeRewardsData = generateMockEmployeeRewardsData();
    component.employeeRewardsData.EmployeeBase = null;
    component.employeeRewardsData.EmployeeBonus = 0;
    component.employeeRewardsData.EmployeeSTI = -456;
    component.employeeRewardsData.EmployeeLTI = null;

    // act
    fixture.detectChanges();

    // assert
    expect(component.visibleCalculationControls.length).toBe(3);
  });

  it('should not include calc control if rewards data is present, but no fields are visible', () => {
    // arrange
    component.statement = generateMockStatementWithSingleCalculationControlAndNoVisibleFields();
    component.employeeRewardsData = generateMockEmployeeRewardsData();

    // act
    fixture.detectChanges();

    // assert
    const calculationControls = fixture.nativeElement.querySelectorAll('pf-trs-calculation-control');
    expect(calculationControls.length).toBe(0);
  });

  it('should apply the divider color from settings to each column', () => {
    // arrange
    component.statement = generateMockStatementWithSingleCalculationControlAndNoVisibleFields();
    component.statement.Settings = { ...generateMockSettings(), DividerColor: 'orange' };
    component.employeeRewardsData = generateMockEmployeeRewardsData();

    // act
    fixture.detectChanges();

    // assert
    const columns = fixture.nativeElement.querySelectorAll('.trs-column');
    columns.forEach(column => expect(column.style.borderRightColor).toBe('orange'));
  });
});
