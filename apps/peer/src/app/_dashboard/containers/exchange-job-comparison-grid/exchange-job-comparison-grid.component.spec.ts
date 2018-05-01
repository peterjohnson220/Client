import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';

import { Store, combineReducers, StoreModule } from '@ngrx/store';
import { DataStateChangeEvent, GridDataResult} from '@progress/kendo-angular-grid';
import { of } from 'rxjs/observable/of';
import spyOn = jest.spyOn;

import * as fromRootState from 'libs/state/state';
import * as fromGridActions from 'libs/core/actions/grid.actions';
import { GridTypeEnum, ExchangeJobComparison, generateMockExchangeJobComparison } from 'libs/models';

import * as fromExchangeJobComparisonGridActions from '../../actions/exchange-job-comparison-grid.actions';
import * as fromPeerDashboardReducer from '../../reducers';
import { ExchangeJobComparisonGridComponent } from './exchange-job-comparison-grid.component';

describe('Peer - Exchange Job Comparison Grid', () => {
  let fixture: ComponentFixture<ExchangeJobComparisonGridComponent>;
  let instance: ExchangeJobComparisonGridComponent;

  let store: Store<fromPeerDashboardReducer.State>;

  // Configure Testing Module for before each test
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          peerDashboard: combineReducers(fromPeerDashboardReducer.reducers)
        }),
      ],
      declarations: [
        ExchangeJobComparisonGridComponent
      ],
      // Shallow Testing
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    store = TestBed.get(Store);

    fixture = TestBed.createComponent(ExchangeJobComparisonGridComponent);
    instance = fixture.componentInstance;

    spyOn(store, 'dispatch');

    const mockJobComparison: ExchangeJobComparison = generateMockExchangeJobComparison();
    const gridDataResult: GridDataResult = {data: [mockJobComparison], total: 1};
    instance.exchangeJobComparisonsGridData$ = of(gridDataResult);
  });

  it('should dispatch a new LoadExchangeJobComparisons action when the component is initialized', () => {
    const expectedAction = new fromExchangeJobComparisonGridActions.LoadExchangeJobComparisons;
    fixture.detectChanges();

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should dispatch an UpdateGrid action when handleDataStateChange is called', () => {
    const mockGridState = generateMockDataStateChangeEvent();
    const expectedAction = new fromGridActions.UpdateGrid(GridTypeEnum.ExchangeJobComparison, mockGridState);
    fixture.detectChanges();

    instance.handleDataStateChange(mockGridState);

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should dispatch a LoadExchangeJobComparisons action when handleDataStateChange is called', () => {
    const mockGridState = generateMockDataStateChangeEvent();
    const expectedAction = new fromExchangeJobComparisonGridActions.LoadExchangeJobComparisons();
    fixture.detectChanges();

    instance.handleDataStateChange(mockGridState);

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should return absolute value with string when getExchangeIndexValue is called', () => {
    const expected = '100%';
    const mockExchangeIndex = -100.00;

    const actual = instance.getExchangeIndexValue(mockExchangeIndex);

    expect(actual).toBe(expected);
  });

  it('should return "text-success" string when getExchangeIndexFontColorClass is called with an index > 0', () => {
    const expected = 'text-success';
    const mockIndex = 1;

    const actual = instance.getExchangeIndexFontColorClass(mockIndex);

    expect(actual).toBe(expected);
  });

  it('should return "text-danger" string when getExchangeIndexFontColorClass is called with an index < 0', () => {
    const expected = 'text-danger';
    const mockIndex = -1;
    const actual = instance.getExchangeIndexFontColorClass(mockIndex);

    expect(actual).toBe(expected);
  });

  it('should return "text-info" string when getExchangeIndexFontColorClass is called with an index = 0', () => {
    const expected = 'text-info';
    const mockIndex = 0.00;
    const actual = instance.getExchangeIndexFontColorClass(mockIndex);

    expect(actual).toBe(expected);
  });

  it('should return "fa-chevron-down" string when getExchangeIndexIconClass is called with an index > 0', () => {
    const expected = 'fa-chevron-down';
    const mockIndex = -1;

    const actual = instance.getExchangeIndexIconClass(mockIndex);

    expect(actual).toBe(expected);
  });

  it('should return "fa-chevron-up" string when getExchangeIndexIconClass is called with an index < 0', () => {
    const expected = 'fa-chevron-up';
    const mockIndex = 1;
    const actual = instance.getExchangeIndexIconClass(mockIndex);

    expect(actual).toBe(expected);
  });

  it('should return "fa-sort" string when getExchangeIndexIconClass is called with an index = 0', () => {
    const expected = 'fa-sort';
    const mockIndex = 0.00;
    const actual = instance.getExchangeIndexIconClass(mockIndex);

    expect(actual).toBe(expected);
  });

});

function generateMockDataStateChangeEvent(): DataStateChangeEvent {
  return {
    filter: {filters: [], logic: 'and'},
    group: null,
    skip: 0,
    take: 10,
    sort: [
      {field: 'CompanyJobTitle', dir: 'desc'}
    ]
  };
}
