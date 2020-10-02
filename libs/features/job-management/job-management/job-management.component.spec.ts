import { NO_ERRORS_SCHEMA, SimpleChange } from '@angular/core';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';

import { combineReducers, Store, StoreModule } from '@ngrx/store';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import * as fromRootState from 'libs/state/state';

import * as fromActions from '../actions';
import * as fromNotesManagerActions from '../../notes-manager/actions';
import * as fromReducer from '../reducers';

import { JobManagementComponent } from './job-management.component';
import { NotesManagerComponent } from '../../notes-manager/notes-manager/notes-manager.component';
import { JobContainerComponent } from '../containers';
import { NotesManagerContentComponent } from '../../notes-manager/notes-manager-content/notes-manager-content.component';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PfValidators } from '../../../forms/validators';

describe('Job Management Feature - Job Management', () => {
  let instance: JobManagementComponent;
  let jobContainer: JobContainerComponent;
  let notesManager: NotesManagerComponent;
  let notesManagerContent: NotesManagerContentComponent;
  let fixture: ComponentFixture<JobManagementComponent>;
  let store: Store<fromReducer.State>;
  let modal: NgbModal;
  let formBuilder: FormBuilder;

  const DEFAULT_MAX_LENGTH = 8000;

  beforeEach(() => {

    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        StoreModule.forRoot({
          ...fromRootState.reducers,
          feature_job_management: combineReducers(fromReducer.reducers),
        })
      ],
      providers: [ ],
      declarations: [
        JobManagementComponent,
        JobContainerComponent,
        NotesManagerComponent,
        NotesManagerContentComponent
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    store = TestBed.inject(Store);
    modal = TestBed.inject(NgbModal);
    formBuilder = TestBed.inject(FormBuilder);

    spyOn(store, 'dispatch');

    fixture = TestBed.createComponent(JobManagementComponent);
    instance = fixture.componentInstance;

    // create chain of components
    jobContainer = TestBed.createComponent(JobContainerComponent).componentInstance as JobContainerComponent;
    notesManager = TestBed.createComponent(NotesManagerComponent).componentInstance as NotesManagerComponent;
    notesManagerContent = TestBed.createComponent(NotesManagerContentComponent).componentInstance as NotesManagerContentComponent;

    notesManagerContent.noteForm = new FormBuilder().group({
      Notes: ['', [PfValidators.required, PfValidators.maxLengthTrimWhitespace(DEFAULT_MAX_LENGTH)]],
      EditNotes: ['', [PfValidators.required, PfValidators.maxLengthTrimWhitespace(DEFAULT_MAX_LENGTH)]]
    });
    notesManagerContent.editModeIndex = 0;

    instance.jobContainer = jobContainer;
    jobContainer.notesManager = notesManager;
    notesManager.notesManagerContent = notesManagerContent;

  });

  it('Should dispatch the LoadJobOptions action on init', () => {
    const expectedAction = new fromActions.LoadJobOptions();

    fixture.detectChanges();

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('Should reset the DuplicateJobCodeError and emit cancel changes on cancel', () => {
    spyOn(instance.cancelChanges, 'emit');

    const expectedAction = new fromActions.ResetState();
    const expectedNotesClearAction = new fromNotesManagerActions.ClearNotes();

    instance.onCancelChanges();
    fixture.detectChanges();

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
    expect(store.dispatch).toHaveBeenCalledWith(expectedNotesClearAction);
    expect(instance.cancelChanges.emit).toHaveBeenCalledWith();
  });
});
