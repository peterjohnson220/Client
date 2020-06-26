import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { PayfactorsApiService } from '../payfactors-api.service';
import {
  SaveCompanyJobsJobDescriptionTemplateIdRequest,
  TemplateListItemResponse,
  LoadTemplateListByCompanyIdRequest } from '../../../models/payfactors-api';
import { Template, TemplateSettings } from '../../../models/jdm';


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

  publishAsync(template: Template): Observable<any> {
    return this.payfactorsApiService.post(`${this.endpoint}(${template.TemplateId})/Default.PublishAsync`, { templateName: template.TemplateName});
  }

  saveCompanyJobsJobDescriptionTemplateId(templateId: number, request: SaveCompanyJobsJobDescriptionTemplateIdRequest): Observable<any> {
    return this.payfactorsApiService.post<any>(`${this.endpoint}(${templateId})/Default.SaveCompanyJobsJobDescriptionTemplateId`,
      request);
  }

  getTemplatesWithControlType(controlType: string) {
      const params = { params: { controlType } };
      return this.payfactorsApiService.get(`${this.endpoint}/Default.GetTemplatesWithControlType`, params);
  }

  getDetail(templateId: number): Observable<Template> {
      return this.payfactorsApiService.get(`${this.endpoint}(${templateId})/Default.GetDetail`, {}, (response) => JSON.parse(response.value));
  }

  getTemplateAssignmentSummary(templateId: number) {
      return this.payfactorsApiService.get(`${this.endpoint}(${templateId})/Default.GetTemplateAssignmentSummary`);
  }

  saveTemplateName(templateId: number, templateName: string) {
    return this.payfactorsApiService.post(`${this.endpoint}(${templateId})/Default.SaveTemplateName`, { templateName: templateName});
  }

  getAvailableJobInformationFields() {
      return this.payfactorsApiService.get(`${this.endpoint}/Default.GetAvailableJobInformationFields`);
  }

  getSettings(templateId: number) {
      return this.payfactorsApiService.get(`${this.endpoint}(${templateId})/Default.GetSettings`);
  }

  saveSettings(settings: TemplateSettings) {
      const obj = {
          templateSettingsJsonAsString: JSON.stringify(settings)
      };
      return this.payfactorsApiService.post(`${this.endpoint}(${settings.TemplateId})/Default.SaveSettings`, obj)
      .map((payload: string) => JSON.parse(payload));
  }

  publish(templateId: number) {
      return this.payfactorsApiService.post(`${this.endpoint}(${templateId})/Default.Publish`);
  }

  controlLabelExists(templateId: number, controlLabel: string) {
      return this.payfactorsApiService.get(`${this.endpoint}(${templateId})/Default.ControlLabelExists?controlLabel=${controlLabel}`);
  }

  discardDraft(templateId: number) {
      return this.payfactorsApiService.post(`${this.endpoint}(${templateId})/Default.DiscardDraft`, {},
      (payload: string) => payload.length ? JSON.parse(payload) : '');
  }


}
