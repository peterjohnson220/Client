import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { combineReducers, Store, StoreModule } from '@ngrx/store';
import { of } from 'rxjs';

import * as fromRootState from 'libs/state/state';

import { DataCardComponent } from './data.card.component';
import * as fromComphubMainReducer from '../../../reducers';
import * as fromDataCardActions from '../../../actions/data-card.actions';
import { generateFakeJobData } from '../../../models';


describe('Comphub - Main - Data Card Component', () => {
  let instance: DataCardComponent;
  let fixture: ComponentFixture<DataCardComponent>;
  let store: Store<fromComphubMainReducer.State>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          comphub_main: combineReducers(fromComphubMainReducer.reducers),
        })
      ],
      declarations: [ DataCardComponent ],
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    fixture = TestBed.createComponent(DataCardComponent);
    instance = fixture.componentInstance;

    store = TestBed.get(Store);
    fixture.detectChanges();
  });

  it('should dispatch GetQuickPriceMarketData action when loading job results', () => {
    spyOn(store, 'dispatch');

    const expectedAction = new fromDataCardActions.GetQuickPriceMarketData({
      Skip: 0,
      Take: 10,
      CompanyPayMarketId: null,
      JobTitleShort: 'Test job',
      Sort: null
    });
    instance.paymarketId = null;
    instance.jobTitle = 'Test job';

    instance.loadJobResults();

    expect(store.dispatch).toBeCalledWith(expectedAction);
  });

  it('should dispatch GetQuickPriceMarketData action when page changed', () => {
    spyOn(store, 'dispatch');

    const expectedAction = new fromDataCardActions.GetQuickPriceMarketData({
      Skip: 100,
      Take: 20,
      CompanyPayMarketId: null,
      JobTitleShort: 'Test job',
      Sort: null
    });
    instance.jobTitle = 'Test job';
    instance.pageSize = 20;

    instance.handlePageChange(6);

    expect(store.dispatch).toBeCalledWith(expectedAction);
  });

  it('should dispatch GetQuickPriceMarketData action when navigating to data page', () => {
    spyOn(store, 'dispatch');

    const expectedAction = new fromDataCardActions.GetQuickPriceMarketData({
      Skip: 0,
      Take: 10,
      CompanyPayMarketId: null,
      JobTitleShort: 'Test job',
      Sort: null
    });

    instance.selectedPageIndex$ = of(2);
    instance.selectedJobTitle$ = of('Test job');
    instance.ngOnInit();

    expect(store.dispatch).toBeCalledWith(expectedAction);
  });

  it('should not dispatch GetQuickPriceMarketData action when navigating to other pages', () => {
    spyOn(store, 'dispatch');

    const expectedAction = new fromDataCardActions.GetQuickPriceMarketData({
      Skip: 0,
      Take: 10,
      CompanyPayMarketId: null,
      JobTitleShort: 'Test job',
      Sort: null
    });

    instance.selectedPageIndex$ = of(1);
    instance.selectedJobTitle$ = of('Test job');
    instance.ngOnInit();

    expect(store.dispatch).not.toBeCalledWith(expectedAction);
  });

  it('should dispatch an action when job selected', () => {
    spyOn(store, 'dispatch');

    const job = generateFakeJobData();
    const expectedAction = new fromDataCardActions.SetSelectedJobData(job);

    instance.handleSelectionChanged(job);

    expect(store.dispatch).toBeCalledWith(expectedAction);
  });

  it('should update the sort to descending when sorting a sorted field is clicked', () => {
    spyOn(store, 'dispatch');

    instance.gridContext.sortBy = {
      dir: 'asc',
      field: 'JobTitle'
    };

    instance.handleSortChange('JobTitle');

    expect(instance.gridContext.sortBy).toEqual({
      dir: 'desc',
      field: 'JobTitle'
    });
  });

  it('should sort by new field when sorting changed', () => {
    spyOn(store, 'dispatch');

    instance.gridContext.sortBy = {
      dir: 'asc',
      field: 'JobTitle'
    };

    instance.handleSortChange('YearsOfExperience');

    expect(instance.gridContext.sortBy).toEqual({
      dir: 'asc',
      field: 'YearsOfExperience'
    });
  });

  it('should not sort by fields which are not supported', () => {
    spyOn(store, 'dispatch');

    instance.gridContext.sortBy = {
      dir: 'asc',
      field: 'JobTitle'
    };

    instance.handleSortChange('Select');

    expect(instance.gridContext.sortBy).toEqual({
      dir: 'asc',
      field: 'JobTitle'
    });
  });

  it('should remove sorting when the field is sorted desc', () => {
    spyOn(store, 'dispatch');

    instance.gridContext.sortBy = {
      dir: 'desc',
      field: 'JobTitle'
    };

    instance.handleSortChange('JobTitle');

    expect(instance.gridContext.sortBy).toBeNull();
  });

  it('should dispatch GetQuickPriceMarketData action when loading job results', () => {
    spyOn(store, 'dispatch');

    const expectedAction = new fromDataCardActions.GetQuickPriceMarketData({
      Skip: 0,
      Take: 10,
      CompanyPayMarketId: null,
      JobTitleShort: 'Test job',
      Sort: {
        dir: 'asc',
        field: 'JobTitle'
      }
    });
    instance.paymarketId = null;
    instance.jobTitle = 'Test job';

    instance.handleSortChange('JobTitle');

    expect(store.dispatch).toBeCalledWith(expectedAction);
  });

});
