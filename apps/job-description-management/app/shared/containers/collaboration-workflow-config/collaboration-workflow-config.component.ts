import { Component, Input, OnDestroy, OnInit} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';

import * as fromRootState from 'libs/state/state';
import { UserContext } from 'libs/models';
import * as fromJDMSharedReducer from 'libs/features/jobs/job-description-management/reducers';
import { AddUserToWorkflowObj, WorkflowConfigHelper, WorkflowUser } from 'libs/features/jobs/job-description-management';
import * as fromCollaborationWorkflowConfigActions from 'libs/features/jobs/job-description-management/actions/collaboration-workflow-config.actions';


@Component({
  selector: 'pf-collaboration-workflow-config',
  templateUrl: './collaboration-workflow-config.component.html',
  styleUrls: ['./collaboration-workflow-config.component.scss']
})
export class CollaborationWorkflowConfigComponent implements OnInit, OnDestroy {
  @Input() jobIds: number[];
  identity$: Observable<UserContext>;
  collaborationWorkflowUserOrEmail$: Observable<any>;
  collaborationWorkflowUsers$: Observable<any>;

  collaborationWorkflowUserOrEmailSubscription: Subscription;
  collaborationWorkflowUsersSubscription: Subscription;
  identitySubscription: Subscription;
  collaborationWorkflowUsers: WorkflowUser[];

  currentEmail: string;
  addNonPfUserForm: FormGroup;
  showNonPFUserNameForm: boolean;
  nonPfUserFormSubmitted: boolean;
  avatarUrl: string;
  displayNameThreshold = 30;
  duplicateCollaborationEmail: boolean;

  constructor(
    private sharedJdmStore: Store<fromJDMSharedReducer.State>,
    private userContextStore: Store<fromRootState.State>,
    private formBuilder: FormBuilder
  ) {
    this.identity$ = this.userContextStore.select(fromRootState.getUserContext);
    this.collaborationWorkflowUserOrEmail$ = this.sharedJdmStore.select(fromJDMSharedReducer.getSelectedCollaborationWorkflowUserOrEmail);
    this.collaborationWorkflowUsers$ = this.sharedJdmStore.select(fromJDMSharedReducer.getCollaborationWorkflowUsers);
  }

  ngOnInit(): void {
    this.buildNonPfUserForm();
    this.identitySubscription = this.identity$.subscribe(i => {
      if (!!i) {
        this.avatarUrl = i.ConfigSettings.find(c => c.Name === 'CloudFiles_PublicBaseUrl').Value + '/avatars/';
      }
    });
    this.collaborationWorkflowUserOrEmailSubscription = this.collaborationWorkflowUserOrEmail$.subscribe(selection => {
      if (selection) {
        this.handlePickerSelection(selection);
      }
    });
    this.collaborationWorkflowUsersSubscription = this.collaborationWorkflowUsers$.subscribe(users => {
      if (users) {
        this.collaborationWorkflowUsers = users;
      }
    });
  }

  ngOnDestroy() {
    this.collaborationWorkflowUserOrEmailSubscription.unsubscribe();
  }

  nonPfUserFormSubmit(): void {
    this.nonPfUserFormSubmitted = true;
    if (this.addNonPfUserForm.valid) {
      this.addNonPfUserToWorkflow(this.addNonPfUserForm.value.firstname, this.addNonPfUserForm.value.lastname);
    }
  }

  addNonPfUserToWorkflow(firstName: string, lastName: string) {
    const addUserToWorkflowObj: AddUserToWorkflowObj = {
      FirstName: firstName,
      LastName: lastName,
      EmailAddress: this.currentEmail,
      JobIds: this.jobIds,
      IsNonPfUser: true,
      Permissions: WorkflowConfigHelper.getDefaultPermissions()
    };
    this.showNonPFUserNameForm = false;
    this.sharedJdmStore.dispatch(new fromCollaborationWorkflowConfigActions.AddNonPfUserToCollaborationWorkflow(addUserToWorkflowObj));
  }

  cancelNonPfUserAdd(): void {
    this.showNonPFUserNameForm = false;
    this.currentEmail = '';
  }

  handlePickerSelection(selectedUser: WorkflowUser): void {
    if (this.collaborationWorkflowUsers.some(user => user.EmailAddress.toLowerCase() === selectedUser.EmailAddress.toLowerCase())) {
      this.duplicateCollaborationEmail = true;
      return;
    } else {
      this.duplicateCollaborationEmail = false;
    }

    if (!selectedUser.FirstName || !selectedUser.LastName) {
      this.addNonPfUserForm.reset();
      this.nonPfUserFormSubmitted = false;
      this.showNonPFUserNameForm = true;
      this.currentEmail = selectedUser.EmailAddress;
    } else {
      const workflowUser: WorkflowUser = {
        ...selectedUser,
        Permissions: WorkflowConfigHelper.getDefaultPermissions()
      };

      this.sharedJdmStore.dispatch(new fromCollaborationWorkflowConfigActions.AddSelectedUserOrEmailToCollaborationWorkflow(workflowUser));
    }
  }

  handleRemoveClicked(user: WorkflowUser) {
    this.sharedJdmStore.dispatch(new fromCollaborationWorkflowConfigActions.DeleteUserOrEmailFromCollaborationWorkflow(user));
  }

  getUserInitials(user: WorkflowUser): string {
    return `${user.FirstName.substring(0, 1)}${user.LastName.substring(0, 1)}`.toUpperCase();
  }

  isUserImg(user: WorkflowUser) {
    return user.UserPicture && user.UserPicture !== 'default_user.png';
  }

  getDisplayName(user: WorkflowUser): string {
    return user.UserId ? `${user.FirstName} ${user.LastName}` : user.EmailAddress;
  }

  showDisplayNameTooltip(user: WorkflowUser, ngbTooltip: NgbTooltip) {
    const displayName = this.getDisplayName(user);

    if (displayName.trim().length > this.displayNameThreshold) {
      ngbTooltip.open();
    }
  }

  hideDisplayNameTooltip(ngbTooltip: NgbTooltip) {
    if (ngbTooltip.isOpen()) {
      ngbTooltip.close();
    }
  }

  private buildNonPfUserForm() {
    this.addNonPfUserForm = this.formBuilder.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required]
    });
  }
}
