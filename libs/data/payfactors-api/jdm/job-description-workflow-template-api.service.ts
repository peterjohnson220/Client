import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { PayfactorsApiService } from '../payfactors-api.service';
import { WorkflowTemplate } from 'apps/job-description-management/app/shared/models';

@Injectable()
export class JobDescriptionWorkflowTemplateApiService {
  private apiUrl = 'WorkflowTemplate';

  constructor(private payfactorsApiService: PayfactorsApiService) {}

  getTemplateList(): Observable<WorkflowTemplate[]> {
    return this.payfactorsApiService.get(`${this.apiUrl}/Default.GetList`);
  }

  getTemplateListWithJobFilter(jobId: number) {
    return this.payfactorsApiService.get(`${this.apiUrl}/Default.GetFilteredList`, {params: {jobId: jobId}});
  }

  saveTemplate(workflowTemplate: any) {
    return this.payfactorsApiService.post(`${this.apiUrl}/Default.Upsert`, {workflowTemplate: workflowTemplate});
  }

  deleteTemplate(workflowTemplateId: string) {
    return this.payfactorsApiService.post(`${this.apiUrl}/Default.Delete`, {id: workflowTemplateId});
  }
}
