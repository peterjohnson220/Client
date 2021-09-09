import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

import { Store, select } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import cloneDeep from 'lodash/cloneDeep';

import { AsyncStateObj } from 'libs/models/state';
import { Permissions } from 'libs/constants';
import { NewLinePipe } from 'libs/core/pipes';

import * as fromJDMSharedReduder from 'libs/features/jobs/job-description-management/reducers';
import * as fromWorkflowConfigActions from 'libs/features/jobs/job-description-management/actions/workflow-config.actions';

import * as fromJobDescriptionManagementReducer from '../../reducers';
import * as fromWorkflowSetupModalActions from '../../actions/workflow-setup-modal.actions';
import * as fromJobDescriptionGridActions from '../../actions/job-description-grid.actions';
import { WorkflowTemplate, WorkflowStep } from 'libs/features/jobs/job-description-management/models';
import { Workflow, WorkflowSetupModalInput } from '../../models';

@Component({
  selector: 'pf-approvals-workflow-setup',
  templateUrl: './approvals-workflow-setup.component.html',
  styleUrls: ['./approvals-workflow-setup.component.scss']
})
export class ApprovalsWorkflowSetupComponent implements OnInit, OnDestroy {
  @Input() workflowSetupModalInput: WorkflowSetupModalInput[];
  @Output() closeClicked = new EventEmitter();

  workflowTemplatesAsync$: Observable<AsyncStateObj<WorkflowTemplate[]>>;
  workflowSteps$: Observable<WorkflowStep[]>;
  hasForbiddenUsers$: Observable<boolean>;
  stepsDirty$: Observable<boolean>;

  workflowTemplatesAsyncSubscription: Subscription;
  hasForbiddenUsersSubscription: Subscription;
  workflowStepsSubscription: Subscription;
  stepsDirtySubscription: Subscription;

  accessibleTemplates: WorkflowTemplate[];
  addingNonSystemUser = false;
  filteredTemplates: WorkflowTemplate[];
  hasFilteredTemplates: boolean;
  hasForbiddenUsers: boolean;
  selectedTemplateName: string;
  selectedUser: any;
  stepsDirty: boolean;
  workflowInitiationComment: string;
  workflowSteps: WorkflowStep[];
  workflowUrl: string;
  convertNewLinePipe;

  get jobIds(): number[] {
    return this.workflowSetupModalInput.map(x => x.JobId);
  }

  constructor(
    private store: Store<fromJobDescriptionManagementReducer.State>,
    private sharedJdmStore: Store<fromJDMSharedReduder.State>,
    private router: Router
  ) {
    this.workflowSteps$ = this.store.pipe(select(fromJDMSharedReduder.getWorkflowStepsFromWorkflowConfig));
    this.workflowTemplatesAsync$ = this.store.pipe(select(fromJDMSharedReduder.getWorkflowTemplateList));
    this.hasForbiddenUsers$ = this.sharedJdmStore.pipe(select(fromJDMSharedReduder.getHasUsersWithoutPermission));
    this.stepsDirty$ = this.sharedJdmStore.pipe(select(fromJDMSharedReduder.getWorkflowConfigDirty));
    this.convertNewLinePipe = new NewLinePipe();
  }

  ngOnInit(): void {
    this.workflowTemplatesAsyncSubscription = this.workflowTemplatesAsync$.subscribe(results => this.handleWorkflowTemplatesChanged(results.obj));
    this.hasForbiddenUsersSubscription = this.hasForbiddenUsers$.subscribe(value => this.hasForbiddenUsers = value);
    this.workflowStepsSubscription = this.workflowSteps$.subscribe(results => this.workflowSteps = results);
    this.stepsDirtySubscription = this.stepsDirty$.subscribe(value => {
      this.stepsDirty = value;
      if (this.stepsDirty && this.selectedTemplateName !== undefined) {
        this.selectedTemplateName = undefined;
      }
    });
    this.selectedTemplateName = undefined;
    this.workflowInitiationComment = '';
  }

  ngOnDestroy(): void {
    this.workflowTemplatesAsyncSubscription.unsubscribe();
    this.hasForbiddenUsersSubscription.unsubscribe();
    this.workflowStepsSubscription.unsubscribe();
  }

  handleFilter(searchTerm: string): void {
    this.filteredTemplates = this.accessibleTemplates.filter(t => t.Name.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1);
  }

  handlePickerSelection(selectedUser: any): void {
    this.sharedJdmStore.dispatch(new fromWorkflowConfigActions.AddSelectedUserOrEmail(selectedUser));
  }

  handleSelectedTemplateChanged(templateId: string): void {
    if (!templateId) {
      return;
    }
    const selectedTemplate = this.accessibleTemplates.find(tl => tl.Id === templateId);
    if (!!selectedTemplate) {
      this.sharedJdmStore.dispatch(new fromWorkflowConfigActions.PopulateWorkflow({
        workflowSteps: selectedTemplate.Steps,
        prepopulating: false
      }));
    }
  }

  handleShowNameFormClicked(isAddingNonSystemUser: boolean) {
    this.addingNonSystemUser = isAddingNonSystemUser;
  }

  createWorkflow(): void {
    const workflows = [];
    this.workflowInitiationComment = this.convertNewLinePipe.transform(this.workflowInitiationComment);
    this.workflowSetupModalInput?.forEach(x => {
      workflows.push(this.buildWorkflow(x));
    });
    const jobDescriptionIds = this.workflowSetupModalInput.map(x => x.EntityId);
    this.store.dispatch(new fromJobDescriptionGridActions.AddRoutingJobs(jobDescriptionIds));
    this.store.dispatch(new fromWorkflowSetupModalActions.CreateWorkflow(workflows));
    this.router.navigate(['/job-descriptions']);
  }

  close(): void {
    this.closeClicked.emit();
  }

  private handleWorkflowTemplatesChanged(results: WorkflowTemplate[]): void {
    if (!results || !results.length) {
      return;
    }
    const multipleStepsTemplates = results.filter(t => t.Steps.length > 0);
    this.accessibleTemplates = multipleStepsTemplates.filter(t => !t.Steps.some(s => s.WorkflowStepUsers.some(u => u.Permissions.length === 0)));
    this.hasFilteredTemplates = this.accessibleTemplates.length < multipleStepsTemplates.length;
    this.filteredTemplates = this.accessibleTemplates;
  }

  private buildWorkflow(worflowInput: WorkflowSetupModalInput): Workflow {
    const workflowSteps: WorkflowStep[] = cloneDeep(this.workflowSteps);

    for (let i = 0; i < workflowSteps.length; i++) {
      for (let j = 0; j < workflowSteps[i].WorkflowStepUsers.length; j++) {
        const user = workflowSteps[i].WorkflowStepUsers[j];
        delete user['UserPicture'];
        delete user['StepId'];
        user.Permissions = user.Permissions.filter(p => p.selected).map(p => p.permission);
      }
    }

    return {
      EntityType: 'JobDescription',
      EntityId: worflowInput?.EntityId,
      EntityTitle: worflowInput?.JobTitle,
      WorkflowUrl:  `/job-description-management/job-descriptions/${worflowInput?.EntityId}`,
      Revision: worflowInput?.Revision,
      WorkflowSteps: workflowSteps,
      InitiationComment: this.workflowInitiationComment,
      AllAvailablePermissions: [ Permissions.JOB_DESCRIPTIONS, Permissions.CAN_EDIT_JOB_DESCRIPTION ],
      Attachments: null
    };
  }
}

