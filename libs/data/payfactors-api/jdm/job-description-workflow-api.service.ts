import { Injectable } from '@angular/core';
import { PayfactorsApiService } from '../payfactors-api.service';
import { WorkflowUser } from 'libs/features/job-description-management/models';


@Injectable()
export class JobDescriptionWorkflowApiService {
  private apiUrl = 'Workflow';

  constructor(private payfactorsApiService: PayfactorsApiService) {}

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
    return this.payfactorsApiService.post(`${this.apiUrl}(${workflowId})/Default.Cancel`, {comment: comment},
      (response) => JSON.parse(response.value));
  }

  create(workflow: any) {
    return this.payfactorsApiService.post(`${this.apiUrl}/Default.Create`, { workflow: workflow });
  }

  completeStep(workflowId: number, willProceed: boolean, comment: string) {
    return this.payfactorsApiService.post(`${this.apiUrl}(${workflowId})/Default.CompleteStep`, { willProceed: willProceed, comment: comment });
  }

  routeStepToNewUser(workflowId: number, newUser: WorkflowUser, comment: string) {
    return this.payfactorsApiService.post(`${this.apiUrl}(${workflowId})/Default.RerouteStep`, { newUser: newUser, comment: comment });
  }

}

