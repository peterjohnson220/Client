import { JobInformationFieldForBulkExportResponse, JobDescriptionViewApi,  UpdateViewsRequest } from 'libs/models/payfactors-api';

import { JobInfoViewField, JobDescriptionView } from '../models';

export class PayfactorsApiModelMapper {
  // IN
  static mapJobInformationFieldResponseToJobInfoViewField(response: JobInformationFieldForBulkExportResponse[]): JobInfoViewField[] {
    return response.map(r => {
      return {
        Id: r.Id,
        Name: r.DisplayName,
        Checked: r.IsRequired || r.IsDefault,
        Locked: r.IsRequired
      };
    });
  }

  static mapTemplateViewsResponseToJobDescriptionView(response: JobDescriptionViewApi[]): JobDescriptionView[] {
    return response.map(r => {
      return {
        Id: r.Id,
        CompanyId: r.CompanyId,
        Name: r.Name,
        TemplateId: r.TemplateId,
        HiddenElementIds: r.HiddenElementIds,
        JobInformationFields: r.JobInformationFields,
        Template: r.Template
      };
    });
  }

  // OUT
  static mapJobDescriptionViewsToRequestModel(jobDescriptionViews: JobDescriptionView[], selectedJobInformationFields: JobInfoViewField[]): UpdateViewsRequest {
    return {
      Views: jobDescriptionViews.map(v => {
        return {
          CompanyId: v.CompanyId,
          HiddenElementIds: v.HiddenElementIds,
          Id: v.Id,
          JobInformationFields: selectedJobInformationFields.map(ji => ji.Id),
          Name: v.Name,
          TemplateId: v.TemplateId
        };
      })
    };
  }
}
