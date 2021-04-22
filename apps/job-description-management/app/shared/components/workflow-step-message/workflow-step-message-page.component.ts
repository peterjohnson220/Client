import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { JobDescriptionManagementJobDescriptionState } from '../../../_job-description/reducers';
import * as fromWorkflowReducer from '../../../_job-description/reducers';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'pf-workflow-step-message-page',
  templateUrl: './workflow-step-message-page.component.html',
  styleUrls: ['./workflow-step-message-page.component.scss']
})
export class WorkflowStepMessagePageComponent implements OnInit {
  workflowCompleteMessage$: Observable<string>;

  constructor(private router: Router,
              private store: Store<JobDescriptionManagementJobDescriptionState>) {
    this.workflowCompleteMessage$ = this.store.select(fromWorkflowReducer.getMessage);
  }

  ngOnInit(): void {
  }

  backToJobDescriptionList() {
    this.router.navigate(['/']);
  }

  backToJobDescriptionInbox() {
    this.router.navigate(['/inbox']);
  }

}
