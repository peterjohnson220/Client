import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { ActionsSubject, Store } from '@ngrx/store';
import { ofType } from '@ngrx/effects';
import { Observable, Subscription } from 'rxjs';

import { NotesBase, NotesManagerConfiguration } from '../../../models/notes';
import { PfValidators } from '../../../forms/validators';
import { AsyncStateObj } from '../../../models/state';
import { NoteOperation } from '../constants/note-operation-constants';
import { environment } from '../../../../environments/environment';
import { Images } from '../../../constants';
import { isNullOrUndefined } from '../../../core/functions';
import * as fromNotesManagerReducer from '../reducers';
import * as fromRootReducer from '../../../state/state';
import * as fromNotesManagerActions from '../actions';
import { UserContext } from '../../../models/security';

@Component({
  selector: 'pf-notes-manager-content',
  templateUrl: './notes-manager-content.component.html',
  styleUrls: ['./notes-manager-content.component.scss']
})
export class NotesManagerContentComponent implements OnInit, OnChanges, OnDestroy {
  @Input() notesManagerConfiguration: NotesManagerConfiguration;

  notes$: Observable<AsyncStateObj<NotesBase[]>>;
  currentUserId$: Observable<number>;

  addNoteSubscription: Subscription;
  userContextSubscription: Subscription;

  @ViewChild('noteTextArea') textArea;
  @ViewChild('revisedNote') revisedNoteTextArea;

  noteForm: FormGroup;
  get f() { return this.noteForm.controls; }
  readonly DEFAULT_MAX_LENGTH = 8000;

  deleteNoteOperation: NoteOperation = NoteOperation.Delete;

  avatarUrl = environment.avatarSource;
  defaultUserImage = Images.DEFAULT_USER;
  editModeIndex = -1;

  userContext: UserContext;

  constructor(private store: Store<fromNotesManagerReducer.State>,
              private formBuilder: FormBuilder,
              private actionsSubject: ActionsSubject) { }

  ngOnInit(): void {
    this.notes$ = this.store.select(fromNotesManagerReducer.getNotes);

    this.userContextSubscription = this.store.select(fromRootReducer.getUserContext).subscribe(userContext => {
      this.userContext = userContext;
      this.store.dispatch(new fromNotesManagerActions.LoadUserId(userContext.UserId));
      this.currentUserId$ = this.store.select(fromNotesManagerReducer.getUserId);
    });

    this.addNoteSubscription = this.actionsSubject
      .pipe(ofType(fromNotesManagerActions.ADD_NOTE))
      .subscribe(() => {
        this.textArea.nativeElement.value = '';
        this.textArea.nativeElement.focus();
      });

    this.noteForm = this.formBuilder.group({
      Notes: ['', [PfValidators.required, PfValidators.maxLengthTrimWhitespace(this.DEFAULT_MAX_LENGTH)]],
      EditNotes: ['', [PfValidators.required, PfValidators.maxLengthTrimWhitespace(this.DEFAULT_MAX_LENGTH)]]
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!isNullOrUndefined(changes.notesManagerConfiguration?.currentValue?.ApiServiceIndicator)) {
      this.store.dispatch(new fromNotesManagerActions.LoadApiService(changes.notesManagerConfiguration.currentValue.ApiServiceIndicator));
    }

    if (!isNullOrUndefined(changes.notesManagerConfiguration?.currentValue?.EntityId)) {
      this.resetForm();
      this.store.dispatch(new fromNotesManagerActions.GetNotes(changes.notesManagerConfiguration.currentValue.EntityId));
    }
  }

  addNote() {
    this.store.dispatch(new fromNotesManagerActions.AddNote({ noteText: this.f.Notes.value, userFirstName: this.userContext.FirstName,
                                                                      userLastName: this.userContext.LastName, userPhoto: this.userContext.UserPicture }));
    this.resetForm();
  }

  deleteNote(note: NotesBase) {
    this.store.dispatch(new fromNotesManagerActions.DeleteNote(note));
  }

  editNote(oldNote, noteIndex) {
    this.noteForm.patchValue({
      EditNotes: oldNote.Notes
    });
    this.editModeIndex = noteIndex;
  }

  confirmEdit(oldNote) {
    if (isNullOrUndefined(this.f.EditNotes.errors)) {
      this.editModeIndex = -1;
      this.saveEdit(oldNote);
    } else {
      this.revisedNoteTextArea.nativeElement.focus();
    }
  }

  saveEdit(oldNote) {
    this.store.dispatch(new fromNotesManagerActions.EditNote({ OldObj: oldNote, ReplacementStr: this.noteForm.value.EditNotes }));
  }

  resetForm() {
    this.noteForm.reset();
    this.editModeIndex = -1;
  }

  ngOnDestroy() {
    this.addNoteSubscription.unsubscribe();
    this.userContextSubscription.unsubscribe();
  }

}
