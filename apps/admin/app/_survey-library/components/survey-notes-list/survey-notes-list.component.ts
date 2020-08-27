import { Component, Input, AfterViewChecked, ChangeDetectorRef } from '@angular/core';

import cloneDeep from 'lodash/cloneDeep';
import { Store } from '@ngrx/store';

import { SurveyNote } from 'libs/models/payfactors-api/survey-library/survey-note-model';

import * as fromSurveyNotesReducer from '../../reducers';
import * as fromSurveyNotesActions from '../../actions/survey-notes.actions';

@Component({
  selector: 'pf-survey-notes-list',
  templateUrl: './survey-notes-list.component.html',
  styleUrls: ['./survey-notes-list.component.scss']
})
export class SurveyNotesListComponent implements AfterViewChecked {

  @Input() notes: SurveyNote[];
  @Input() avatarUrl: string;
  @Input() userId: number;

  public updatedNote: string;
  public isEditMode = false;
  public selectedNodeId = 0;

  constructor(private cdRef: ChangeDetectorRef,
    public store: Store<fromSurveyNotesReducer.State>) { }

  delete(note: SurveyNote) {
    this.store.dispatch(new fromSurveyNotesActions.SaveSurveyNote({note: cloneDeep(note), actionType: 'Delete'}));
  }

  update(note: SurveyNote) {
    if (!!this.updatedNote) {
      this.store.dispatch(new fromSurveyNotesActions.SaveSurveyNote({note: this.getUpdatedNote(note), actionType: 'Update'}));
    }
    this.toggleEditMode();
  }

  toggleEditMode(event$?: any) {
    this.selectedNodeId = event$ ? event$.Id : 0;
    this.isEditMode = event$ ? true : false;
  }

  updateText(event: any, note: any) {
    this.selectedNodeId = note.Id;
    this.updatedNote = event.target.value;
  }

  getUpdatedNote(note: SurveyNote): SurveyNote {
    const surveyNote: SurveyNote = cloneDeep(note);
    surveyNote.Note =  this.updatedNote;
    surveyNote.CreateDate = new Date();
    return surveyNote;
  }

  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }
}
