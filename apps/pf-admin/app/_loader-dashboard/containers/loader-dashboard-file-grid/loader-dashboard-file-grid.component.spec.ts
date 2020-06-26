import {NO_ERRORS_SCHEMA} from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import {combineReducers, Store, StoreModule} from '@ngrx/store';
import {GridModule, RowClassArgs} from '@progress/kendo-angular-grid';

import * as fromRootState from 'libs/state/state';

import * as fromLoaderDashboardPageReducer from '../../reducers';

import { LoaderDashboardFileGridComponent } from './loader-dashboard-file-grid.component';

describe('LoaderDashboardFileGridComponent', () => {
  let component: LoaderDashboardFileGridComponent;
  let fixture: ComponentFixture<LoaderDashboardFileGridComponent>;
  let store: Store<fromLoaderDashboardPageReducer.State>;

  beforeEach((() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          loaderdashboard_main: combineReducers(fromLoaderDashboardPageReducer.reducers)
        }),
        GridModule,
      ],
      declarations: [ LoaderDashboardFileGridComponent ],
      schemas: [ NO_ERRORS_SCHEMA ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoaderDashboardFileGridComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Store);
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should highlight a row if a load is greater than or equal to than 15 minutes old', () => {
    // arrange
    const args = {
      dataItem: {
        lastModifiedDate: '2020-04-15T17:42:18.817Z'
      }
    } as RowClassArgs;

    // act
    const result = component.rowCallback(args);

    // assert
    expect(result).toBe('stuck-load');
  });

  it('should highlight a row if a load is less than 15 minutes old', () => {
    const args = {
      dataItem: {
        lastModifiedDate: new Date().toISOString()
      }
    } as RowClassArgs;

    // act
    const result = component.rowCallback(args);

    // assert
    expect(result).toBe('');
  });
});
