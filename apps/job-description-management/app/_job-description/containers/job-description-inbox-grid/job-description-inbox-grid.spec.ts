import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';

import { combineReducers, Store, StoreModule } from '@ngrx/store';

import * as fromRootState from 'libs/state/state';
import * as fromGridActions from 'libs/core/actions/grid.actions';
import { GridTypeEnum } from 'libs/models';
import { JobDescriptionInbox } from 'libs/models/payfactors-api';
import { generateMockDataStateChangeEvent } from 'libs/extensions/kendo/mocks';

import * as fromJobDescriptionReducers from '../../reducers';
import * as fromJobDescriptionInboxActions from '../../actions/job-description-inbox.actions';
import { JobDescriptionInboxGridComponent } from './job-description-inbox-grid.component';

describe('Job Description Manager - Job Description Inbox Page - ', () => {
  let instance: JobDescriptionInboxGridComponent;
  let fixture: ComponentFixture<JobDescriptionInboxGridComponent>;
  let store: Store<fromJobDescriptionReducers.State>;
  let router: Router;

  const mockJobDescriptionInbox: JobDescriptionInbox = {
    CompanyWorkflowStepUserId: 12345,
    CreateDate: new Date(),
    CreatedBy: 'John Doe',
    CurrentReviewer: 'John Doe',
    IsRead: false,
    JobCode: 'MockJobCode',
    JobDescriptionId: 288948,
    JobTitle: 'Mock Job Code',
    LastUpdatedDate: new Date(),
    StatusChangedDate: new Date(),
    Token: 'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9',
    VersionNumber: 1
 };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          jobdescriptonmanagement_jobdescription: combineReducers(fromJobDescriptionReducers.reducers),
        })
      ],
      providers: [
        {
            provide: Router,
            useValue: { navigate: jest.fn() },
          }
      ],
      declarations: [
        JobDescriptionInboxGridComponent
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    fixture = TestBed.createComponent(JobDescriptionInboxGridComponent);
    instance = fixture.componentInstance;
    store = TestBed.inject(Store);
    router = TestBed.inject(Router);
    instance.ngOnInit();
  });

  it('should dispatch an UnselectAll action upon ngOnDestroy', () => {
    spyOn(store, 'dispatch');

    const expectedAction = new fromJobDescriptionInboxActions.UnselectAll();

    instance.ngOnDestroy();

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should route to job description page upon cell clicked', () => {
    spyOn(router, 'navigate');

    const mockCellClickEvent = {
        dataItem: mockJobDescriptionInbox,
        rowIndex: 1,
        originalEvent: {
          button: 0
        },
        column: {
          field: 'mockField'
        }
    };

    instance.onCellClick(mockCellClickEvent);

    expect(router.navigate).toHaveBeenCalledWith([`job-descriptions/${mockJobDescriptionInbox.JobDescriptionId}`],
    { queryParams: { 'jwt-workflow': mockJobDescriptionInbox.Token } });
  });


  it('should dispatch UpdateGrid, LoadInbox, and GetUnreadInboxCount actions upon onDataStateChange', () => {
    spyOn(store, 'dispatch');

    const mockGridState = generateMockDataStateChangeEvent();
    const updateGridAction = new fromGridActions.UpdateGrid(GridTypeEnum.JobDescriptionInbox, mockGridState);
    const loadInboxAction = new fromJobDescriptionInboxActions.LoadInbox();
    const getUnreadInboxCountAction = new fromJobDescriptionInboxActions.GetUnreadInboxCount();

    instance.onDataStateChange(mockGridState);

    expect(store.dispatch).toHaveBeenCalledWith(updateGridAction);
    expect(store.dispatch).toHaveBeenCalledWith(loadInboxAction);
    expect(store.dispatch).toHaveBeenCalledWith(getUnreadInboxCountAction);
  });

  it('should dispatch a SelectId action upon onIdSelected clicked ', () => {
    spyOn(store, 'dispatch');

    const expectedAction = new fromJobDescriptionInboxActions.SelectId(1);

    instance.onIdSelected(1);

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should dispatch a SelectAll action upon onSelectAllChange clicked ', () => {
    spyOn(store, 'dispatch');

    const expectedAction = new fromJobDescriptionInboxActions.SelectAll();

    instance.onSelectAllChange();

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should dispatch a UpdateJobDescriptionUnread action upon onEnvelopeSelected clicked and isRead is true', () => {
    spyOn(store, 'dispatch');

    const expectedAction = new fromJobDescriptionInboxActions.UpdateJobDescriptionUnread(1);

    instance.onEnvelopeSelected(true, 1);

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should dispatch a UpdateJobDescriptionRead action upon onEnvelopeSelected clicked and isRead is false', () => {
    spyOn(store, 'dispatch');

    const expectedAction = new fromJobDescriptionInboxActions.UpdateJobDescriptionRead(1);

    instance.onEnvelopeSelected(false, 1);

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });
});
