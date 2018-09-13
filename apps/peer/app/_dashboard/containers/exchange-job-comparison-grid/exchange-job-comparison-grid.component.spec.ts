import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';

import { Store, combineReducers, StoreModule } from '@ngrx/store';
import {DataStateChangeEvent, GridDataResult, RowArgs, SelectionEvent} from '@progress/kendo-angular-grid';
import { of } from 'rxjs/observable/of';
import spyOn = jest.spyOn;

import * as fromRootState from 'libs/state/state';
import * as fromGridActions from 'libs/core/actions/grid.actions';
import { GridTypeEnum, ExchangeJobComparison, generateMockExchangeJobComparison } from 'libs/models';

import * as fromExchangeJobComparisonGridActions from '../../actions/exchange-job-comparison-grid.actions';
import * as fromExchangeDashboardActions from '../../actions/exchange-dashboard.actions';
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
          peer_dashboard: combineReducers(fromPeerDashboardReducer.reducers)
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
    instance.selectedKeys = [1];
    instance.exchangeJobOrgsDetailVisible$ = of(false);

    fixture.detectChanges();
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

  it('should return value with % as string when getExchangeIndexValue is called', () => {
    const expected = '100%';
    const mockExchangeIndex = 100.00;

    const actual = instance.getExchangeIndexValue(mockExchangeIndex);

    expect(actual).toBe(expected);
  });

  it('should return "text-success" string when getExchangeIndexFontColorClass is called with an index >= 100', () => {
    const expected = 'text-success';
    const mockIndex = 101;

    const actual = instance.getExchangeIndexFontColorClass(mockIndex);

    expect(actual).toBe(expected);
  });

  it('should return "text-danger" string when getExchangeIndexFontColorClass is called with an index < 50', () => {
    const expected = 'text-danger';
    const mockIndex = 49;
    const actual = instance.getExchangeIndexFontColorClass(mockIndex);

    expect(actual).toBe(expected);
  });

  it(`should clear selectedKeys when exchangeJobOrgsDetailVisible$ is false`, () => {
    const expectedKeys = [];

    expect(instance.selectedKeys).toEqual(expectedKeys);
  });

  it(`should NOT dispatch a LoadExchangeJobOrgs action when onSelectionChange is triggered and there are no selections`, () => {
    const mockSelectionEvent = {...generateMockSelectionEvent(), selectedRows: []};

    instance.onSelectionChange(mockSelectionEvent);

    expect(store.dispatch).not.toHaveBeenCalled();
  });

  it(`should dispatch a LoadExchangeJobOrgs action when onSelectionChange is triggered and there are selections`, () => {
    const mockExchangeJobComparison = generateMockExchangeJobComparison();
    const expectedAction = new fromExchangeDashboardActions.LoadExchangeJobOrgs(mockExchangeJobComparison);

    instance.onSelectionChange(generateMockSelectionEvent());

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
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

function generateMockSelectionEvent(): SelectionEvent {
  return {
    selectedRows: [{dataItem: generateMockExchangeJobComparison()} as RowArgs],
    deselectedRows: [],
    ctrlKey: false,
    index: 0,
    selected: true,
    shiftKey: false
  };
}
