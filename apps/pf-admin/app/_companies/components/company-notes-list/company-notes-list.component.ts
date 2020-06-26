import { Component, Input, AfterViewChecked, ChangeDetectorRef } from '@angular/core';

import * as cloneDeep from 'lodash.clonedeep';
import { Store } from '@ngrx/store';

import { CompanyNote } from 'libs/models/payfactors-api';

import * as fromCompanyNotesReducer from '../../reducers';
import * as fromCompanyNotesActions from '../../actions/company-notes.actions';

@Component({
  selector: 'pf-company-notes-list',
  templateUrl: './company-notes-list.component.html',
  styleUrls: ['./company-notes-list.component.scss']
})
export class CompanyNotesListComponent implements AfterViewChecked {

  @Input() notes: CompanyNote[];
  @Input() avatarUrl: string;
  @Input() userId: number;

  public updatedNote: string;
  public isEditMode = false;
  public selectedNodeId = 0;

  constructor(private cdRef: ChangeDetectorRef,
    public store: Store<fromCompanyNotesReducer.State>) { }

  delete(note: CompanyNote) {
    this.store.dispatch(new fromCompanyNotesActions.SaveCompanyNote({note: cloneDeep(note), actionType: 'Delete'}));
  }

  update(note: CompanyNote) {
    if (!!this.updatedNote) {
      this.store.dispatch(new fromCompanyNotesActions.SaveCompanyNote({note: this.getUpdatedNote(note), actionType: 'Update'}));
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

  getUpdatedNote(note: CompanyNote): CompanyNote {
    const companyNote: CompanyNote = cloneDeep(note);
    companyNote.Note =  this.updatedNote;
    companyNote.CreateDate = new Date();
    return companyNote;
  }

  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }
}
