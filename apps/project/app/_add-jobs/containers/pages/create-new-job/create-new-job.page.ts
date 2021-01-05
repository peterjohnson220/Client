import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup } from '@angular/forms';

import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import * as fromSearchPageActions from 'libs/features/search/search/actions/search-page.actions';
import { PfValidators } from 'libs/forms/validators';
import * as fromPaymarketReducer from 'libs/features/jobs/add-jobs/reducers';

import * as fromCreateNewJobPageActions from '../../../actions/create-new-job-page.actions';
import * as fromAddJobsReducer from '../../../reducers';

@Component({
  selector: 'pf-create-new-job-page',
  templateUrl: './create-new-job.page.html',
  styleUrls: ['./create-new-job.page.scss']
})
export class CreateNewJobPageComponent implements OnInit, OnDestroy {
  // Observables
  jdmEnabled$: Observable<boolean>;
  jobFamiliesLoading$: Observable<boolean>;
  jobFamilies$: Observable<string[]>;
  selectedPaymarketIds$: Observable<number[]>;
  creatingJob$: Observable<boolean>;
  jobCodeExists$: Observable<boolean>;
  creatingJobError$: Observable<boolean>;

  // Subscriptions
  selectedPayMarketIdsSub: Subscription;
  creatingJobSub: Subscription;
  jobCodeExistsSub: Subscription;
  jdmEnabledSub: Subscription;

  createNewJobForm: FormGroup;
  selectedPayMarketIds: number[];
  creatingJob: boolean;
  jobCodeExists: boolean;
  jdmEnabled: boolean;

  constructor(
    private store: Store<fromAddJobsReducer.State>,
    private location: Location,
    private fb: FormBuilder
  ) {
    this.jdmEnabled$ = this.store.select(fromAddJobsReducer.getJdmEnabled);
    this.jobFamilies$ = this.store.select(fromAddJobsReducer.getJobFamilies);
    this.jobFamiliesLoading$ = this.store.select(fromAddJobsReducer.getLoadingJobFamilies);
    this.selectedPaymarketIds$ = this.store.select(fromPaymarketReducer.getSelectedPaymarkets);
    this.creatingJob$ = this.store.select(fromAddJobsReducer.getCreatingJob);
    this.jobCodeExists$ = this.store.select(fromAddJobsReducer.getJobCodeExists);
    this.creatingJobError$ = this.store.select(fromAddJobsReducer.getCreatingJobError);
    this.createForm();
  }

  // Listen for messages to the window
  @HostListener('window:message', ['$event'])
  onMessage(event: MessageEvent) {
    if (!event.data || !event.data.payfactorsMessage) {
      return;
    }

    switch (event.data.payfactorsMessage.type) {
      case 'App Closed':
        this.location.back();
        break;
    }
  }


  get createDisabled(): boolean {
    return !this.createNewJobForm.valid ||
           this.selectedPayMarketIds.length === 0 ||
           this.creatingJob ||
           this.jobCodeExists;
  }

  ngOnInit(): void {
    this.store.dispatch(new fromCreateNewJobPageActions.Reset());
    this.store.dispatch(new fromCreateNewJobPageActions.GetJdmStatus());
    this.store.dispatch(new fromCreateNewJobPageActions.GetJobFamilies());

    this.selectedPayMarketIdsSub = this.selectedPaymarketIds$.subscribe(spids => this.selectedPayMarketIds = spids);
    this.creatingJobSub = this.creatingJob$.subscribe(cj => this.creatingJob = cj);
    this.jobCodeExistsSub = this.jobCodeExists$.subscribe(jce => this.jobCodeExists = jce);
    this.jdmEnabledSub = this.jdmEnabled$.subscribe(jdme => {
      this.jdmEnabled = jdme;
      if (this.jdmEnabled) {
        this.createNewJobForm.controls[ 'jobDescription' ].disable();
      }
    });
  }

  ngOnDestroy() {
    this.selectedPayMarketIdsSub.unsubscribe();
    this.creatingJobSub.unsubscribe();
    this.jobCodeExistsSub.unsubscribe();
  }

  handleJobCodeChanged() {
    if (this.jobCodeExists) {
      this.store.dispatch(new fromCreateNewJobPageActions.ClearJobCodeExistsError());
    }
  }

  handleCreateClicked() {
    this.store.dispatch(new fromCreateNewJobPageActions.CreateJob(this.createNewJobForm.getRawValue()));
  }

  handleBackToSearchClicked() {
    this.location.back();
  }

  handleCancelClicked() {
    this.store.dispatch(new fromSearchPageActions.CloseSearchPage());
  }

  private createForm(): void {
    this.createNewJobForm = this.fb.group({
      'jobCode': [''],
      'jobTitle': ['', [PfValidators.required]],
      'jobLevel': [''],
      'jobFamily': [''],
      'jobDescription': ['']
    });
  }
}
