import { Component, Input, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { ActionsSubject, Store } from '@ngrx/store';
import { ofType } from '@ngrx/effects';
import { Observable, Subscription } from 'rxjs';

import { environment } from 'environments/environment';
import { AsyncStateObj, NotesBase, UserContext } from 'libs/models';
import { Images } from 'libs/constants';
import { PfValidators } from 'libs/forms';
import { isNullOrUndefined } from 'libs/core/functions';
import * as fromRootReducer from 'libs/state/state';

import * as fromNotesManagerReducer from '../../reducers';
import * as fromNotesManagerActions from '../../actions';

import { NoteOperation } from '../../constants/note-operation-constants';

@Component({
  selector: 'pf-notes-manager-content',
  templateUrl: './notes-manager-content.component.html',
  styleUrls: ['./notes-manager-content.component.scss']
})
export class NotesManagerContentComponent implements OnInit, OnDestroy {
  @Input() isEditable: boolean;
  @Input() placeholderText: string;
  @Input() notesHeader: TemplateRef<any>;

  notes$: Observable<AsyncStateObj<NotesBase[]>>;

  addNoteSubscription: Subscription;
  userContextSubscription: Subscription;

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
    });

    this.addNoteSubscription = this.actionsSubject
      .pipe(ofType(fromNotesManagerActions.ADD_NOTE))
      .subscribe(() => {
        this.noteForm.patchValue({Notes: ''});
      });

    this.noteForm = this.formBuilder.group({
      Notes: ['', [PfValidators.required, PfValidators.maxLengthTrimWhitespace(this.DEFAULT_MAX_LENGTH)]],
      EditNotes: ['', [PfValidators.required, PfValidators.maxLengthTrimWhitespace(this.DEFAULT_MAX_LENGTH)]]
    });
  }

  ngOnDestroy() {
    this.addNoteSubscription.unsubscribe();
    this.userContextSubscription.unsubscribe();
  }

  addNote() {
    this.store.dispatch(new fromNotesManagerActions.AddNote(this.f.Notes.value, this.userContext));
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
      this.store.dispatch(new fromNotesManagerActions.EditNote(oldNote, this.noteForm.value.EditNotes));
    } else {
      this.revisedNoteTextArea.nativeElement.focus();
    }
  }

  resetForm() {
    this.noteForm.reset();
    this.editModeIndex = -1;
  }

  trackByFn(index) {
    return index;
  }
}
