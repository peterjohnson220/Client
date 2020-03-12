import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute} from '@angular/router';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { of } from 'rxjs';
import { Store } from '@ngrx/store';
import { DragulaModule } from 'ng2-dragula';
import { provideMockStore, MockStore } from '@ngrx/store/testing';

import { generateDefaultAsyncStateObj } from 'libs/models';

import * as statementEditReducer from '../../../_main/statement-edit/reducers/statement-edit.page.reducer';
import * as fromTotalRewardsStatementEditReducer from '../../../_main/statement-edit/reducers';
import { Statement, generateMockStatement, generateMockStatementWithSingleControl } from '../../models/statement';
import { TotalRewardsControlEnum } from '../../models/total-rewards-control-enum';
import { TotalRewardsStatementComponent } from './total-rewards-statement.component';

describe('TotalRewardsStatementComponent', () => {
  let component: TotalRewardsStatementComponent;
  let fixture: ComponentFixture<TotalRewardsStatementComponent>;
  let activatedRoute: ActivatedRoute;

  const initialState = { totalRewards_statementEdit: { page: statementEditReducer.initialState } };
  initialState.totalRewards_statementEdit.page.statementObject = generateDefaultAsyncStateObj<Statement>(generateMockStatement());
  let store: MockStore<fromTotalRewardsStatementEditReducer.State>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [DragulaModule.forRoot()],
      providers: [
        provideMockStore({}),
        {
          provide: ActivatedRoute,
          useValue: { queryParams: of({ params: { pages: 1 } }) }
        }
      ],
      declarations: [TotalRewardsStatementComponent],
      schemas: [NO_ERRORS_SCHEMA]
    });

    store = TestBed.get(Store);
    activatedRoute = TestBed.get(ActivatedRoute);
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
    store.setState({ totalRewards_statementEdit: { page: statementEditReducer.initialState } } as any);

    // act
    fixture.detectChanges();

    // assert
    expect(fixture).toMatchSnapshot();
  });

  it('should render the expected number of pages', () => {
    // arrange
    const statementEditState = statementEditReducer.initialState;
    statementEditState.statementObject.obj.Pages = [{} as any, {} as any];
    store.setState({ totalRewards_statementEdit: { page: statementEditState } } as any);

    // act
    fixture.detectChanges();

    // assert
    const pages = fixture.nativeElement.querySelectorAll('.trs-page');
    expect(pages.length).toBe(2);
  });

  it('should render the expected number of sections', () => {
    // arrange
    const statementEditState = statementEditReducer.initialState;
    statementEditState.statementObject.obj.Pages = [{ Sections: [{}, {}, {}, {}, {}] }] as any;
    store.setState({ totalRewards_statementEdit: { page: statementEditState } } as any);

    // act
    fixture.detectChanges();

    // assert
    const sections = fixture.nativeElement.querySelectorAll('section.trs-section');
    expect(sections.length).toBe(5);
  });

  it('should render the expected number of columns', () => {
    // arrange
    const statementEditState = statementEditReducer.initialState;
    statementEditState.statementObject.obj.Pages = [{ Sections: [{ Columns: [{}] } as any ] }];
    store.setState({ totalRewards_statementEdit: { page: statementEditState } } as any);

    // act
    fixture.detectChanges();

    // assert
    const columns = fixture.nativeElement.querySelectorAll('.trs-column');
    expect(columns.length).toBe(1);
  });

  it('should render a rich text control', () => {
    // arrange
    const statementEditState = statementEditReducer.initialState;
    statementEditState.statementObject.obj = generateMockStatementWithSingleControl(TotalRewardsControlEnum.RichTextEditor);
    store.setState({ totalRewards_statementEdit: { page: statementEditState } } as any);

    // act
    fixture.detectChanges();

    // assert
    const richTextEditors = fixture.nativeElement.querySelectorAll('pf-trs-rich-text-control');
    expect(richTextEditors.length).toBe(1);
  });

  it('should render an image control', () => {
    // arrange
    const statementEditState = statementEditReducer.initialState;
    statementEditState.statementObject.obj = generateMockStatementWithSingleControl(TotalRewardsControlEnum.Image);
    store.setState({ totalRewards_statementEdit: { page: statementEditState } } as any);

    // act
    fixture.detectChanges();

    // assert
    const imageControls = fixture.nativeElement.querySelectorAll('pf-trs-image-control');
    expect(imageControls.length).toBe(1);
  });

  it('should render a calculation control', () => {
    // arrange
    const statementEditState = statementEditReducer.initialState;
    statementEditState.statementObject.obj = generateMockStatementWithSingleControl(TotalRewardsControlEnum.Calculation);
    store.setState({ totalRewards_statementEdit: { page: statementEditState } } as any);

    // act
    fixture.detectChanges();

    // assert
    const calculationControls = fixture.nativeElement.querySelectorAll('pf-trs-calculation-control');
    expect(calculationControls.length).toBe(1);
  });

  it('should render a chart control', () => {
    // arrange
    const statementEditState = statementEditReducer.initialState;
    statementEditState.statementObject.obj = generateMockStatementWithSingleControl(TotalRewardsControlEnum.Chart);
    store.setState({ totalRewards_statementEdit: { page: statementEditState } } as any);

    // act
    fixture.detectChanges();

    // assert
    const chartControls = fixture.nativeElement.querySelectorAll('pf-trs-chart-control');
    expect(chartControls.length).toBe(1);
  });

  it('should render a title control', () => {
    // arrange
    const statementEditState = statementEditReducer.initialState;
    statementEditState.statementObject.obj = generateMockStatementWithSingleControl(TotalRewardsControlEnum.Title);
    store.setState({ totalRewards_statementEdit: { page: statementEditState } } as any);

    // act
    fixture.detectChanges();

    // assert
    const titleControls = fixture.nativeElement.querySelectorAll('pf-trs-title-control');
    expect(titleControls.length).toBe(1);
  });

  it('should render a summary control', () => {
    // arrange
    const statementEditState = statementEditReducer.initialState;
    statementEditState.statementObject.obj = generateMockStatementWithSingleControl(TotalRewardsControlEnum.Summary);
    store.setState({ totalRewards_statementEdit: { page: statementEditState } } as any);

    // act
    fixture.detectChanges();

    // assert
    const summaryControls = fixture.nativeElement.querySelectorAll('pf-trs-summary-control');
    expect(summaryControls.length).toBe(1);
  });
});
