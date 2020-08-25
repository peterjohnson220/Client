import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { DragulaService } from 'ng2-dragula';

import * as fromRootState from 'libs/state/state';
import { UserContext } from 'libs/models/security';

import * as fromJDMSharedReduder from 'libs/features/job-description-management/reducers';
import * as fromWorkflowConfigActions from 'libs/features/job-description-management/actions/workflow-config.actions';
import { AddUserToWorkflowObj, WorkflowStep } from 'libs/features/job-description-management/models';

@Component({
  selector: 'pf-workflow-config',
  templateUrl: './workflow-config.component.html',
  styleUrls: ['././workflow-config.component.scss']
})
export class WorkflowConfigComponent implements OnInit, OnDestroy {
  @Input() jobId: number;

  hasForbiddenUsers$: Observable<boolean>;
  workflowSteps$: Observable<WorkflowStep[]>;
  identity$: Observable<UserContext>;

  hasForbiddenUsersSubscription: Subscription;
  workflowStepsSubscription: Subscription;
  dragulaSub: Subscription;
  identitySubscription: Subscription;

  workflowSteps: WorkflowStep[];
  addNonPfUserForm: FormGroup;
  addNonPfUserSameStepForm: FormGroup;
  currentEmail: string;
  sameStepEmail: string;
  showNameForm: boolean;
  hasForbiddenUsers: boolean;
  nonPfUserFormSubmitted: boolean;
  nonPfUserSameStepFormSubmitted: boolean;
  stepWithMultipleUsersBeingAdded: number;
  stepAddingNonPfUsers: number;
  publisherName: string;
  avatarUrl: string;

  constructor(
    private sharedJdmStore: Store<fromJDMSharedReduder.State>,
    private userContextStore: Store<fromRootState.State>,
    private formBuilder: FormBuilder,
    private dragulaService: DragulaService
  ) {
    this.initDragulaSub();
    this.hasForbiddenUsers$ = this.sharedJdmStore.select(fromJDMSharedReduder.getHasUsersWithoutPermission);
    this.workflowSteps$ = this.sharedJdmStore.select(fromJDMSharedReduder.getWorkflowStepsFromWorkflowConfig);
    this.identity$ = this.userContextStore.select(fromRootState.getUserContext);
  }

  ngOnInit(): void {
    this.initData();
    this.buildNonPfUserForm();
    this.buildNonPfUserSameLevelForm();
    this.hasForbiddenUsersSubscription = this.hasForbiddenUsers$.subscribe(value => this.hasForbiddenUsers = value);
    this.workflowStepsSubscription = this.workflowSteps$.subscribe(results => {
      this.workflowSteps = results;
      this.setPublisherName();
    });
    this.identitySubscription = this.identity$.subscribe(i => {
      if (!!i) {
        this.avatarUrl = i.ConfigSettings.find(c => c.Name === 'CloudFiles_PublicBaseUrl').Value + '/avatars/';
      }
    });
    this.sharedJdmStore.dispatch(new fromWorkflowConfigActions.ResetWorkflow());
  }

  ngOnDestroy(): void {
    this.destroyDragula();
    this.hasForbiddenUsersSubscription.unsubscribe();
    this.workflowStepsSubscription.unsubscribe();
    this.identitySubscription.unsubscribe();
  }

  nonPfUserFormSubmit(): void {
    this.nonPfUserFormSubmitted = true;
    if (this.addNonPfUserForm.valid) {
      this.addNonPfUserToWorkflow(this.addNonPfUserForm.value.firstname, this.addNonPfUserForm.value.lastname, null);
    }
  }

  cancelNonPfUserAdd(): void {
    this.showNameForm = false;
    this.currentEmail = '';
  }

  addNonPfUserToWorkflow(firstName: string, lastName: string, stepIndex: number) {
    const addUserToWorkflowObj: AddUserToWorkflowObj = {
      FirstName: firstName,
      LastName: lastName,
      EmailAddress: this.currentEmail,
      JobId: this.jobId,
      IsNonPfUser: true,
      StepIndex: stepIndex
    };
    this.showNameForm = false;
    this.sharedJdmStore.dispatch(new fromWorkflowConfigActions.AddNonPfUserToWorkflow(addUserToWorkflowObj));
  }

  handlePickerSelection(selectedUser: any): void {
    if (!selectedUser.FirstName || !selectedUser.LastName) {
      this.addNonPfUserForm.reset();
      this.nonPfUserFormSubmitted = false;
      this.showNameForm = true;
      this.currentEmail = selectedUser.EmailAddress;
    } else {
      this.sharedJdmStore.dispatch(new fromWorkflowConfigActions.CreateWorkflowStep(selectedUser));
    }
  }

  addMultipleUsersToLevel(stepIndex: number): void {
    this.stepWithMultipleUsersBeingAdded = stepIndex;
  }

  updateWorkflowStepPermission(stepIndex: number, permission: string, selected: boolean): void {
    this.sharedJdmStore.dispatch(new fromWorkflowConfigActions.UpdateWorkflowStepPermission({
      stepIndex, permission, selected
    }));
  }

  deleteWorkflowStep(stepIndex: number): void {
    this.resetMultiUserStepTracking();
    this.sharedJdmStore.dispatch(new fromWorkflowConfigActions.DeleteWorkflowStep({ stepIndex }));
  }

  handleMultipleUserPerLevelSelection(selectedUser: any, stepIndex: number): void {
    if (!selectedUser.FirstName || !selectedUser.LastName) {
      this.addNonPfUserSameStepForm.reset();
      this.nonPfUserSameStepFormSubmitted = false;
      this.sameStepEmail = selectedUser.EmailAddress;
      this.resetMultiUserStepTracking();
      this.stepAddingNonPfUsers = stepIndex;
    } else {
      this.sharedJdmStore.dispatch(new fromWorkflowConfigActions.AddUserToWorkflowStep({ stepIndex, workflowUser: selectedUser }));
      this.resetMultiUserStepTracking();
    }
  }

  resetMultiUserStepTracking(): void {
    this.stepWithMultipleUsersBeingAdded = null;
    this.stepAddingNonPfUsers = null;
  }

  nonPfUserSameLevelFormSubmit(stepIndex: number): void {
    this.nonPfUserSameStepFormSubmitted = true;
    if (this.addNonPfUserSameStepForm.valid) {
      this.addNonPfUserToWorkflow(this.addNonPfUserSameStepForm.value.firstname, this.addNonPfUserSameStepForm.value.lastname, stepIndex);
    }
    this.resetMultiUserStepTracking();
  }

  cancelNonPfUserSameLevelAdd(): void {
    this.stepAddingNonPfUsers = null;
    this.sameStepEmail = '';
  }

  private initDragulaSub(): void {
    this.dragulaSub = new Subscription();
    this.dragulaSub.add(this.dragulaService.dropModel('workflow-user-reorder-bag').subscribe(({ sourceModel }) => {
      this.reorderWorkflowSteps(sourceModel);
    }));
    this.dragulaService.createGroup('workflow-user-reorder-bag', {
      revertOnSpill: true,
      moves: function (el, container, handle) {
        return handle.classList.contains('dnd-workflow-user-reorder-handle') &&
        handle.classList.contains('grabbable');
      },
      accepts: function (el, target, source) {
        return source.id === target.id;
      }
    });

  }

  private destroyDragula() {
    this.dragulaSub.unsubscribe();
    this.dragulaService.destroy('workflow-user-reorder-bag');
  }

  private reorderWorkflowSteps(sourceModel: any[]) {
    if (!sourceModel) {
      return;
    }
    return this.sharedJdmStore.dispatch(new fromWorkflowConfigActions.ReorderWorkflowSteps(sourceModel));
  }

  private buildNonPfUserForm() {
    this.addNonPfUserForm = this.formBuilder.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required]
    });
  }

  private initData(): void {
    this.publisherName = '';
    this.currentEmail = '';
    this.showNameForm = false;
    this.nonPfUserFormSubmitted = false;
    this.nonPfUserSameStepFormSubmitted = false;
  }

  private buildNonPfUserSameLevelForm(): void {
    this.addNonPfUserSameStepForm = this.formBuilder.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required]
    });
  }

  private setPublisherName(): void {
    if (this.workflowSteps.length === 0) {
      this.publisherName = '';
      return;
    }
    const lastWorkflowStep = this.workflowSteps[this.workflowSteps.length - 1];
    const lastStepUsers = lastWorkflowStep.WorkflowStepUsers;
    const numLastStepUsers = lastStepUsers.length;
    const lastUserInStep = lastStepUsers[numLastStepUsers - 1];

    if (numLastStepUsers === 1) {
      this.publisherName = `${lastUserInStep.FirstName} ${lastUserInStep.LastName}`;
    } else {
      let notLastUsers = '';
      for (let i = 0; i < numLastStepUsers - 1; i++) {
        notLastUsers += lastStepUsers[i].FirstName + ' ' + lastStepUsers[i].LastName;

        if (i !== numLastStepUsers - 2 && numLastStepUsers > 2) {
          notLastUsers += ', ';
        }
      }
      this.publisherName = `either ${notLastUsers} or ${lastUserInStep.FirstName} ${lastUserInStep.LastName}`;
    }
  }
}
