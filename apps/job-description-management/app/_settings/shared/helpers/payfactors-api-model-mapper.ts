import { JobInformationFieldForBulkExportResponse,
  JobDescriptionViewApi,
  UpdateViewsRequest,
  FooterViewRequest } from 'libs/models/payfactors-api';

import { JobInfoViewField } from '../../view-edit/models';
import { JobDescriptionView } from '../models';
import { FooterViewModel } from '../../footer-view/models';

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
        HiddenControlNameElementIds: r.HiddenControlNameElementIds,
        HiddenSubHeadingElementIds: r.HiddenSubHeadingElementIds,
        JobInformationFields: r.JobInformationFields,
        Template: r.Template
      };
    });
  }

  // OUT
  static mapJobDescriptionViewsToRequestModel(jobDescriptionViews: JobDescriptionView[],
                                              selectedJobInformationFields?: JobInfoViewField[]): UpdateViewsRequest {
    return {
      Views: jobDescriptionViews.map(v => {
        return {
          CompanyId: v.CompanyId,
          HiddenElementIds: v.HiddenElementIds,
          HiddenControlNameElementIds: v.HiddenControlNameElementIds,
          HiddenSubHeadingElementIds: v.HiddenSubHeadingElementIds,
          Id: v.Id,
          JobInformationFields: selectedJobInformationFields !== undefined
                                ? selectedJobInformationFields.map(ji => ji.Id)
                                : v.JobInformationFields,
          Name: v.Name,
          TemplateId: v.TemplateId
        };
      })
    };
  }

  static mapFooterViewModelToRequest(footerViewModel: FooterViewModel): FooterViewRequest {
    return {
      CreatedByField: footerViewModel.CreatedByField,
      CreatedDateField: footerViewModel.CreatedDateField,
      CreatedDateFormatField: footerViewModel.CreatedDateFormatField,
      VersionNumberField: footerViewModel.VersionNumberField,
      PageNumberField: footerViewModel.PageNumberField,
      CustomTextField: footerViewModel.CustomTextField,
      CustomTextValueField: footerViewModel.CustomTextValueField
    };
  }
}
