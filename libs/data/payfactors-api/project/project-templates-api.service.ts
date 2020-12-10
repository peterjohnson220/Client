import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { PayfactorsApiService } from '../payfactors-api.service';
import { ProjectTemplate, ProjectTemplateFields } from 'libs/models';
import { SaveProjectTemplateRequest } from 'libs/models/payfactors-api';

@Injectable({
  providedIn: 'root',
})
export class ProjectTemplatesApiService {
  private endpoint = 'ProjectTemplate';

  constructor(
    private payfactorsApiService: PayfactorsApiService
  ) {}

  delete(templateId: number): Observable<any> {
    return this.payfactorsApiService.delete(`${this.endpoint}(${templateId})`);
  }

  getProjectTemplates(): Observable<ProjectTemplate[]> {
    return this.payfactorsApiService.get(`${this.endpoint}/Default.GetProjectTemplates`);
  }

  getProjectTemplateFields(templateId: number = 0): Observable<ProjectTemplateFields> {
    return this.payfactorsApiService.get(`${this.endpoint}(${templateId})/Default.GetProjectTemplateFields`);
  }

  saveProjectTemplate(request: SaveProjectTemplateRequest, templateId: number = 0): Observable<any> {
    return this.payfactorsApiService.post(`${this.endpoint}(${templateId || 0})/Default.SaveProjectTemplate`, request);
  }
}
