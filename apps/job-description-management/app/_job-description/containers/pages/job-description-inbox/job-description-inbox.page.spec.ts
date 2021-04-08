import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { combineReducers, Store, StoreModule } from '@ngrx/store';

import * as fromRootState from 'libs/state/state';

import * as fromJobDescriptionReducers from '../../../reducers';
import * as fromJobDescriptionInboxActions from '../../../actions/job-description-inbox.actions';
import { JobDescriptionInboxPageComponent } from './job-description-inbox.page';

describe('Job Description Manager - Job Description Inbox Page', () => {
  let instance: JobDescriptionInboxPageComponent;
  let fixture: ComponentFixture<JobDescriptionInboxPageComponent>;
  let store: Store<fromJobDescriptionReducers.State>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          jobdescriptonmanagement_jobdescription: combineReducers(fromJobDescriptionReducers.reducers),
        })
      ],
      providers: [],
      declarations: [
        JobDescriptionInboxPageComponent
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    fixture = TestBed.createComponent(JobDescriptionInboxPageComponent);
    instance = fixture.componentInstance;
    store = TestBed.inject(Store);
  });

  it('should dispatch a LoadInbox action upon ngOnInit', () => {
    spyOn(store, 'dispatch');

    const expectedAction = new fromJobDescriptionInboxActions.LoadInbox();

    instance.ngOnInit();

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should dispatch a GetUnreadInboxCount action upon ngOnInit', () => {
    spyOn(store, 'dispatch');

    const expectedAction = new fromJobDescriptionInboxActions.GetUnreadInboxCount();

    instance.ngOnInit();

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should dispatch an UnselectAll action upon onClearSelections clicked ', () => {
    spyOn(store, 'dispatch');

    const expectedAction = new fromJobDescriptionInboxActions.UnselectAll();

    instance.onClearSelections();

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should dispatch an UpdateInboxReadBulk action upon onMarkRead clicked ', () => {
    spyOn(store, 'dispatch');

    const expectedAction = new fromJobDescriptionInboxActions.UpdateInboxReadBulk(true);

    instance.onMarkRead();

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should dispatch an UpdateInboxReadBulk action upon onMarkUnread clicked ', () => {
    spyOn(store, 'dispatch');

    const expectedAction = new fromJobDescriptionInboxActions.UpdateInboxReadBulk(false);

    instance.onMarkUnread();

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });
});
