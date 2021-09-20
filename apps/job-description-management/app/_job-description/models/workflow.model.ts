import { WorkflowStep } from 'libs/features/jobs/job-description-management';
import { JobDescriptionWorkflowAttachment } from 'libs/models/jdm/job-description-workflow-attachment';

export interface Workflow {
  EntityType: string;
  EntityId: number;
  EntityTitle: string;
  Revision: number;
  WorkflowUrl: string;
  WorkflowSteps: WorkflowStep[];
  InitiationComment: string;
  AllAvailablePermissions: string[];
  Attachments: JobDescriptionWorkflowAttachment[];
}
