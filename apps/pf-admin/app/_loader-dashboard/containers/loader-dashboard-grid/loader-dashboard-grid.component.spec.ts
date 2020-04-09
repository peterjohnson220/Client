import {NO_ERRORS_SCHEMA} from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import {combineReducers, Store, StoreModule} from '@ngrx/store';

import * as fromRootState from 'libs/state/state';

import * as fromCompositeSummaryDownloadActions from '../../../../../dashboard/app/_main/actions/composite-summary-download.actions';

import { LoaderDashboardGridComponent } from './loader-dashboard-grid.component';
import * as fromLoaderDashboardPageReducer from '../../reducers';

describe('LoaderDashboardGridComponent', () => {
  let component: LoaderDashboardGridComponent;
  let fixture: ComponentFixture<LoaderDashboardGridComponent>;
  let store: Store<fromLoaderDashboardPageReducer.State>;

  beforeEach((() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          loaderdashboard_main: combineReducers(fromLoaderDashboardPageReducer.reducers)
        })
      ],
      declarations: [ LoaderDashboardGridComponent ],
      schemas: [ NO_ERRORS_SCHEMA ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoaderDashboardGridComponent);
    component = fixture.componentInstance;
    store = TestBed.get(Store);
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch a download file action on button click', () => {
    // arrange
    spyOn(store, 'dispatch');
    const expectedAction = new fromCompositeSummaryDownloadActions.CompositeSummaryDownload({ Id: 'abc123' });

    // act
    component.downloadFile('abc123');

    // assert
    expect(store.dispatch).toHaveBeenNthCalledWith(1, expectedAction);
  });
});
