import { Component, OnInit, OnDestroy, ViewChild, Input } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { AsyncStateObj, JobDescription } from 'libs/models';

import { FlsaExemptionAndQuestions, FlsaQuestionnaireDetails } from '../../../models';
import * as fromFlsaQuestionnaireActions from '../../../actions/flsa-questionnaire-modal.actions';
import * as fromJobDescriptionReducers from '../../../reducers';

@Component({
  selector: 'pf-flsa-questionnaire-modal',
  templateUrl: './flsa-questionnaire-modal.component.html',
  styleUrls: ['./flsa-questionnaire-modal.component.scss']
})

export class FlsaQuestionnaireModalComponent implements OnInit, OnDestroy {
  @Input() lockedJobDescription: boolean;
  @ViewChild('flsaQuestionnaireModal', { static: true }) public flsaQuestionnaireModal: any;

  flsaQuestionnaireDetails$: Observable<AsyncStateObj<FlsaQuestionnaireDetails>>;
  jobDescriptionAsync$: Observable<AsyncStateObj<JobDescription>>;
  flsaQuestionnaireSubscription: Subscription;
  jobDescriptionSubscription: Subscription;

  flsaQuestionnaireDetails: FlsaQuestionnaireDetails;
  flsaExemptionAndQuestions: FlsaExemptionAndQuestions;
  jobDescription: JobDescription;
  modalRef: NgbModalRef;

  constructor(
    private store: Store<fromJobDescriptionReducers.State>,
    private modalService: NgbModal
  ) {
    this.flsaQuestionnaireDetails$ = this.store.select(fromJobDescriptionReducers.getFlsaQuestionnaireAsync);
    this.jobDescriptionAsync$ = this.store.select(fromJobDescriptionReducers.getJobDescriptionAsync);
  }

  ngOnInit(): void {
    this.flsaQuestionnaireSubscription = this.flsaQuestionnaireDetails$.subscribe(q => {
      if (!this.isObjectEmpty(q.obj)) {
        this.flsaQuestionnaireDetails = q.obj;
        if (q.obj.ExemptionAndQuestions) {
          this.flsaExemptionAndQuestions = this.flsaExemptionAndQuestions ?
            q.obj.ExemptionAndQuestions.find(e => e.Exemption === this.flsaExemptionAndQuestions.Exemption)
            : q.obj.ExemptionAndQuestions[0];
        }
      }
    });
    this.jobDescriptionSubscription = this.jobDescriptionAsync$.subscribe(jd => {
      this.jobDescription = jd.obj;
    });
  }

  open() {
    this.modalRef = this.modalService.open(this.flsaQuestionnaireModal, { backdrop: 'static', size: 'lg' });
    this.loadFlsaQuestionnaire();
  }

  ngOnDestroy() {
    this.flsaQuestionnaireSubscription.unsubscribe();
    this.jobDescriptionSubscription.unsubscribe();
  }

  getQuestions(exemptionAndQuestions: FlsaExemptionAndQuestions) {
    this.flsaExemptionAndQuestions = exemptionAndQuestions;
  }

  saveFlsaQuestionnaire() {
    this.store.dispatch(new fromFlsaQuestionnaireActions.SaveFlsaQuestionnaire());
    this.modalRef.close();
  }

  selectQuestion(exemption: string, question: string, selected: boolean) {
    this.store.dispatch(new fromFlsaQuestionnaireActions.SelectFlsaQuestion({exemption, question, selected}));
  }

  isObjectEmpty(obj) {
    return obj == null || Object.keys(obj).length === 0;
  }

  private loadFlsaQuestionnaire() {
    const isHistorical = (this.jobDescription.JobDescriptionStatus === 'Historical');
    this.store.dispatch(new fromFlsaQuestionnaireActions.LoadFlsaQuestionnaire({
      jobDescriptionId: this.jobDescription.JobDescriptionId,
      isHistorical: isHistorical,
      version: this.jobDescription.JobDescriptionRevision
    }));
  }
}
