import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { PayfactorsApiService } from '../payfactors-api.service';
import { ProjectTemplate } from '../../../models/projects/project-templates';

@Injectable({
  providedIn: 'root',
})
export class ProjectTemplatesApiService {
  private endpoint = 'ProjectTemplates';

  constructor(private payfactorsApiService: PayfactorsApiService) { }

  getProjectTemplates(): Observable<ProjectTemplate[]> {
    return this.payfactorsApiService.get(`${this.endpoint}/GetProjectTemplates`);
  }
}
