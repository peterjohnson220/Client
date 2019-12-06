import { Component, OnInit } from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';

import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';

import { AsyncStateObj } from 'libs/models';
import { WorkflowTemplate, WorkflowStep } from 'apps/job-description-management/app/shared/models';

import * as fromWorkflowReducer from '../reducers';
import * as fromWorkflowAction from '../actions';

@Component({
  selector: 'pf-routing-workflows',
  templateUrl: './routing-workflows-list.page.html',
  styleUrls: ['./routing-workflows-list.page.scss']
})
export class RoutingWorkflowsPageComponent implements OnInit {

  filter: string;

  workflowTemplates$: Observable<AsyncStateObj<WorkflowTemplate[]>>;

  constructor(
    private sanitizer: DomSanitizer,
    private store: Store<fromWorkflowReducer.State>) {
    this.workflowTemplates$ = this.store.pipe(select(fromWorkflowReducer.getWorkflowTemplateList));
  }

  ngOnInit() {
    this.store.dispatch(new fromWorkflowAction.LoadWorkflowTemplates());
  }

  createWorkflow() {
    this.store.dispatch(new fromWorkflowAction.OpenUpsertWorkflowTemplateModal());
  }

  editWorkflow(workflowTemplate: WorkflowTemplate) {
    this.store.dispatch(new fromWorkflowAction.OpenUpsertWorkflowTemplateModal(workflowTemplate));
  }

  deleteWorkflow(workflowTemplate: WorkflowTemplate) {
      this.store.dispatch(new fromWorkflowAction.OpenDeleteWorkflowTemplateModal(workflowTemplate));
  }

  handleSearchValueChanged(value: string) {
    this.filter = value;
  }

  trackByFunction(index, item) {
    return item;
  }

  getUserList(steps: WorkflowStep[]) {
      if (steps) {
          return steps.map(step => {
              if (step && step.WorkflowStepUsers ) {
                  return step.WorkflowStepUsers.map(workflowUser => `${workflowUser.FirstName} ${workflowUser.LastName}`).join(', ');
              }
          }).join(', ');
      }
  }

}
