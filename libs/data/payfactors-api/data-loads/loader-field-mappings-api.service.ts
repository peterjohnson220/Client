import { Injectable } from '@angular/core';

import { of, Observable } from 'rxjs';
import { OrgDataEntityType } from 'libs/constants';
import {FileUploadHeaderRequestModel} from 'libs/features/org-data-loader/models';
import { LoaderFieldSet, FieldMappingsDTO } from 'libs/models/data-loads/index';


import { PayfactorsApiService } from '../payfactors-api.service';

@Injectable({
  providedIn: 'root',
})
export class LoaderFieldMappingsApiService {
  private endpoint = 'LoaderFieldMappings';

  constructor(
    private payfactorsApiService: PayfactorsApiService
  ) {}

  getCustomJobFields(companyId: number) {
    return this.payfactorsApiService.get<any[]>(`${this.endpoint}/GetCustomJobFields`, {
      params: {companyId: companyId}
    });
  }

  getCustomEmployeeFields(companyId: number) {
    return this.payfactorsApiService.get<any[]>(`${this.endpoint}/GetCustomEmployeeFields`, {
      params: {companyId: companyId}
    });
  }

  getCompanyFieldMappings(companyId: number, loaderConfigurationGroupId?: number) {
    return this.payfactorsApiService.get<LoaderFieldSet[]>(`${this.endpoint}/GetCompanyFieldMappings`, {
      params: {companyId: companyId, loaderConfigurationGroupId: loaderConfigurationGroupId}
    });
  }

  saveFieldMappings(mappingsDto: FieldMappingsDTO) {
    return this.payfactorsApiService.post(`${this.endpoint}.SaveFieldMappings`, mappingsDto);
  }

  getFileUploadColumnNames(fileUpload: FileUploadHeaderRequestModel) {
    return this.payfactorsApiService.postFormData(`${this.endpoint}.UploadAndGetColumnNames`, fileUpload);
  }

  getCustomFieldsByEntity(entity: string, companyId: number) {
    let result: Observable<any[]>;
    switch (entity) {
      case OrgDataEntityType.Employees: {
        result = this.getCustomEmployeeFields(companyId);
        break;
      }
      case OrgDataEntityType.Jobs: {
        result = this.getCustomJobFields(companyId);
        break;
      }
      default: {
        result =  of([]);
        break;
      }
    }

    return result;
  }
}
