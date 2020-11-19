import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, inject, TestBed } from '@angular/core/testing';

import { StoreModule, combineReducers, Store } from '@ngrx/store';

import * as fromRootState from 'libs/state/state';

import * as fromReducer from '../../reducers';
import * as fromLoadersDataActions from '../../actions/loaders-data.actions';
import { LatestOrgDataLoadModalComponent } from './latest-org-data-load-modal.component';
import { CompositeDataLoadViewResponse, FileType } from 'libs/models';

describe('Data Management - Main - Default Paymarket Modal Component', () => {
  let component: LatestOrgDataLoadModalComponent;
  let fixture: ComponentFixture<LatestOrgDataLoadModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          loadersData: combineReducers(fromReducer.reducers),
        }),
      ],
      declarations: [
        LatestOrgDataLoadModalComponent,
      ],
      schemas: [
        NO_ERRORS_SCHEMA,
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(LatestOrgDataLoadModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch a dismiss action on downloadInvalidRecordsFile', inject(
    [Store],
    (store: Store<fromReducer.State>) => {
      // arrange
      const latestOrgDataLoad: CompositeDataLoadViewResponse = {
        compositeDataLoadId: null,
        exportedSourceUri: null,
        externalId: '1234-abcd',
        compositeLoaderType: null,
        company_ID: null,
        company_Name: null,
        validationErrorOutputUri: null,
        fixableDataConditionException: null,
        terminalException: null,
        entityLoadSummaries: [],
      };
      component.latestOrgDataLoad = latestOrgDataLoad;
      const expectedAction = new fromLoadersDataActions.DownloadIVRF({
        FileType: FileType.InvalidRecordsFile,
        Id: latestOrgDataLoad.externalId,
      });
      const spy = jest.spyOn(store, 'dispatch');

      // act
      component.downloadInvalidRecordsFile({ preventDefault: () => {} });

      // assert
      expect(spy).toBeCalledWith(expectedAction);
    }
  ));

  it('should dispatch a dismiss action on handleModalDismissed', inject(
    [Store],
    (store: Store<fromReducer.State>) => {
      // arrange
      const expectedAction = new fromLoadersDataActions.CloseLatestOrgDataLoadModal();
      const spy = jest.spyOn(store, 'dispatch');

      // act
      component.handleModalDismissed();

      // assert
      expect(spy).toBeCalledWith(expectedAction);
    }
  ));
});
