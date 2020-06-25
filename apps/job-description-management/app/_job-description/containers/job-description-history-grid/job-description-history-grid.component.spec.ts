import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { Store, StoreModule, combineReducers } from '@ngrx/store';
import { of } from 'rxjs';

import * as fromRootState from 'libs/state/state';
import { generateDefaultAsyncStateObj } from 'libs/models';

import * as fromJobDescriptionReducers from '../../reducers';
import { JobDescriptionHistoryGridComponent } from './job-description-history-grid.component';
import { generateMockJobDescriptionHistoryListItem } from '../../models';

describe('Job Description History Grid', () => {
  let instance: JobDescriptionHistoryGridComponent;
  let fixture: ComponentFixture<JobDescriptionHistoryGridComponent>;
  let store: Store<fromJobDescriptionReducers.State>;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          jobdescriptonmanagement_jobdescription: combineReducers(fromJobDescriptionReducers.reducers),
        })
      ],
      declarations: [ JobDescriptionHistoryGridComponent],
      providers: [
        {
          provide: Router,
          useValue: { navigate: jest.fn() }
        },
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    fixture = TestBed.createComponent(JobDescriptionHistoryGridComponent);
    instance = fixture.componentInstance;

    store = TestBed.inject(Store);
    router = TestBed.inject(Router);
  });

  it('should go to current JD version for historyListItemClicked when historyListItem is the 1st item in jobDescriptionHistoryListItems',
    () => {
    spyOn(router, 'navigate');
    spyOn(instance.historyListItemClicked, 'emit');

    instance.historyListItems$ = of(generateDefaultAsyncStateObj([generateMockJobDescriptionHistoryListItem()]));
    const mockedHistoryListItem = generateMockJobDescriptionHistoryListItem();

    instance.jobDescriptionId = 2;

    instance.handleHistoryItemClicked(0, mockedHistoryListItem);

    const expectedRequest = [`/job-descriptions/2`];

    expect(router.navigate).toHaveBeenLastCalledWith(expectedRequest);
    expect(instance.historyListItemClicked.emit).toHaveBeenCalled();
  });

  it('should go to specific JD version for historyListItemClicked when historyListItem is > 1st item in jobDescriptionHistoryListItems',
    () => {
      spyOn(router, 'navigate');

      const mockedHistoryListItem1 = generateMockJobDescriptionHistoryListItem(1);
      const mockedHistoryListItem2 = generateMockJobDescriptionHistoryListItem(2);
      instance.historyListItems$ = of(generateDefaultAsyncStateObj([mockedHistoryListItem1, mockedHistoryListItem2]));

      instance.jobDescriptionId = 2;

      instance.handleHistoryItemClicked(1, mockedHistoryListItem2);

      const expectedRequest = [`/job-descriptions/2`, { versionNumber: mockedHistoryListItem2.VersionNumber }];

      expect(router.navigate).toHaveBeenLastCalledWith(expectedRequest);
  });
});
