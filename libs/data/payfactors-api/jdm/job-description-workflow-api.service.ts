import { Injectable } from '@angular/core';
import { NewLinePipe } from 'libs/core/pipes';
import { PayfactorsApiService } from '../payfactors-api.service';
import { WorkflowUser } from 'libs/features/jobs/job-description-management/models';


@Injectable({
  providedIn: 'root',
})
export class JobDescriptionWorkflowApiService {
  private apiUrl = 'Workflow';
  private convertNewLinePipe;
  constructor(private payfactorsApiService: PayfactorsApiService) {
    this.convertNewLinePipe = new NewLinePipe();
  }

  getWorkflowStepInfoFromToken(token: string) {
    return this.payfactorsApiService.get(`${this.apiUrl}/Default.GetWorkflowStepInfoFromToken`,
      { params: { token : token}});
  }

  getStepSummary(workflowId: number) {
    return this.payfactorsApiService.get(`${this.apiUrl}(${workflowId})/Default.GetStepSummary`);
  }

  getWorkflowLink(workflowId: number) {
    return this.payfactorsApiService.get(`${this.apiUrl}(${workflowId})/Default.GetWorkflowLink`);
  }

  getRoutingHistory(entityId: number, revisionNumber: number, entityType: string) {
    return this.payfactorsApiService.get(`${this.apiUrl}/Default.GetRoutingHistory`,
      { params: { entityId, revisionNumber, entityType }
      });
  }

  cancel(workflowId: number, comment: string) {
    comment = this.convertNewLinePipe.transform(comment);
    return this.payfactorsApiService.post(`${this.apiUrl}(${workflowId})/Default.Cancel`, {comment: comment},
      (response) => JSON.parse(response.value));
  }

  create(workflow: any) {
    return this.payfactorsApiService.post(`${this.apiUrl}/Default.Create`, { workflow: workflow });
  }

  completeStep(workflowId: number, willProceed: boolean, comment: string) {
    comment = this.convertNewLinePipe.transform(comment);
    return this.payfactorsApiService.post(`${this.apiUrl}(${workflowId})/Default.CompleteStep`, { willProceed: willProceed, comment: comment });
  }

  routeStepToNewUser(workflowId: number, newUser: WorkflowUser, comment: string) {
    comment = this.convertNewLinePipe.transform(comment);
    return this.payfactorsApiService.post(`${this.apiUrl}(${workflowId})/Default.RerouteStep`, { newUser: newUser, comment: comment });
  }

  resendEmail(workflowId: number) {
    return this.payfactorsApiService.post(`${this.apiUrl}(${workflowId})/Default.ResendEmail`);
  }

}
