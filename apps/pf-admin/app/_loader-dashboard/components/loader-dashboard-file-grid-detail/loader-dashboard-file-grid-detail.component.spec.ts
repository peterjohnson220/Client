import {NO_ERRORS_SCHEMA} from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import {combineReducers, Store, StoreModule} from '@ngrx/store';

import * as fromRootState from 'libs/state/state';

import * as fromLoaderDashboardPageReducer from '../../reducers';

import { LoaderDashboardFileGridDetailComponent } from './loader-dashboard-file-grid-detail.component';

describe('LoaderDashboardFileGridDetailComponent', () => {
  let component: LoaderDashboardFileGridDetailComponent;
  let fixture: ComponentFixture<LoaderDashboardFileGridDetailComponent>;
  let store: Store<fromLoaderDashboardPageReducer.State>;

  beforeEach((() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          loaderdashboard_main: combineReducers(fromLoaderDashboardPageReducer.reducers)
        })
      ],
      declarations: [ LoaderDashboardFileGridDetailComponent ],
      schemas: [ NO_ERRORS_SCHEMA ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoaderDashboardFileGridDetailComponent);
    component = fixture.componentInstance;
    store = TestBed.get(Store);
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
