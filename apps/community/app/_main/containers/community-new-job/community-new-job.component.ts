import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import * as fromCommunityJobReducer from '../../reducers';
import * as fromCommunityJobActions from '../../actions/community-job.actions';

import { CommunityJob } from 'libs/models/community/community-job.model';

@Component({
  selector: 'pf-community-new-job',
  templateUrl: './community-new-job.component.html',
  styleUrls: ['./community-new-job.component.scss']
})
export class CommunityNewJobComponent implements OnInit, OnDestroy {

  submittingCommunityJobSuccess$: Observable<CommunityJob>;
  submittingCommunityJobSuccessSubscription: Subscription;

  communityJobForm: FormGroup;
  textMaxLength = 100;
  jobSubmitted: CommunityJob;

  get positionTitle() { return this.communityJobForm.get('positionTitle'); }
  get location() { return this.communityJobForm.get('location'); }
  get postingUrl() { return this.communityJobForm.get('postingUrl'); }

  get isFormValid() { return this.communityJobForm.valid; }
  get isJobSmbitted() { return this.jobSubmitted; }

  constructor(public store: Store<fromCommunityJobReducer.State>,
    private formBuilder: FormBuilder) {
      this.submittingCommunityJobSuccess$ = this.store.select(fromCommunityJobReducer.getSubmittingCommunityJobsSuccess);
      this.buildForm();
  }

  ngOnInit() {
    this.submittingCommunityJobSuccessSubscription = this.submittingCommunityJobSuccess$.subscribe((response) => {
      this.jobSubmitted = response;
      if (response) {
          this.communityJobForm.reset({ value: 'formState'});
      }
    });
  }

  ngOnDestroy() {
    if (this.submittingCommunityJobSuccessSubscription) {
      this.submittingCommunityJobSuccessSubscription.unsubscribe();
    }
  }

  buildForm() {
    this.communityJobForm = this.formBuilder.group({
      'positionTitle':   ['', [ Validators.required, Validators.minLength(1), Validators.maxLength(this.textMaxLength)]],
      'location':   ['', [ Validators.required, Validators.minLength(1), Validators.maxLength(this.textMaxLength)]],
      'postingUrl':   ['', [ Validators.required ]]
    });
  }

  submit() {
    if (!this.communityJobForm.valid) {
      return;
    }

    const newJob = {
      PositionTitle: this.positionTitle.value,
      Location: this.location.value,
      Url: this.postingUrl.value
    };
    this.store.dispatch(new fromCommunityJobActions.SubmittingCommunityJob(newJob));
  }

  postAnotherJob () {
    this.jobSubmitted = null;
    this.store.dispatch(new fromCommunityJobActions.SubmitAnotherCommunityJob());
  }

}
