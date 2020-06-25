import { WorkflowStep } from 'libs/features/job-description-management';

export interface Workflow {
  EntityType: string;
  EntityId: number;
  EntityTitle: string;
  Revision: number;
  WorkflowUrl: string;
  WorkflowSteps: WorkflowStep[];
  InitiationComment: string;
  AllAvailablePermissions: string[];
}
