import { WorkflowUser } from './workflow-user.model';

export interface WorkflowStep {
  WorkflowStepUsers: WorkflowUser[];
  Permissions: any[];
}
