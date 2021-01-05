import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, ParamMap } from '@angular/router';
import { Store, StoreModule } from '@ngrx/store';
import { BehaviorSubject } from 'rxjs';

import {
  FileDownloadError,
  FileDownloadProgress,
  FileDownloadSuccess,
} from 'libs/features/file-download/file-download/actions/file-download.actions';
import * as fromFileReducer from 'libs/features/file-download/file-download/reducers/file-download.reducer';
import { FileModel } from 'libs/models/file';
import * as fromRootState from 'libs/state/state';
import { CompositeSummaryDownload } from '../../actions/composite-summary-download.actions';
import { CompositeSummaryDownloadComponent } from './composite-summary-download.component';
import { FileType } from 'libs/models/dashboard';

describe('Dashboard - Main - Composite Summary Download', () => {
  let fixture: ComponentFixture<CompositeSummaryDownloadComponent>;
  let instance: CompositeSummaryDownloadComponent;
  let store: Store<fromRootState.State>;
  const goodIdQueryParams = { compositeDataLoadExternalId: 'a9a93799-3825-5804-b6d7-ad87ebee956e' };
  const badIdQueryParams = { compositeDataLoadExternalId: 'invalidId' };

  let queryParamMap: BehaviorSubject<ParamMap>;

  beforeEach(() => {
    queryParamMap = new BehaviorSubject<ParamMap>(convertToParamMap(goodIdQueryParams));

    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({}),
        StoreModule.forFeature('feature_fileDownload', fromFileReducer.reducer),
      ],
      declarations: [
        CompositeSummaryDownloadComponent,
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            queryParamMap,
          },
        },
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    store = TestBed.inject(Store);
    jest.spyOn(store, 'dispatch');

    fixture = TestBed.createComponent(CompositeSummaryDownloadComponent);
    instance = fixture.componentInstance;
  });

  it('should dispatch a CompositeSummaryDownload action on init', () => {
    // arrange
    const action = new CompositeSummaryDownload({
      Id: goodIdQueryParams.compositeDataLoadExternalId,
      FileType: FileType.InvalidRecordsFile
    });

    // act
    fixture.detectChanges();

    // assert
    expect(store.dispatch).toHaveBeenLastCalledWith(action);
  });

  it('should show an error with an invalid compositeDataLoadExternalId', () => {
    // arrange
    queryParamMap.next(convertToParamMap(badIdQueryParams));

    // act
    fixture.detectChanges();

    // assert
    expect(instance.errorText).toEqual(`Invalid composite data load external ID: ${badIdQueryParams.compositeDataLoadExternalId}`);
  });

  it('should match query parameter error snapshot', () => {
    // arrange
    queryParamMap.next(convertToParamMap(badIdQueryParams));

    // act
    fixture.detectChanges();

    // assert
    expect(fixture).toMatchSnapshot();
  });

  it('should match file error snapshot', () => {
    // arrange
    const fileId = goodIdQueryParams.compositeDataLoadExternalId;
    const file: FileModel = {
      error: true,
      errorText: 'There is an error',
      fileId,
      progress: 100,
    };
    const action = new FileDownloadError(file);
    store.dispatch(action);

    // act
    fixture.detectChanges();

    // assert
    expect(fixture).toMatchSnapshot();
  });

  it('should match file download in progress snapshot', () => {
    // arrange
    const fileId = goodIdQueryParams.compositeDataLoadExternalId;
    const file: FileModel = {
      error: false,
      fileId,
      progress: 50,
    };
    const action = new FileDownloadProgress(file);
    store.dispatch(action);

    // act
    fixture.detectChanges();

    // assert
    expect(fixture).toMatchSnapshot();
  });

  it('should match file download success snapshot', () => {
    // arrange
    const fileId = goodIdQueryParams.compositeDataLoadExternalId;
    const file: FileModel = {
      error: false,
      fileId,
      progress: 100,
    };
    const action = new FileDownloadSuccess(file);
    store.dispatch(action);

    // act
    fixture.detectChanges();

    // assert
    expect(fixture).toMatchSnapshot();
  });
});
