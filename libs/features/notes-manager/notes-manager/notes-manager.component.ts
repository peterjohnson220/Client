import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { Store } from '@ngrx/store';

import { Observable } from 'rxjs';

import { environment } from 'environments/environment';

import { AsyncStateObj } from 'libs/models';
import { Images } from 'libs/constants';
import { NotesBase, NotesManagerConfiguration } from 'libs/models/notes';
import { PfValidators } from 'libs/forms/validators';

import * as fromNotesManagerReducer from '../reducers';
import * as fromNotesManagerActions from '../actions';

@Component({
  selector: 'pf-notes-manager',
  templateUrl: './notes-manager.component.html',
  styleUrls: ['./notes-manager.component.scss']
})
export class NotesManagerComponent implements OnChanges {
  @Input() notesManagerConfiguration: NotesManagerConfiguration;
  @Output() cancelChanges = new EventEmitter();

  loading$: Observable<boolean>;
  notes$: Observable<AsyncStateObj<NotesBase[]>>;
  addingNote$: Observable<AsyncStateObj<boolean>>;

  avatarUrl = environment.avatarSource;
  defaultUserImage = Images.DEFAULT_USER;

  noteForm: FormGroup;
  get f() { return this.noteForm.controls; }

  constructor(private store: Store<fromNotesManagerReducer.State>, private formBuilder: FormBuilder) {
    this.loading$ = this.store.select(fromNotesManagerReducer.getLoading);
    this.notes$ = this.store.select(fromNotesManagerReducer.getNotes);
    this.addingNote$ = this.store.select(fromNotesManagerReducer.getAddingNote);

    this.noteForm = this.formBuilder.group({
      Notes: ['', PfValidators.required]
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['notesManagerConfiguration'] && changes['notesManagerConfiguration'].currentValue['EntityId']) {
      this.store.dispatch(new fromNotesManagerActions.GetNotes({
        Entity: changes['notesManagerConfiguration'].currentValue['Entity'],
        EntityId: changes['notesManagerConfiguration'].currentValue['EntityId']
      }));
    }
  }

  onCancelChanges() {
    this.noteForm.reset();
    this.store.dispatch(new fromNotesManagerActions.ResetState());
    this.cancelChanges.emit();
  }

  addNote() {
    if (this.noteForm.valid) {
      this.store.dispatch(new fromNotesManagerActions.AddNote({
        Entity: this.notesManagerConfiguration.Entity,
        EntityId: this.notesManagerConfiguration.EntityId,
        Notes: this.f.Notes.value
      }));
    }
  }

}
