import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { filter } from 'rxjs/operators';

import * as fromRootState from 'libs/state/state';
import { SurveyNote, getDefaultSurveyNote } from 'libs/models/payfactors-api/survey-library/survey-note-model';
import { UserContext, AsyncStateObj } from 'libs/models';

import * as fromSurveyNotesReducer from '../../reducers';
import * as fromSurveyNotesActions from '../../actions/survey-notes.actions';
import * as fromSurveyActions from '../../actions/survey-actions';

@Component({
  selector: 'pf-survey-notes-modal',
  templateUrl: './survey-notes-modal.component.html',
  styleUrls: ['./survey-notes-modal.component.scss']
})
export class SurveyNotesModalComponent implements OnInit, OnDestroy {
  @ViewChild('surveyNotesModal', { static: true }) surveyNotesModal: any;

  public userId: number;
  public avatarUrl: string;
  public noteInfo: any;
  public note: SurveyNote;
  public notes: SurveyNote[];
  public notes$: Observable<AsyncStateObj<SurveyNote[]>>;
  public noteForm: FormGroup;

  private modalRef: NgbModalRef;
  private identity$: Observable<UserContext>;
  private identitySubscription: Subscription;
  private notesSubsription: Subscription;

  get getNote() { return this.noteForm.controls['note']; }

  constructor(
    public rootStore: Store<fromRootState.State>,
    public store: Store<fromSurveyNotesReducer.State>,
    private modalService: NgbModal,
    private formBuilder: FormBuilder) {
    this.notes$ = this.store.select(fromSurveyNotesReducer.getSurveyNotes);
    this.identity$ = this.rootStore.select(fromRootState.getUserContext);
  }

  ngOnInit() {
    this.buildForm();

    this.identitySubscription = this.identity$.pipe(filter(v => !!v)).subscribe(i => {
      if (!!i) {
        this.avatarUrl = i.ConfigSettings.find(c => c.Name === 'CloudFiles_PublicBaseUrl').Value + '/avatars/';
        this.userId = i.UserId;
      }
    });

    this.notesSubsription = this.notes$.pipe(filter(n => !!n)).subscribe(notes => {
      if (notes.obj) {
        this.notes = notes.obj;
      }
      if (notes.savingSuccess) {
        this.close();
      }
    });
  }

  ngOnDestroy() {
    this.identitySubscription.unsubscribe();
    this.notesSubsription.unsubscribe();
  }

  open(dataItem: any) {
    this.store.dispatch(new fromSurveyNotesActions.LoadSurveyNotes({surveyId: dataItem.SurveyId}));
    this.noteInfo = dataItem;
    this.noteForm.reset();
    this.noteForm.setValue({ note: '' });
    this.modalRef = this.modalService.open(this.surveyNotesModal, { backdrop: 'static', size: 'lg' });
  }

  close() {
    this.modalService.dismissAll();
    this.store.dispatch( new fromSurveyNotesActions.ResetSurveyNotes());
    this.store.dispatch(new fromSurveyActions.GetSurveys(this.noteInfo.SurveyYearId, this.noteInfo.tbxSearch));
  }

  submit() {
    const surveyNote: SurveyNote = getDefaultSurveyNote();
    surveyNote.Note = this.getNote.value;
    surveyNote.CreateDate = new Date(Date.now());
    surveyNote.CreateUser = this.userId;
    surveyNote.SurveyId = this.noteInfo.SurveyId;
    this.store.dispatch(new fromSurveyNotesActions.SaveSurveyNote({note: surveyNote, actionType: 'Insert'}));
  }

  private buildForm() {
    this.noteForm = this.formBuilder.group({
      'note': ['', [Validators.required]]
    });
  }

}
