import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { combineReducers, Store, StoreModule } from '@ngrx/store';
import { GridModule } from '@progress/kendo-angular-grid';

import * as fromRootState from 'libs/state/state';

import * as fromCompositeSummaryDownloadActions from '../../../../../dashboard/app/_main/actions/composite-summary-download.actions';

import { LoaderDashboardGridComponent } from './loader-dashboard-grid.component';
import { GetErrorMessagePipe } from '../../pipes';
import * as fromLoaderDashboardPageReducer from '../../reducers';
import { FileType } from 'libs/models/dashboard';
import { AbstractFeatureFlagService, FeatureFlagContext } from 'libs/core/services/feature-flags';

class MockAbstractFeatureFlagService {
  bindEnabled(key: string, defaultValue?: boolean, context?: FeatureFlagContext) {
    jest.fn();
  }
}

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
        }),
        GridModule
      ],
      providers: [
        {
          provide: AbstractFeatureFlagService,
          useClass: MockAbstractFeatureFlagService
        }
      ],
      declarations: [
        LoaderDashboardGridComponent,
        // Pipes
        GetErrorMessagePipe,
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoaderDashboardGridComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Store);
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch a download file action on button click', () => {
    // arrange
    spyOn(store, 'dispatch');
    const expectedAction = new fromCompositeSummaryDownloadActions.CompositeSummaryDownload({ Id: 'abc123', FileType: FileType.InvalidRecordsFile });

    // act
    component.downloadInvalidRecordsFile('abc123');

    // assert
    expect(store.dispatch).toHaveBeenNthCalledWith(1, expectedAction);
  });
});
