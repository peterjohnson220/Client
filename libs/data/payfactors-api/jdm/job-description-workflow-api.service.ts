import { Injectable } from '@angular/core';
import { PayfactorsApiService } from '../payfactors-api.service';


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
}

