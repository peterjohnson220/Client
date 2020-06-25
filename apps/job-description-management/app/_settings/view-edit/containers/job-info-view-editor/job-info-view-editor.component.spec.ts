import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { BehaviorSubject } from 'rxjs';

import { generateDefaultAsyncStateObj } from 'libs/models/state';

import * as fromJobInfoViewEditorActions from '../../actions/job-info-view-editor.actions';
import { generateMockJobInfoViewField, JobInfoViewField } from '../../models';
import { JobInfoViewEditorComponent } from './job-info-view-editor.component';

describe('Job Description Management - Settings - Job Info View Editor', () => {
  let instance: JobInfoViewEditorComponent;
  let fixture: ComponentFixture<JobInfoViewEditorComponent>;
  let store: Store<any>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ JobInfoViewEditorComponent ],
      providers: [
        provideMockStore({})
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    fixture = TestBed.createComponent(JobInfoViewEditorComponent);
    instance = fixture.componentInstance;

    store = TestBed.inject(Store);
  });

  it('should stop propagation on the mouse event, when handling a select all click', () => {
    const mouseEvent = new MouseEvent('click');
    spyOn(mouseEvent, 'stopPropagation');

    instance.handleSelectAllClicked(mouseEvent);

    expect(mouseEvent.stopPropagation).toHaveBeenCalled();
  });

  it('should dispatch an action to the set the status of all fields, when handling a select all click', () => {
    spyOn(store, 'dispatch');
    const mouseEvent = new MouseEvent('click');
    const expectedAction = new fromJobInfoViewEditorActions.SetAllJobInfoViewFields({ checked: true });

    instance.handleSelectAllClicked(mouseEvent);

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should do nothing if the job info field is locked, when handling a job info view field clicked', () => {
    spyOn(store, 'dispatch');
    const mockJobInfoViewField = {...generateMockJobInfoViewField(), Locked: true };

    instance.handleJobInfoViewFieldClicked(mockJobInfoViewField);

    expect(store.dispatch).not.toHaveBeenCalled();
  });

  it('should dispatch an action to toggle the job info view field, when handling a job info view field clicked', () => {
    spyOn(store, 'dispatch');
    const mockJobInfoViewField = generateMockJobInfoViewField();
    const expectedAction = new fromJobInfoViewEditorActions.ToggleJobInfoViewField(mockJobInfoViewField);

    instance.handleJobInfoViewFieldClicked(mockJobInfoViewField);

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should dispatch an action to toggle the job info view field, when handling a job info view field clicked', () => {
    spyOn(store, 'dispatch');
    const mockJobInfoViewField = generateMockJobInfoViewField();
    const expectedAction = new fromJobInfoViewEditorActions.ToggleJobInfoViewField(mockJobInfoViewField);

    instance.handleJobInfoViewFieldClicked(mockJobInfoViewField);

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should not set the job info fields when the async object has not been loaded', () => {
    instance.jobInfoFieldsAsyncObj$ = new BehaviorSubject(generateDefaultAsyncStateObj<JobInfoViewField[]>([]));

    // Init
    fixture.detectChanges();

    expect(instance.jobInfoFieldsAsyncObj).toBeUndefined();
  });

  it('should set the job info fields when the async object has been loaded', () => {
    const asyncObj = generateDefaultAsyncStateObj<JobInfoViewField[]>([]);
    const asyncObjWithValue = {...asyncObj, obj: [generateMockJobInfoViewField()]};
    const subj = new BehaviorSubject(asyncObj);

    instance.jobInfoFieldsAsyncObj$ = subj;

    // Init
    fixture.detectChanges();

    subj.next(asyncObjWithValue);

    expect(instance.jobInfoFieldsAsyncObj).toBe(asyncObjWithValue);
  });

  it('should set select all, if all the job info fields have been checked', () => {
    const asyncObj = generateDefaultAsyncStateObj<JobInfoViewField[]>([]);
    const asyncObjWithValue = {...asyncObj, obj: [{...generateMockJobInfoViewField(), Checked: true }]};
    const subj = new BehaviorSubject(asyncObj);

    instance.jobInfoFieldsAsyncObj$ = subj;

    // Init
    fixture.detectChanges();

    subj.next(asyncObjWithValue);

    expect(instance.selectAll).toBe(true);
  });

  it('should dispatch an action to reset, upon destroy', () => {
    spyOn(store, 'dispatch');
    const expectedAction = new fromJobInfoViewEditorActions.Reset();

    // Init
    fixture.detectChanges();

    instance.ngOnDestroy();

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });
});
