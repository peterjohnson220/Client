export interface CreateJobDescriptionRequest {
  companyJobId: number;
  appliesToField: string;
  appliesToValue: string;
  jobDescriptionTitle: string;
  publicView: boolean;
}
