import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { PayfactorsApiService } from '../payfactors-api.service';
import { WorkflowTemplate } from 'libs/features/jobs/job-description-management/models';

@Injectable({
  providedIn: 'root',
})
export class JobDescriptionWorkflowTemplateApiService {
  private apiUrl = 'WorkflowTemplate';

  constructor(private payfactorsApiService: PayfactorsApiService) {}

  getTemplateList(): Observable<WorkflowTemplate[]> {
    return this.payfactorsApiService.get(`${this.apiUrl}/Default.GetList`);
  }

  getTemplateListWithJobFilter(jobIds: number[]) {
    return this.payfactorsApiService.post<any>(`${this.apiUrl}/Default.GetFilteredList`, {jobIds: jobIds});
  }

  saveTemplate(workflowTemplate: any) {
    return this.payfactorsApiService.post(`${this.apiUrl}/Default.Upsert`, {workflowTemplate: workflowTemplate});
  }

  deleteTemplate(workflowTemplateId: string) {
    return this.payfactorsApiService.post(`${this.apiUrl}/Default.Delete`, {id: workflowTemplateId});
  }
}
