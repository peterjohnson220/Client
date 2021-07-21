import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { JobDescriptionManagementJobDescriptionState } from '../../../_job-description/reducers';
import * as fromWorkflowReducer from '../../../_job-description/reducers';
import { Observable, Subject } from 'rxjs';
import { Router } from '@angular/router';
import { AbstractFeatureFlagService, FeatureFlags, RealTimeFlag } from 'libs/core/services/feature-flags';

@Component({
  selector: 'pf-workflow-step-message-page',
  templateUrl: './workflow-step-message-page.component.html',
  styleUrls: ['./workflow-step-message-page.component.scss']
})
export class WorkflowStepMessagePageComponent implements OnDestroy {
  private unsubscribe$ = new Subject<void>();
  jdmInboxFeatureFlag: RealTimeFlag = { key: FeatureFlags.JdmInbox, value: false };
  workflowCompleteMessage$: Observable<string>;

  constructor(private router: Router,
              private store: Store<JobDescriptionManagementJobDescriptionState>,
              private featureFlagService: AbstractFeatureFlagService) {

    this.featureFlagService.bindEnabled(this.jdmInboxFeatureFlag, this.unsubscribe$);
    this.workflowCompleteMessage$ = this.store.select(fromWorkflowReducer.getMessage);
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
  }

  backToJobDescriptionList() {
    this.router.navigate(['/']);
  }

  backToJobDescriptionInbox() {
    this.router.navigate(['/inbox']);
  }

}
