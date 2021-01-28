import { Component, OnInit, ViewChild } from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';

import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';

import { AsyncStateObj } from 'libs/models';

import * as fromWorkflowReducer from '../reducers';
import * as fromWorkflowAction from '../actions';
import { RoutingWorkflowsUpsertModalComponent } from '../containers';
import { WorkflowTemplate, WorkflowStep } from 'libs/features/jobs/job-description-management/models';

@Component({
  selector: 'pf-routing-workflows',
  templateUrl: './routing-workflows-list.page.html',
  styleUrls: ['./routing-workflows-list.page.scss']
})
export class RoutingWorkflowsPageComponent implements OnInit {
  @ViewChild(RoutingWorkflowsUpsertModalComponent, {static: true}) saveWorkflowModalComponent: RoutingWorkflowsUpsertModalComponent;

  filter: string;

  workflowTemplates$: Observable<AsyncStateObj<WorkflowTemplate[]>>;
  workflowTemplateNames$: Observable<string[]>;

  constructor(
    private sanitizer: DomSanitizer,
    private store: Store<fromWorkflowReducer.State>) {
    this.workflowTemplates$ = this.store.pipe(select(fromWorkflowReducer.getWorkflowTemplateList));
    this.workflowTemplateNames$ = this.store.pipe(select(fromWorkflowReducer.getWorkflowTemplateNames));
  }

  ngOnInit() {
    this.store.dispatch(new fromWorkflowAction.LoadWorkflowTemplates());
  }

  createWorkflow() {
    this.saveWorkflowModalComponent.open();
  }

  editWorkflow(workflowTemplate: WorkflowTemplate) {
    this.saveWorkflowModalComponent.open(workflowTemplate);
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
