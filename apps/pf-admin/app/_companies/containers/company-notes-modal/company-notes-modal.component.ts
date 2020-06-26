import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';

import * as fromRootState from 'libs/state/state';
import { CompanyNote, getDefaultCompanyNote } from 'libs/models/payfactors-api';
import { UserContext, AsyncStateObj } from 'libs/models';

import * as fromCompanyNotesReducer from '../../reducers';
import * as fromCompanyNotesActions from '../../actions/company-notes.actions';
import * as fromCompaniesActions from '../../actions/companies.actions';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'pf-company-notes-modal',
  templateUrl: './company-notes-modal.component.html',
  styleUrls: ['./company-notes-modal.component.scss']
})
export class CompanyNotesModalComponent implements OnInit, OnDestroy {
  @ViewChild('companyNotesModal', { static: true }) companyNotesModal: any;

  private modalRef: NgbModalRef;
  private noteForm: FormGroup;
  public userId: number;

  public avatarUrl: string;
  public companyInfo: any;
  public note: CompanyNote;
  public notes: CompanyNote[];
  public notes$: Observable<AsyncStateObj<CompanyNote[]>>;
  private identity$: Observable<UserContext>;
  private identitySubscription: Subscription;
  private notesSubsription: Subscription;

  get getNote() { return this.noteForm.controls['note']; }

  constructor(
    private modalService: NgbModal,
    private rootStore: Store<fromRootState.State>,
    public store: Store<fromCompanyNotesReducer.State>,
    private formBuilder: FormBuilder) {
    this.notes$ = this.store.select(fromCompanyNotesReducer.getCompanyNotes);
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
    this.store.dispatch(new fromCompanyNotesActions.LoadCompanyNotes({companyId: dataItem.CompanyId}));
    this.companyInfo = dataItem;
    this.noteForm.reset();
    this.noteForm.setValue({ note: '' });
    this.modalRef = this.modalService.open(this.companyNotesModal, { backdrop: 'static', size: 'lg' });
  }

  close() {
    this.modalService.dismissAll();
    this.store.dispatch( new fromCompanyNotesActions.ResetCompanyNotes());
    this.store.dispatch( new fromCompaniesActions.LoadCompanies());
  }

  submit() {
    const companyNote: CompanyNote = getDefaultCompanyNote();
    companyNote.Note = this.getNote.value;
    companyNote.CreateDate = new Date(Date.now());
    companyNote.CreateUser = this.userId;
    companyNote.CompanyId = this.companyInfo.CompanyId;
    this.store.dispatch(new fromCompanyNotesActions.SaveCompanyNote({note: companyNote, actionType: 'Insert'}));
  }

  private buildForm() {
    this.noteForm = this.formBuilder.group({
      'note': ['', [Validators.required]]
    });
  }

}
