import { Component, OnDestroy, OnInit, Input, ViewChild } from '@angular/core';

import { Store, select } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { AsyncStateObj } from 'libs/models';

import * as fromJobDescriptionManagement from '../../reducers';
import * as fromJobMatchesActions from '../../actions/job-matches.actions';
import { JobMatchResult } from 'libs/features/jobs/job-description-management/models';

@Component({
  selector: 'pf-job-matches-modal',
  templateUrl: './job-matches-modal.component.html',
  styleUrls: ['./job-matches-modal.component.scss']
})
export class JobMatchesModalComponent implements OnInit, OnDestroy {
  @Input() jobDescriptionId: number;
  @Input() jobTitle: string;

  jobMatchesAsync$: Observable<AsyncStateObj<JobMatchResult[]>>;
  jobMatchesForbidden$: Observable<boolean>;
  creatingProject$: Observable<boolean>;
  creatingProjectError$: Observable<boolean>;

  jobMatchesForbiddenSubscription: Subscription;
  creatingProjectSubscription: Subscription;
  creatingProjectErrorSubscription: Subscription;

  @ViewChild('jobMatchesModal', { static: true }) public jobMatchesModal: any;
  forbidden: boolean;
  creatingProject: boolean;
  creatingProjectError: boolean;

  constructor(
    private store: Store<fromJobDescriptionManagement.State>,
    private modalService: NgbModal
  ) {
    this.jobMatchesAsync$ = this.store.pipe(select(fromJobDescriptionManagement.getJobMatchesAsync));
    this.jobMatchesForbidden$ = this.store.pipe(select(fromJobDescriptionManagement.getJobMatchesForbidden));
    this.creatingProject$ = this.store.pipe(select(fromJobDescriptionManagement.getCreatingProject));
    this.creatingProjectError$ = this.store.pipe(select(fromJobDescriptionManagement.getCreatingProjectError));
  }

  ngOnInit(): void {
    this.jobMatchesForbiddenSubscription = this.jobMatchesForbidden$.subscribe(value => this.forbidden = value);
    this.creatingProjectSubscription = this.creatingProject$.subscribe(value => this.creatingProject = value);
    this.creatingProjectErrorSubscription = this.creatingProjectError$.subscribe(value => this.creatingProjectError = value);
  }

  ngOnDestroy(): void {
    this.jobMatchesForbiddenSubscription.unsubscribe();
    this.creatingProjectSubscription.unsubscribe();
    this.creatingProjectErrorSubscription.unsubscribe();
  }

  open(): void {
    this.modalService.open(this.jobMatchesModal, { backdrop: 'static', size: 'lg' });
  }

  close(): void {
    this.modalService.dismissAll();
  }

  trackByFn(index: number, jobMatchResult: JobMatchResult): number {
    return jobMatchResult.Id;
  }

  handleJobMatchClicked(selectedJob: JobMatchResult): void {
    this.store.dispatch(new fromJobMatchesActions.ToggleJobMatchSelected({ jobMatchResultId: selectedJob.Id }));
  }

  handleCreateProjectClicked() {
    this.store.dispatch(new fromJobMatchesActions.CreateProject( { jobDescriptionId: this.jobDescriptionId }));
  }
}
