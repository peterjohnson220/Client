import { Permissions } from 'libs/constants/permissions';

import { WorkflowUser, AddUserToWorkflowObj, WorkflowStep } from '../models';

export class WorkflowConfigHelper {

  static buildWorkflowUser(addUserToWorkflowObj: AddUserToWorkflowObj, permission: boolean): WorkflowUser {
    const permissions = permission
      ? [ Permissions.JOB_DESCRIPTIONS, Permissions.CAN_EDIT_JOB_DESCRIPTION ]
      : [];
    return {
      FirstName: addUserToWorkflowObj.FirstName,
      LastName: addUserToWorkflowObj.LastName,
      EmailAddress: addUserToWorkflowObj.EmailAddress,
      Permissions: permissions,
      IsNonPfUser: addUserToWorkflowObj.IsNonPfUser
    };
  }

  static getDefaultPermissions(): any[] {
    return [
      { permission: Permissions.JOB_DESCRIPTIONS, selected: true, display: 'View', disabled: true },
      { permission: Permissions.CAN_EDIT_JOB_DESCRIPTION, selected: false, display: 'Edit', disabled: false }
    ];
  }

  static hasUsersWithNoPermission(steps: WorkflowStep[]): boolean {
    for (let i = 0; i < steps.length; i++) {
      for (let j = 0; j < steps[i].WorkflowStepUsers.length; j++) {
        if (steps[i].WorkflowStepUsers[j].Permissions && steps[i].WorkflowStepUsers[j].Permissions.length === 0) {
          return true;
        }
      }
    }
    return false;
  }
}
