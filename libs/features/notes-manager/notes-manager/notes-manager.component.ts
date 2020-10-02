import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { AsyncStateObj, NoteRequest } from 'libs/models';
import { NotesManagerConfiguration } from 'libs/models/notes';

import * as fromNotesManagerReducer from '../reducers';
import * as fromNotesManagerActions from '../actions';
import { NotesManagerContentComponent } from '../notes-manager-content/notes-manager-content.component';

@Component({
  selector: 'pf-notes-manager',
  templateUrl: './notes-manager.component.html',
  styleUrls: ['./notes-manager.component.scss']
})
export class NotesManagerComponent implements OnInit {
  @Input() notesManagerConfiguration: NotesManagerConfiguration;
  @Input() display: 'component' | 'modal' = 'modal';
  @Output() cancelChanges = new EventEmitter();

  @ViewChild(NotesManagerContentComponent) notesManagerContent: NotesManagerContentComponent;

  loading$: Observable<boolean>;
  savingNotes$: Observable<AsyncStateObj<boolean>>;

  noteRequestList: NoteRequest[] = [];

  constructor(private store: Store<fromNotesManagerReducer.State>) {}

  ngOnInit() {
    this.loading$ = this.store.select(fromNotesManagerReducer.getLoading);
    this.savingNotes$ = this.store.select(fromNotesManagerReducer.getSavingNotes);
  }

  onCancelChanges() {
    this.notesManagerContent.resetForm();
    this.store.dispatch(new fromNotesManagerActions.ClearNotes());
    this.cancelChanges.emit();
  }

  saveNotes() {
    this.store.dispatch(new fromNotesManagerActions.SaveNotes(this.notesManagerConfiguration.EntityId));
    this.store.dispatch(new fromNotesManagerActions.ClearNotes());
  }
}
