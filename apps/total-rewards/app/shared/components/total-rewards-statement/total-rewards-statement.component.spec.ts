import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { DragulaModule } from 'ng2-dragula';
import { provideMockStore, MockStore } from '@ngrx/store/testing';

import { generateDefaultAsyncStateObj } from 'libs/models';

import * as statementEditReducer from '../../../_main/statement-edit/reducers/statement-edit.page.reducer';
import * as fromTotalRewardsStatementEditReducer from '../../../_main/statement-edit/reducers';
import {
  Statement,
  generateMockStatement,
  generateMockStatementWithSingleControl,
  generateMockEmployeeRewardsData,
  generateMockStatementWithSingleCalculationControl,
  generateMockStatementWithSingleCalculationControlAndNoVisibleFields
} from '../../models';
import { TotalRewardsControlEnum } from '../../models';
import { TotalRewardsStatementComponent } from './total-rewards-statement.component';

describe('TotalRewardsStatementComponent', () => {
  let component: TotalRewardsStatementComponent;
  let fixture: ComponentFixture<TotalRewardsStatementComponent>;

  const initialState = { totalRewards_statementEdit: { page: statementEditReducer.initialState } };
  initialState.totalRewards_statementEdit.page.statement = generateDefaultAsyncStateObj<Statement>(generateMockStatement());
  let store: MockStore<fromTotalRewardsStatementEditReducer.State>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [DragulaModule.forRoot()],
      providers: [
        provideMockStore({})
      ],
      declarations: [TotalRewardsStatementComponent],
      schemas: [NO_ERRORS_SCHEMA]
    });

    store = TestBed.inject(MockStore);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TotalRewardsStatementComponent);
    component = fixture.componentInstance;
  });

  it('should create with initial state', () => {
    // arrange
    store.setState({ totalRewards_statementEdit: { page: statementEditReducer.initialState } } as any);

    // act
    fixture.detectChanges();

    // assert
    expect(component).toBeTruthy();
  });

  it('should render a mock statement derived from template A', () => {
    // arrange
    fixture.componentInstance.statement = statementEditReducer.initialState.statement.obj;
    component.employeeRewardsData = generateMockEmployeeRewardsData();

    // act
    fixture.detectChanges();

    // assert
    expect(fixture).toMatchSnapshot();
  });

  it('should render the expected number of pages', () => {
    // arrange
    const statementEditState = statementEditReducer.initialState;
    statementEditState.statement.obj.Pages = [{} as any, {} as any];
    fixture.componentInstance.statement = statementEditState.statement.obj;

    // act
    fixture.detectChanges();

    // assert
    const pages = fixture.nativeElement.querySelectorAll('.trs-page');
    expect(pages.length).toBe(2);
  });

  it('should render the expected number of sections', () => {
    // arrange
    const statementEditState = statementEditReducer.initialState;
    statementEditState.statement.obj.Pages = [{ Sections: [{}, {}, {}, {}, {}] }] as any;
    fixture.componentInstance.statement = statementEditState.statement.obj;

    // act
    fixture.detectChanges();

    // assert
    const sections = fixture.nativeElement.querySelectorAll('section.trs-section');
    expect(sections.length).toBe(5);
  });

  it('should render the expected number of columns', () => {
    // arrange
    const statementEditState = statementEditReducer.initialState;
    statementEditState.statement.obj.Pages = [{ Sections: [{ Columns: [{}] } as any ] }];
    fixture.componentInstance.statement = statementEditState.statement.obj;

    // act
    fixture.detectChanges();

    // assert
    const columns = fixture.nativeElement.querySelectorAll('.trs-column');
    expect(columns.length).toBe(1);
  });

  it('should render a rich text control', () => {
    // arrange
    const statementEditState = statementEditReducer.initialState;
    statementEditState.statement.obj = generateMockStatementWithSingleControl(TotalRewardsControlEnum.RichTextEditor);
    fixture.componentInstance.statement = statementEditState.statement.obj;

    // act
    fixture.detectChanges();

    // assert
    const richTextEditors = fixture.nativeElement.querySelectorAll('pf-trs-rich-text-control');
    expect(richTextEditors.length).toBe(1);
  });

  it('should render an image control', () => {
    // arrange
    const statementEditState = statementEditReducer.initialState;
    statementEditState.statement.obj = generateMockStatementWithSingleControl(TotalRewardsControlEnum.Image);
    fixture.componentInstance.statement = statementEditState.statement.obj;

    // act
    fixture.detectChanges();

    // assert
    const imageControls = fixture.nativeElement.querySelectorAll('pf-trs-image-control');
    expect(imageControls.length).toBe(1);
  });

  it('should render a calculation control', () => {
    // arrange
    const statementEditState = statementEditReducer.initialState;
    statementEditState.statement.obj = generateMockStatementWithSingleCalculationControl();
    fixture.componentInstance.statement = statementEditState.statement.obj;
    component.employeeRewardsData = generateMockEmployeeRewardsData();

    // act
    fixture.detectChanges();

    // assert
    const calculationControls = fixture.nativeElement.querySelectorAll('pf-trs-calculation-control');
    expect(calculationControls.length).toBe(1);
  });

  it('should render a chart control', () => {
    // arrange
    const statementEditState = statementEditReducer.initialState;
    statementEditState.statement.obj = generateMockStatementWithSingleControl(TotalRewardsControlEnum.Chart);
    fixture.componentInstance.statement = statementEditState.statement.obj;

    // act
    fixture.detectChanges();

    // assert
    const chartControls = fixture.nativeElement.querySelectorAll('pf-trs-chart-control');
    expect(chartControls.length).toBe(1);
  });

  it('should render a title control', () => {
    // arrange
    const statementEditState = statementEditReducer.initialState;
    statementEditState.statement.obj = generateMockStatementWithSingleControl(TotalRewardsControlEnum.Title);
    fixture.componentInstance.statement = statementEditState.statement.obj;

    // act
    fixture.detectChanges();

    // assert
    const titleControls = fixture.nativeElement.querySelectorAll('pf-trs-title-control');
    expect(titleControls.length).toBe(1);
  });

  it('should render a summary control', () => {
    // arrange
    const statementEditState = statementEditReducer.initialState;
    statementEditState.statement.obj = generateMockStatementWithSingleControl(TotalRewardsControlEnum.CalculationSummary);
    fixture.componentInstance.statement = statementEditState.statement.obj;

    // act
    fixture.detectChanges();

    // assert
    const summaryControls = fixture.nativeElement.querySelectorAll('pf-trs-summary-control');
    expect(summaryControls.length).toBe(1);
  });

  it('should not include calc control if no rewards data', () => {
    // arrange
    component.statement = generateMockStatement();
    component.employeeRewardsData = generateMockEmployeeRewardsData();
    component.employeeRewardsData.EmployeeBase = null;
    component.employeeRewardsData.EmployeeBonus = null;
    component.employeeRewardsData.EmployeeSTI = null;
    component.employeeRewardsData.EmployeeLTI = null;

    // act
    fixture.detectChanges();

    // assert
    expect(component.visibleCalculationControls.length).toBe(3);
  });

  it('should not include calc control if rewards data is present, but no fields are visible', () => {
    // arrange
    const statementEditState = statementEditReducer.initialState;
    statementEditState.statement.obj = generateMockStatementWithSingleCalculationControlAndNoVisibleFields();
    component.statement = statementEditState.statement.obj;

    component.employeeRewardsData = generateMockEmployeeRewardsData();

    // act
    fixture.detectChanges();

    // assert
    const calculationControls = fixture.nativeElement.querySelectorAll('pf-trs-calculation-control');
    expect(calculationControls.length).toBe(0);
  });
});
