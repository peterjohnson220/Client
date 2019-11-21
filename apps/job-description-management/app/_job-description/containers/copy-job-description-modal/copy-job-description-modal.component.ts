import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Store, select } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import { AsyncStateObj, JobDescription, UserContext, WorkflowStepInfo } from 'libs/models';
import * as fromRootState from 'libs/state/state';


import * as fromJobDescriptionManagementReducer from '../../reducers';
import * as fromJobDescriptionSharedReducer from '../../../shared/reducers';
import * as fromJobFamilyActions from '../../../shared/actions/job-family.actions';
import * as fromCopyJobDescriptionModalActions from '../../actions/copy-job-description-modal.actions';
import { JobDescriptionExtendedInfo, JobDescriptionSource } from '../../models';

@Component({
  selector: 'pf-copy-job-description-modal',
  templateUrl: './copy-job-description-modal.component.html',
  styleUrls: ['./copy-job-description-modal.component.scss']
})
export class CopyJobDescriptionModalComponent implements OnInit, OnDestroy {
  @ViewChild('copyJobDescriptionModal', { static: true }) public copyJobDescriptionModal: any;

  jobDescriptionAsync$: Observable<AsyncStateObj<JobDescription>>;
  extendedInfo$: Observable<JobDescriptionExtendedInfo>;
  jobDescriptionSourcesAsync$: Observable<AsyncStateObj<JobDescriptionSource[]>>;
  jobFamilies$: Observable<string[]>;
  identity$: Observable<UserContext>;

  jobDescriptionAsyncSubscription: Subscription;
  extendedInfoSubscription: Subscription;
  jobDescriptionSourcesAsyncSubscription: Subscription;
  identitySubscription: Subscription;

  jobDescription: JobDescription;
  selectedFamily: string;
  extendedInfo: JobDescriptionExtendedInfo;
  selectedJobDescription: JobDescriptionSource;
  searchTerm: string;
  selectedStatus: string;
  allJobDescriptionSources: JobDescriptionSource[];
  filteredJobDescriptionSources: JobDescriptionSource[];
  workflowStepInfo: WorkflowStepInfo;

  constructor(
    private modalService: NgbModal,
    private store: Store<fromJobDescriptionManagementReducer.State>,
    private sharedStore: Store<fromJobDescriptionSharedReducer.State>,
    private userContextStore: Store<fromRootState.State>,
  ) {
    this.jobDescriptionAsync$ = this.store.pipe(select(fromJobDescriptionManagementReducer.getJobDescriptionAsync));
    this.extendedInfo$ = this.store.pipe(select(fromJobDescriptionManagementReducer.getJobDescriptionExtendedInfo));
    this.jobDescriptionSourcesAsync$ = this.store.pipe(select(fromJobDescriptionManagementReducer.getJobDescriptionSourcesAsync));
    this.jobFamilies$ = this.sharedStore.pipe(select(fromJobDescriptionSharedReducer.getJobFamilies));
    this.identity$ = this.userContextStore.select(fromRootState.getUserContext);

  }

  ngOnInit(): void {
    this.jobDescriptionAsyncSubscription = this.jobDescriptionAsync$.subscribe(asyncObj => this.jobDescription = asyncObj.obj);
    this.extendedInfoSubscription = this.extendedInfo$.subscribe(info => {
      if (!!info) {
        this.extendedInfo = info;
        this.initModal();
      }
    });
    this.identitySubscription = this.identity$.subscribe(uc => this.workflowStepInfo = uc.WorkflowStepInfo);
    this.jobDescriptionSourcesAsyncSubscription = this.jobDescriptionSourcesAsync$.subscribe(asyncObj => {
      if (!!asyncObj) {
        this.allJobDescriptionSources = asyncObj.obj;
        this.filteredJobDescriptionSources = asyncObj.obj;
      }
    });
    this.sharedStore.dispatch(new fromJobFamilyActions.LoadJobFamilies());
  }

  ngOnDestroy(): void {
    this.jobDescriptionAsyncSubscription.unsubscribe();
    this.extendedInfoSubscription.unsubscribe();
    this.identitySubscription.unsubscribe();
  }

  open(): void {
    this.selectedJobDescription = null;
    this.selectedStatus = null;
    this.searchTerm = '';
    this.initModal();
    this.modalService.open(this.copyJobDescriptionModal, { backdrop: 'static', size: 'lg' });
  }

  close(): void {
    this.modalService.dismissAll();
  }

  handleSelectedJobFamilyChange(jobFamily: string): void {
    this.loadJobDescriptionSources(jobFamily);
  }

  handleSearchTermChanged(searchTerm: string): void {
    this.filteredJobDescriptionSources = this.allJobDescriptionSources.filter(j =>
      j.JobCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      j.JobTitle.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  selectJobDescription(jobDescriptionSource: JobDescriptionSource): void {
    this.selectedJobDescription = jobDescriptionSource;
    if (this.selectedJobDescription.Status === 'Published' ||
      ( this.selectedJobDescription.Status === 'Draft' && this.selectedJobDescription.Version === 1) ) {
      this.selectedStatus = this.selectedJobDescription.Status;
    } else {
      this.selectedStatus = null;
    }
  }

  replaceJobDescription(): void {
    this.store.dispatch(new fromCopyJobDescriptionModalActions.ReplaceJobDescription({
      jobDescriptionId: this.jobDescription.JobDescriptionId,
      jobDescriptionIdToCopyFrom: this.selectedJobDescription.DescriptionId,
      jobDescriptionStatus: this.selectedStatus
    }));
    this.close();
  }

  private initModal(): void {
    if (!!this.extendedInfo && !this.workflowStepInfo) {
      this.selectedFamily = this.extendedInfo.JobFamily;
      this.loadJobDescriptionSources(this.extendedInfo.JobFamily);
    }
  }

  private loadJobDescriptionSources(jobFamily: string): void {
    this.store.dispatch(new fromCopyJobDescriptionModalActions.GetJobDescriptionSources({
      jobDescriptionId: this.jobDescription.JobDescriptionId,
      templateId: this.extendedInfo.TemplateId,
      jobFamily
    }));
  }
}
