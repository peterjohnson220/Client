import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { DragulaService } from 'ng2-dragula';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';

import * as fromRootState from 'libs/state/state';
import { UserContext } from 'libs/models/security';
import { Permissions } from 'libs/constants/permissions';
import * as fromJDMSharedReduder from 'libs/features/jobs/job-description-management/reducers';
import * as fromWorkflowConfigActions from 'libs/features/jobs/job-description-management/actions/workflow-config.actions';
import { AddUserToWorkflowObj, WorkflowStep, WorkflowUser } from 'libs/features/jobs/job-description-management/models';
import { WorkflowConfigHelper } from 'libs/features/jobs/job-description-management';

@Component({
  selector: 'pf-workflow-config',
  templateUrl: './workflow-config.component.html',
  styleUrls: ['././workflow-config.component.scss']
})
export class WorkflowConfigComponent implements OnInit, OnDestroy {
  @Input() jobIds: number[];
  @Output() onShowNameFormClicked = new EventEmitter<boolean>();

  hasForbiddenUsers$: Observable<boolean>;
  workflowSteps$: Observable<WorkflowStep[]>;
  workflowUserOrEmail$: Observable<any>;
  identity$: Observable<UserContext>;

  hasForbiddenUsersSubscription: Subscription;
  workflowStepsSubscription: Subscription;
  workflowUserOrEmailSubscription: Subscription;
  dragulaSub: Subscription;
  identitySubscription: Subscription;

  addNonPfUserForm: FormGroup;
  addNonPfUserSameStepForm: FormGroup;
  avatarUrl: string;
  currentEmail: string;
  displayNameThreshold = 30;
  hasForbiddenUsers: boolean;
  nonPfUserFormSubmitted: boolean;
  nonPfUserSameStepDuplicateEmail: boolean;
  nonPfUserSameStepFormSubmitted: boolean;
  publisherName: string;
  sameStepEmail: string;
  showNameForm: boolean;
  stepAddingNonPfUsers: number;
  stepWithMultipleUsersBeingAdded: number;
  workflowSteps: WorkflowStep[];

  constructor(
    private sharedJdmStore: Store<fromJDMSharedReduder.State>,
    private userContextStore: Store<fromRootState.State>,
    private formBuilder: FormBuilder,
    private dragulaService: DragulaService
  ) {
    this.initDragulaSub();
    this.hasForbiddenUsers$ = this.sharedJdmStore.select(fromJDMSharedReduder.getHasUsersWithoutPermission);
    this.workflowSteps$ = this.sharedJdmStore.select(fromJDMSharedReduder.getWorkflowStepsFromWorkflowConfig);
    this.workflowUserOrEmail$ = this.sharedJdmStore.select(fromJDMSharedReduder.getWorkflowUserOrEmail);
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
    this.workflowUserOrEmailSubscription = this.workflowUserOrEmail$.subscribe(selection => {
      if (selection) {
        this.handlePickerSelection(selection);
      }
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
    this.workflowUserOrEmailSubscription.unsubscribe();
  }

  nonPfUserFormSubmit(): void {
    this.nonPfUserFormSubmitted = true;
    if (this.addNonPfUserForm.valid) {
      this.addNonPfUserToWorkflow(this.addNonPfUserForm.value.firstname, this.addNonPfUserForm.value.lastname, null);
    }
  }

  cancelNonPfUserAdd(): void {
    this.showNameForm = false;
    this.onShowNameFormClicked.emit(false);
    this.currentEmail = '';
  }

  addNonPfUserToWorkflow(firstName: string, lastName: string, stepIndex: number) {
    const addUserToWorkflowObj: AddUserToWorkflowObj = {
      FirstName: firstName,
      LastName: lastName,
      EmailAddress: this.currentEmail,
      JobIds: this.jobIds,
      IsNonPfUser: true,
      StepIndex: stepIndex,
      Permissions: WorkflowConfigHelper.getDefaultPermissions()
    };
    this.showNameForm = false;
    this.sharedJdmStore.dispatch(new fromWorkflowConfigActions.AddNonPfUserToWorkflow(addUserToWorkflowObj));
  }

  handlePickerSelection(selectedUser: WorkflowUser): void {
    if (!selectedUser.FirstName || !selectedUser.LastName) {
      this.addNonPfUserForm.reset();
      this.nonPfUserFormSubmitted = false;
      this.showNameForm = true;
      this.currentEmail = selectedUser.EmailAddress;
    } else {
      const workflowUser: WorkflowUser = {
        ...selectedUser,
        Permissions: WorkflowConfigHelper.getDefaultPermissions()
      };
      this.onShowNameFormClicked.emit(false);
      this.sharedJdmStore.dispatch(new fromWorkflowConfigActions.CreateWorkflowStep(workflowUser));
    }
  }

  handleRemoveClicked(user: WorkflowUser) {
    this.sharedJdmStore.dispatch(new fromWorkflowConfigActions.DeleteUserOrEmail(user));
  }

  isUserImg(user: WorkflowUser) {
    return user.UserPicture && user.UserPicture !== 'default_user.png';
  }

  addMultipleUsersToLevel(stepIndex: number): void {
    this.stepWithMultipleUsersBeingAdded = stepIndex;
  }

  updateWorkflowStepPermission(workflowUser: WorkflowUser, permission: string): void {
    if (permission === Permissions.CAN_EDIT_JOB_DESCRIPTION) {
      this.sharedJdmStore.dispatch(new fromWorkflowConfigActions.UpdateWorkflowStepPermission({workflowUser, permission}));
    }
  }

  deleteWorkflowStep(stepIndex: number): void {
    this.resetMultiUserStepTracking();
    this.sharedJdmStore.dispatch(new fromWorkflowConfigActions.DeleteWorkflowStep({ stepIndex }));
  }

  handleMultipleUserPerLevelSelection(selectedUser: any, stepIndex: number): void {
    this.nonPfUserSameStepDuplicateEmail = false;
    if (this.workflowSteps[stepIndex].WorkflowStepUsers.some(stepUser => stepUser.EmailAddress.toLowerCase() === selectedUser.EmailAddress.toLowerCase() )) {
      this.nonPfUserSameStepDuplicateEmail = true;
      return;
    }

    if (!selectedUser.FirstName || !selectedUser.LastName) {
      this.addNonPfUserSameStepForm.reset();
      this.currentEmail = selectedUser.EmailAddress;
      this.resetMultiUserStepTracking();
      this.stepAddingNonPfUsers = stepIndex;
    } else {
      const workflowUser: WorkflowUser = {
        ...selectedUser,
        Permissions: WorkflowConfigHelper.getDefaultPermissions()
      };
      this.sharedJdmStore.dispatch(new fromWorkflowConfigActions.AddUserToWorkflowStep({ stepIndex, workflowUser: workflowUser }));
      this.resetMultiUserStepTracking();
    }
  }

  resetMultiUserStepTracking(): void {
    this.nonPfUserSameStepDuplicateEmail = false;
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
    this.nonPfUserSameStepDuplicateEmail = false;
    this.stepAddingNonPfUsers = null;
    this.sameStepEmail = '';
  }

  getUserInitials(user: WorkflowUser): string {
    return `${user.FirstName.substring(0, 1)}${user.LastName.substring(0, 1)}`.toUpperCase();
  }

  getDisplayName(user: WorkflowUser): string {
    return user.UserId ? `${user.FirstName} ${user.LastName}` : user.EmailAddress;
  }

  hideDisplayNameTooltip(ngbTooltip: NgbTooltip) {
    if (ngbTooltip.isOpen()) {
      ngbTooltip.close();
    }
  }

  showDisplayNameTooltip(user: WorkflowUser, ngbTooltip: NgbTooltip) {
    const displayName = this.getDisplayName(user);

    if (displayName.trim().length > this.displayNameThreshold) {
      ngbTooltip.open();
    }
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
    if (this.workflowSteps.every(x => x.WorkflowStepUsers.length === 0)) {
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
