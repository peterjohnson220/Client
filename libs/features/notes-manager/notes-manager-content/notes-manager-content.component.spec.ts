import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionsSubject, combineReducers, Store, StoreModule } from '@ngrx/store';
import * as fromReducer from '../reducers';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import * as fromRootState from '../../../state/state';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { PfValidators } from '../../../forms/validators';
import * as fromActions from '../actions';
import { ApiServiceType } from '../constants/api-service-type-constants';
import { NotesManagerContentComponent } from './notes-manager-content.component';

describe('NotesManagerContentComponent', () => {
  let component: NotesManagerContentComponent;
  let fixture: ComponentFixture<NotesManagerContentComponent>;
  let store: Store<fromReducer.State>;
  let formBuilder: FormBuilder;
  let actionSubject: ActionsSubject;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        StoreModule.forRoot({
          ...fromRootState.reducers,
          feature_notes_manager: combineReducers(fromReducer.reducers),
        })
      ],
      providers: [
      ],
      declarations: [
        NotesManagerContentComponent,
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    store = TestBed.inject(Store);
    formBuilder = TestBed.inject(FormBuilder);
    actionSubject = TestBed.inject(ActionsSubject);

    spyOn(store, 'dispatch'); // place a spy on the dispatch method

    // get instance from TestFixture
    fixture = TestBed.createComponent(NotesManagerContentComponent);
    component = fixture.componentInstance;
    component.noteForm = new FormBuilder().group({
      Notes: ['', [PfValidators.required, PfValidators.maxLengthTrimWhitespace(this.DEFAULT_MAX_LENGTH)]],
      EditNotes: ['', [PfValidators.required, PfValidators.maxLengthTrimWhitespace(this.DEFAULT_MAX_LENGTH)]]
    });
    component.textArea = {nativeElement: {value: 'TEST'}};
    component.notesManagerConfiguration = {
      EntityId: 999,
      ModalTitle: null,
      ShowModal$: null,
      IsEditable: null,
      PlaceholderText: null,
      NotesHeader: null,
      ApiServiceIndicator: null
    };
  });

  it ('Should dispatch GetNotes when a configuration changes and that config has EntityId', () => {
    const expectedAction = new fromActions.GetNotes(999);

    component.ngOnChanges(
      {notesManagerConfiguration: {
          previousValue: null,
          currentValue: {Entity: 'TEST', EntityId: 999, ApiServiceIndicator: null},
          firstChange: null,
          isFirstChange(): boolean {
            return true;
          }}});

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it ('Should dispatch LoadApiService when a configuration changes and that config has an ApiServiceIndicator', () => {
    const expectedAction = new fromActions.LoadApiService(0);

    component.ngOnChanges(
      {notesManagerConfiguration: {
          previousValue: null,
          currentValue: {Entity: 'TEST', EntityId: null, ApiServiceIndicator: ApiServiceType.CompanyJobs},
          firstChange: null,
          isFirstChange(): boolean {
            return true;
          }}});

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });
});
