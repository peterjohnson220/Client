import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { combineReducers, Store, StoreModule } from '@ngrx/store';
import { GridModule, RowClassArgs } from '@progress/kendo-angular-grid';

import * as fromRootState from 'libs/state/state';
import { FileType } from 'libs/models/dashboard';
import { AbstractFeatureFlagService, FeatureFlagContext } from 'libs/core/services/feature-flags';
import { CompositeDataLoadViewResponse, EntityLoadSummaryDetailView, EntityLoadSummaryView } from 'libs/models';

import * as fromCompositeSummaryDownloadActions from '../../../../../dashboard/app/_main/actions/composite-summary-download.actions';

import { LoaderDashboardGridComponent } from './loader-dashboard-grid.component';
import { GetErrorMessagePipe } from '../../pipes';
import * as fromLoaderDashboardPageReducer from '../../reducers';
import * as fromLoaderDashboardPageActions from '../../actions/loader-dashboard-page.actions';


class MockAbstractFeatureFlagService {
  bindEnabled(key: string, defaultValue?: boolean, context?: FeatureFlagContext) {
    jest.fn();
  }
}


describe('LoaderDashboardGridComponent', () => {
  let component: LoaderDashboardGridComponent;
  let fixture: ComponentFixture<LoaderDashboardGridComponent>;
  let store: Store<fromLoaderDashboardPageReducer.State>;
  const summary: EntityLoadSummaryView[]  = [{
      compositeDataLoadId: 1,
      entity: 'testentity',
      totalRecordCount: 1,
      insertCount: 1,
      updateCount: 0,
      deleteCount: 0,
      validUnchangedCount: 0,
      invalidCount: 1
  }];
  const summaryDetail: EntityLoadSummaryDetailView[]  = [{
    compositeDataLoadId: 1,
    entity: 'testentity',
    detailKey1: 'tes1',
    detailKey2: 'test2',
    totalRecordCount: 1,
    insertCount: 1,
    updateCount: 0,
    deleteCount: 0,
    validUnchangedCount: 0,
    invalidCount: 1
  }];
  const dataLoad: CompositeDataLoadViewResponse[] = [{
    compositeDataLoadId: 1,
    exportedSourceUri: 'test',
    externalId: 't1w1w',
    compositeLoaderType: 'Organizational Data',
    company_ID: 1,
    company_Name: 'test',
    validationErrorOutputUri: 'uritest',
    fixableDataConditionException: 'textexception',
    terminalException: 'testexception1',
    loadType: 'Manual',
    validationOnly: false,
    entityLoadSummaries: summary,
    entityLoadSummaryDetails: null,
    requestTime: null,
    processingStartTime: null,
    processingEndTime: null,
    hasErrorCondition: null,
  }];

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
    spyOn(store, 'dispatch');
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch a download file action on button click', () => {
    // arrange
    const expectedAction = new fromCompositeSummaryDownloadActions.CompositeSummaryDownload({ Id: 'abc123', FileType: FileType.InvalidRecordsFile });

    // act
    component.downloadInvalidRecordsFile('abc123');

    // assert
    expect(store.dispatch).toHaveBeenNthCalledWith(1, expectedAction);
  });

  it('should fail load for rowclass action', () => {
    // arrange
    const rowClassArgs: RowClassArgs = {dataItem: dataLoad[0], index: 0};

    // act
    const result = component.rowCallback(rowClassArgs);

    // assert
    expect(result).toBe( 'failed-load');
  });

  it('should dispatch a open Redrop Confirmation Modal', () => {
    // arrange
    const expectedAction = new fromLoaderDashboardPageActions.OpenRedropConfirmationModal();
    // act
    component.openRedropConfirmationModal(1, 'test', 2);

    // assert
    expect(store.dispatch).toHaveBeenCalledWith( expectedAction);
  });

  it('should show loader summaries', () => {
    // arrange
    const shouldShow = component.showIfLoadHasSummaries(dataLoad[0], 0);
    // assert
    expect(shouldShow).toBe( true);
  });

  it('should show loader summary grid', () => {
    // arrange
    const shouldShow = component.showIfLoadHasOnlySummary(dataLoad[0]);

    // assert
    expect(shouldShow).toBe( true);
  });

  it('should show loader summary details grid', () => {
    // arrange
    dataLoad[0].entityLoadSummaryDetails = summaryDetail;
    const shouldShow = component.showIfLoadHasSummaryDetails(dataLoad[0]);

    // assert
    expect(shouldShow).toBe( true);
  });

  it('should has a error condition', () => {
    // arrange
    const hasErrorCondition = component.hasErrorCondition(dataLoad)[0].hasErrorCondition;

    // assert
    expect(hasErrorCondition).toBe( true);
  });

  it('should has a detail key', () => {
    // arrange
    component.detailKeyByLoaderTypes = [
        {
          Key: 'Test',
          Value: {
            detailKey1: 'keyTest1',
            detailKey2: 'keyTest2'
          }
        }
      ];
    const hasDetailKeys = component.getDetailKeys('Test');

    // assert
    expect(hasDetailKeys.detailKey1).toBe( 'keyTest1');
  });


});
