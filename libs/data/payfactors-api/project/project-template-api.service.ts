import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { PayfactorsApiService } from '../payfactors-api.service';
import { ProjectTemplateFieldsResponse, ProjectTemplate } from 'libs/models';
import { SaveProjectTemplateRequest } from 'libs/models/payfactors-api';

@Injectable({
  providedIn: 'root',
})
// TODO: migrate api calls to new "project-templates-api" service. This service is deprecated because it uses the old PfODataController.
//  The new service uses PfController
export class ProjectTemplateApiService {
  private endpoint = 'ProjectTemplate';

  constructor(
    private payfactorsApiService: PayfactorsApiService
  ) {}

  delete(templateId: number): Observable<any> {
    return this.payfactorsApiService.delete(`${this.endpoint}(${templateId})`);
  }

  getProjectTemplateFields(templateId: number = 0): Observable<ProjectTemplateFieldsResponse> {
    return this.payfactorsApiService.get(`${this.endpoint}(${templateId})/Default.GetProjectTemplateFields`);
  }

  saveProjectTemplate(request: SaveProjectTemplateRequest, templateId: number = 0): Observable<any> {
    return this.payfactorsApiService.post(`${this.endpoint}(${templateId || 0})/Default.SaveProjectTemplate`, request);
  }
}
