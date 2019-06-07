import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { combineReducers, Store, StoreModule } from '@ngrx/store';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import * as fromRootState from 'libs/state/state';

import * as fromJobDescriptionReducers from '../reducers';
import { JobDescriptionHistoryModalComponent } from './job-description-history-modal.component';
import * as fromJobDescriptionHistoryListActions from '../actions/job-description-history-list.actions';
import { generateMockJobDescriptionHistoryListItem } from '../models/job-description-history-list-item.model';

describe('Job Description Management - Job Description - Job Description Grid', () => {
  let instance: JobDescriptionHistoryModalComponent;
  let fixture: ComponentFixture<JobDescriptionHistoryModalComponent>;
  let store: Store<fromJobDescriptionReducers.State>;
  let modal: NgbModal;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          jobdescriptonmanagement_jobdescription: combineReducers(fromJobDescriptionReducers.reducers),
        })
      ],
      declarations: [
        JobDescriptionHistoryModalComponent
      ],
      providers: [
        {
          provide: NgbModal,
          useValue: { open: jest.fn() }
        },
        {
          provide: Router,
          useValue: { navigate: jest.fn() }
        },
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    fixture = TestBed.createComponent(JobDescriptionHistoryModalComponent);
    instance = fixture.componentInstance;

    store = TestBed.get(Store);
    modal = TestBed.get(NgbModal);
    router = TestBed.get(Router);
  });

  it('should dispatch LoadJobDescriptionHistoryListItems event and open modal, when calling open', () => {
    spyOn(store, 'dispatch');
    spyOn(modal, 'open');

    instance.jobDescriptionHistoryModalComponent = {};

    const mockedJobDescriptionId = 1;
    const mockedJobTitle = 'Test Job Title';

    instance.open(mockedJobDescriptionId, mockedJobTitle);

    expect(instance.jobDescriptionId).toEqual(mockedJobDescriptionId);
    expect(instance.jobTitle).toEqual(mockedJobTitle);

    const expectedRequest = { JobDescriptionId: mockedJobDescriptionId };
    const expectedAction = new fromJobDescriptionHistoryListActions.LoadJobDescriptionHistoryListItems(expectedRequest);

    expect(store.dispatch).toHaveBeenLastCalledWith(expectedAction);
    expect(modal.open).toHaveBeenLastCalledWith(instance.jobDescriptionHistoryModalComponent, { backdrop: 'static' });
  });

  it('should go to current JD version for historyListItemClicked when historyListItem is the 1st item in jobDescriptionHistoryListItems',
    () => {
    spyOn(router, 'navigate');
    spyOn(modal, 'open').and.returnValue({ close: jest.fn() });

    const mockedHistoryListItem = generateMockJobDescriptionHistoryListItem();

    instance.jobDescriptionId = 2;
    instance.jobDescriptionHistoryListItems = [mockedHistoryListItem];
    instance.modalRef = modal.open(JobDescriptionHistoryModalComponent);

    instance.historyListItemClicked(mockedHistoryListItem);

    const expectedRequest = [`job-description-management/job-descriptions/2`];

    expect(router.navigate).toHaveBeenLastCalledWith(expectedRequest);
    expect(instance.modalRef.close).toHaveBeenCalled();
  });

  it('should go to specific JD version for historyListItemClicked when historyListItem is > 1st item in jobDescriptionHistoryListItems',
    () => {
      spyOn(router, 'navigate');
      spyOn(modal, 'open').and.returnValue({ close: jest.fn() });

      const mockedHistoryListItem1 = generateMockJobDescriptionHistoryListItem(1);
      const mockedHistoryListItem2 = generateMockJobDescriptionHistoryListItem(2);

      instance.jobDescriptionId = 2;
      instance.jobDescriptionHistoryListItems = [mockedHistoryListItem1, mockedHistoryListItem2];
      instance.modalRef = modal.open(JobDescriptionHistoryModalComponent);

      instance.historyListItemClicked(mockedHistoryListItem2);

      const expectedRequest = [`job-description-management/job-descriptions/2`, { versionNumber: mockedHistoryListItem2.VersionNumber }];

      expect(router.navigate).toHaveBeenLastCalledWith(expectedRequest);
      expect(instance.modalRef.close).toHaveBeenCalled();
  });
});
