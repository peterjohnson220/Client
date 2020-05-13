import {NO_ERRORS_SCHEMA} from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {combineReducers, Store, StoreModule} from '@ngrx/store';

import * as fromRootState from 'libs/state/state';

import * as fromLoaderDashboardPageReducer from '../../reducers';
import * as fromLoaderDashboardPageActions from '../../actions/loader-dashboard-page.actions';

import { LoaderDashboardFilterComponent } from './loader-dashboard-filter.component';

describe('LoaderDashboardFilterComponent', () => {
  let component: LoaderDashboardFilterComponent;
  let fixture: ComponentFixture<LoaderDashboardFilterComponent>;
  let store: Store<fromLoaderDashboardPageReducer.State>;

  beforeEach((() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          loaderdashboard_main: combineReducers(fromLoaderDashboardPageReducer.reducers)
        })
      ],
      declarations: [ LoaderDashboardFilterComponent ],
      schemas: [ NO_ERRORS_SCHEMA ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoaderDashboardFilterComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Store);
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch an update grid search action if company changes to value', () => {
    // arrange
    spyOn(store, 'dispatch');
    const expectedAction = new fromLoaderDashboardPageActions.UpdateGridSearchPayload([{
      key: 'Company_ID',
      value: 3
    }]);

    // act
    component.updateSelectedCompany(3);

    // assert
    expect(store.dispatch).toHaveBeenNthCalledWith(1, expectedAction);
  });

  it('should dispatch an update grid search action if company is cleared', () => {
    // arrange
    spyOn(store, 'dispatch');
    const expectedAction = new fromLoaderDashboardPageActions.UpdateGridSearchPayload([{
      key: 'Company_ID',
      value: null
    }]);

    // act
    component.updateSelectedCompany(null);

    // assert
    expect(store.dispatch).toHaveBeenNthCalledWith(1, expectedAction);
  });

  it('should dispatch an update grid search action if start date is set', () => {
    // arrange
    spyOn(store, 'dispatch');
    const date = new Date();
    date.setDate(date.getDate());
    const expectedAction = new fromLoaderDashboardPageActions.UpdateGridSearchPayload([{
      key: 'StartDate',
      value: date.getTime()
    }]);

    // act
    component.changeDate(date, 'Start');

    // assert
    expect(store.dispatch).toHaveBeenNthCalledWith(1, expectedAction);
  });

  it('should dispatch an update grid search action if end date is set', () => {
    // arrange
    spyOn(store, 'dispatch');
    const date = new Date();
    date.setDate(date.getDate());
    const expectedAction = new fromLoaderDashboardPageActions.UpdateGridSearchPayload([{
      key: 'EndDate',
      value: date.getTime()
    }]);

    // act
    component.changeDate(date, 'End');

    // assert
    expect(store.dispatch).toHaveBeenNthCalledWith(1, expectedAction);
  });

  it('should not dispatch on a bad changeDate operation', () => {
    // arrange
    spyOn(store, 'dispatch');
    const date = new Date();
    date.setDate(date.getDate());

    // act
    component.changeDate(date, 'Nothing');

    // assert
    expect(store.dispatch).not.toHaveBeenCalled();
  });

  it('should dispatch an update grid search action on manual refresh', () => {
    // arrange
    spyOn(store, 'dispatch');
    const expectedAction = new fromLoaderDashboardPageActions.UpdateGridSearchPayload([]);

    // act
    component.refresh();

    // assert
    expect(store.dispatch).toHaveBeenNthCalledWith(1, expectedAction);
  });
});
