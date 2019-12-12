import { Component, ViewChild, OnInit, OnDestroy, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Store, select } from '@ngrx/store';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, Subscription } from 'rxjs';
import * as cloneDeep from 'lodash.clonedeep';

import { AsyncStateObj } from 'libs/models/state';
import { Permissions } from 'libs/constants';

import * as fromJDMSharedReduder from '../../../shared/reducers';
import * as fromWorkflowConfigActions from '../../../shared/actions/workflow-config.actions';
import * as fromWorkflowTemplateListActions from '../../../shared/actions/shared-workflow.actions';
import * as fromJobDescriptionManagementReducer from '../../reducers';
import * as fromWorkflowSetupModalActions from '../../actions/workflow-setup-modal.actions';
import { WorkflowTemplate, WorkflowStep } from '../../../shared/models';
import { Workflow } from '../../models';

@Component({
  selector: 'pf-workflow-setup-modal',
  templateUrl: 'workflow-setup-modal.component.html',
  styleUrls: ['./workflow-setup-modal.component.scss']
})
export class WorkflowSetupModalComponent implements OnInit, OnDestroy {
  @Input() jobTitle: string;
  @Input() revision: number;
  @Input() jobId: number;

  @ViewChild('routeForApprovalModal', { static : true }) public routeForApprovalModal: any;
  workflowTemplatesAsync$: Observable<AsyncStateObj<WorkflowTemplate[]>>;
  workflowSaving$: Observable<boolean>;
  workflowSteps$: Observable<WorkflowStep[]>;
  hasForbiddenUsers$: Observable<boolean>;
  stepsDirty$: Observable<boolean>;
  savingSuccess$: Observable<boolean>;

  workflowTemplatesAsyncSubscription: Subscription;
  hasForbiddenUsersSubscription: Subscription;
  workflowStepsSubscription: Subscription;
  savingSuccessSubscription: Subscription;
  stepsDirtySubscription: Subscription;

  entityId: number;
  accessibleTemplates: WorkflowTemplate[];
  filteredTemplates: WorkflowTemplate[];
  hasFilteredTemplates: boolean;
  selectedTemplateName: string;
  workflowInitiationComment: string;
  hasForbiddenUsers: boolean;
  stepsDirty: boolean;
  workflowUrl: string;
  workflowSteps: WorkflowStep[];

  constructor(
    private store: Store<fromJobDescriptionManagementReducer.State>,
    private sharedJdmStore: Store<fromJDMSharedReduder.State>,
    private modalService: NgbModal,
    private route: ActivatedRoute
  ) {
    this.workflowSteps$ = this.store.pipe(select(fromJDMSharedReduder.getWorkflowStepsFromWorkflowConfig));
    this.workflowTemplatesAsync$ = this.store.pipe(select(fromJDMSharedReduder.getWorkflowTemplateList));
    this.workflowSaving$ = this.store.pipe(select(fromJobDescriptionManagementReducer.getWorkflowSetupSaving));
    this.hasForbiddenUsers$ = this.sharedJdmStore.pipe(select(fromJDMSharedReduder.getHasUsersWithoutPermission));
    this.stepsDirty$ = this.sharedJdmStore.pipe(select(fromJDMSharedReduder.getWorkflowConfigDirty));
    this.savingSuccess$ = this.store.pipe(select(fromJobDescriptionManagementReducer.getWorkflowSetupSavingSuccess));
  }

  ngOnInit(): void {
    this.entityId = +this.route.snapshot.params['id'];
    this.workflowUrl = `/job-description-management/job-descriptions/${this.entityId}`;
    this.workflowTemplatesAsyncSubscription = this.workflowTemplatesAsync$.subscribe(results => this.handleWorkflowTemplatesChanged(results.obj));
    this.hasForbiddenUsersSubscription = this.hasForbiddenUsers$.subscribe(value => this.hasForbiddenUsers = value);
    this.workflowStepsSubscription = this.workflowSteps$.subscribe(results => this.workflowSteps = results);
    this.savingSuccessSubscription = this.savingSuccess$.subscribe(success => {
      if (success) {
        this.close();
      }
    });
    this.stepsDirtySubscription = this.stepsDirty$.subscribe(value => {
      this.stepsDirty = value;
      if (this.stepsDirty && this.selectedTemplateName !== undefined) {
        this.selectedTemplateName = undefined;
      }
    });
  }

  ngOnDestroy(): void {
    this.workflowTemplatesAsyncSubscription.unsubscribe();
    this.hasForbiddenUsersSubscription.unsubscribe();
    this.workflowStepsSubscription.unsubscribe();
    this.savingSuccessSubscription.unsubscribe();
  }

  open(): void {
    this.selectedTemplateName = undefined;
    this.store.dispatch(new fromWorkflowTemplateListActions.Load(this.jobId));
    this.workflowInitiationComment = '';
    this.modalService.open(this.routeForApprovalModal, { backdrop: 'static', windowClass: 'route-for-approval-modal' });
  }

  close(): void {
    this.modalService.dismissAll();
  }

  handleFilter(searchTerm: string): void {
    this.filteredTemplates = this.accessibleTemplates.filter(t => t.Name.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1);
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

  createWorkflow(): void {
    const workflow = this.buildWorkflow();
    this.store.dispatch(new fromWorkflowSetupModalActions.CreateWorkflow(workflow));
  }

  private handleWorkflowTemplatesChanged(results: WorkflowTemplate[]): void {
    if (!results || !results.length) {
      return;
    }
    const multipleStepsTemplates = results.filter(t => t.Steps.length > 0);
    this.hasFilteredTemplates = multipleStepsTemplates.some(t => t.Steps.some(s => s.Permissions.length === 0));
    this.accessibleTemplates = multipleStepsTemplates.filter(t => !t.Steps.some(s => s.Permissions.length === 0));
    this.filteredTemplates = this.accessibleTemplates;
  }

  private buildWorkflow(): Workflow {
    let workflowStepsClone: WorkflowStep[] = cloneDeep(this.workflowSteps);
    workflowStepsClone = workflowStepsClone.map(step => {
      delete step['UserPicture'];
      step.Permissions = step.Permissions.filter(p => p.selected).map(p => p.permission);
      return step;
    });
    return {
      EntityType: 'JobDescription',
      EntityId: this.entityId,
      EntityTitle: this.jobTitle,
      WorkflowUrl: this.workflowUrl,
      Revision: this.revision,
      WorkflowSteps: workflowStepsClone,
      InitiationComment: this.workflowInitiationComment,
      AllAvailablePermissions: [ Permissions.JOB_DESCRIPTIONS, Permissions.CAN_EDIT_JOB_DESCRIPTION ]
    };
  }
}
