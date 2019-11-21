import { WorkflowStep } from './workflow-step.model';

export interface WorkflowTemplate {
  Id: string;
  Name: string;
  Steps: WorkflowStep[];
  AllAvailablePermissions: string[];
}
