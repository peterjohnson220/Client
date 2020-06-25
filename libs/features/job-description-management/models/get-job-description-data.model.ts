export interface GetJobDescriptionData {
  JobDescriptionId: number;
  RevisionNumber?: number;
  ViewName?: string;
  InWorkflow?: boolean;
  InHistory?: boolean;
}
