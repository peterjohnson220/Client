import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { PayfactorsApiService } from '../payfactors-api.service';
import { SaveCompanyJobsJobDescriptionTemplateIdRequest } from '../../../models/payfactors-api/job-description-template/request';
import { TemplateListItemResponse } from '../../../models/payfactors-api/job-description-template/response';
import {
  LoadTemplateListByCompanyIdRequest
} from 'apps/job-description-management/app/shared/models/requests/load-template-list-by-company-id.request.model';
import {Template} from 'apps/job-description-management/app/_templates/models';

@Injectable()
export class JobDescriptionTemplateApiService {
  private endpoint = 'JobDescriptionTemplate';

  constructor(private payfactorsApiService: PayfactorsApiService) {
  }

  copy(templateId: number, templateName: string) {
    return this.payfactorsApiService.post(`${this.endpoint}(${templateId})/Default.Copy`, { templateName: templateName});
  }

  delete(templateId: number) {
    return this.payfactorsApiService.delete(`${this.endpoint}(${templateId})`);
  }

  exists(templateName: string) {
    return this.payfactorsApiService.get(`${this.endpoint}/Default.TemplateExists?templateName=` + templateName);
  }

  get(): Observable<TemplateListItemResponse[]> {
    return this.payfactorsApiService.get<TemplateListItemResponse[]>(`${this.endpoint}`);
  }

  getPublished(): Observable<TemplateListItemResponse[]> {
    return this.payfactorsApiService.get<TemplateListItemResponse[]>(`${this.endpoint}`, {params: {publishedOnly: true}});
  }

  getByCompanyId(loadTemplateListByCompanyIdRequest: LoadTemplateListByCompanyIdRequest): Observable<TemplateListItemResponse[]> {
    return this.payfactorsApiService.get<TemplateListItemResponse[]>(this.endpoint + `/Default.GetByCompanyId`,
      {params: {...loadTemplateListByCompanyIdRequest}});
  }

  save(template: Template) {
    return this.payfactorsApiService.post(this.endpoint + `/Default.Save`,
      {templateJsonAsString: JSON.stringify(template)});
  }

  saveCompanyJobsJobDescriptionTemplateId(templateId: number, request: SaveCompanyJobsJobDescriptionTemplateIdRequest): Observable<any> {
    return this.payfactorsApiService.post<any>(`${this.endpoint}(${templateId})/Default.SaveCompanyJobsJobDescriptionTemplateId`,
      request);
  }

  getTemplatesWithControlType(controlType: string) {
      const params = { params: { controlType } };
      return this.payfactorsApiService.get(`${this.endpoint}/Default.GetTemplatesWithControlType`, params);
  }

}
