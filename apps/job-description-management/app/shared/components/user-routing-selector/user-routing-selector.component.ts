import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { UserContext } from 'libs/models/security';
import * as fromRootState from 'libs/state/state';

import * as fromJobDescriptionManagementSharedReducer from 'libs/features/job-description-management/reducers';
import * as fromSharedWorkflowActions from 'libs/features/job-description-management/actions/shared-workflow.actions';

import { WorkflowUser } from 'libs/features/job-description-management/models';

@Component({
  selector: 'pf-user-routing-selector',
  templateUrl: './user-routing-selector.component.html',
  styleUrls: ['./user-routing-selector.component.scss']
})
export class UserRoutingSelectorComponent implements OnInit {
  @Input() isLastWorkflowStep: boolean;
  @Input() currentStepUserName: string;

  // Observables
  identity$: Observable<UserContext>;
  newUser$: Observable<WorkflowUser>;

  // local variables
  showNameForm: boolean;
  nonPfUserFormSubmitted: boolean;
  currentEmail: string;
  avatarUrl: string;
  addNonPfUserForm: FormGroup;

  constructor(
    private userContextStore: Store<fromRootState.State>,
    private sharedStore: Store<fromJobDescriptionManagementSharedReducer.State>,
    private formBuilder: FormBuilder
  ) {
    this.identity$ = this.userContextStore.select(fromRootState.getUserContext);
    this.newUser$ = this.sharedStore.select(fromJobDescriptionManagementSharedReducer.getNewUser);
  }

  addNonUserToWorkflow(firstName: string, lastName: string) {
    const nonPfUser: WorkflowUser = {
      FirstName: firstName,
      LastName: lastName,
      EmailAddress: this.currentEmail,
      Permissions: null,
      IsNonPfUser: true
    };

    this.setNewUserForStep(nonPfUser);
    this.showNameForm = false;
  }

  setNewUserForStep(workflowUser: WorkflowUser) {
    this.sharedStore.dispatch(new fromSharedWorkflowActions.SetNewUser({user: workflowUser}));
  }

  clearNewUserForStep() {
    this.sharedStore.dispatch(new fromSharedWorkflowActions.SetNewUser({user: null}));
  }

  cancelNonPfUserAdd() {
    this.showNameForm = false;
    this.currentEmail = '';
    return false;
  }

  updateNewUserPermission(permission: string, selected: boolean) {
    this.sharedStore.dispatch(new fromSharedWorkflowActions.SetNewUserPermissions({permission: permission, selected: selected}));
  }

  buildNonPfUserForm() {
    this.addNonPfUserForm = this.formBuilder.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required]
    });
  }

  // Events
  handlePickerSelection(selectedUser: any) {
    if (!selectedUser.FirstName || !selectedUser.LastName) {
      this.addNonPfUserForm.reset();
      this.nonPfUserFormSubmitted = false;
      this.showNameForm = true;
      this.currentEmail = selectedUser.EmailAddress;
    } else {
      const workflowUser: WorkflowUser = {
        FirstName: selectedUser.FirstName,
        LastName: selectedUser.LastName,
        EmailAddress: selectedUser.EmailAddress,
        Permissions: [],
        IsNonPfUser: false
      };
      this.setNewUserForStep(workflowUser);
    }
  }

  nonPfUserFormSubmit() {
    this.nonPfUserFormSubmitted = true;
    if (this.addNonPfUserForm.valid) {
      this.addNonUserToWorkflow(this.addNonPfUserForm.value.firstname, this.addNonPfUserForm.value.lastname);
    }
  }


  // Lifecycle
  ngOnInit() {
    this.sharedStore.dispatch(new fromSharedWorkflowActions.ResetNewUser());

    this.identity$.subscribe(i => {
      this.avatarUrl = i.ConfigSettings.find(c => c.Name === 'CloudFiles_PublicBaseUrl').Value + '/avatars/';
    });

    this.buildNonPfUserForm();
  }
}
