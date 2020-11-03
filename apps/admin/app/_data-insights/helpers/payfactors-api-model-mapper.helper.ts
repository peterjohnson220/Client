import {  ReportDetailsResponse, UpdatePayfactorsReportDetailsRequest } from 'libs/models/payfactors-api';

import { StandardReportDetails, EditReportFormData } from '../models';

export class PayfactorsApiModelMapper {


  /// IN
  static mapReportDetailsResponseToStandardReportDetails(response: ReportDetailsResponse[]): StandardReportDetails[] {
    return response.map(tr => {
      return {
        Id: tr.Id,
        Name: tr.Name,
        DisplayName: tr.DisplayName,
        CreateDate: tr.CreateDate,
        EditDate: tr.EditDate,
        Summary: tr.Summary,
        Site: tr.Site,
        LastEditedBy: tr.LastEditedBy,
        ThumbnailUrl: tr.Thumbnail
      };
    });
  }

  static updateStandardReportDetails(target: StandardReportDetails, source: StandardReportDetails): StandardReportDetails {
    target.DisplayName = source.DisplayName;
    target.Summary = source.Summary;
    target.ThumbnailUrl = source.ThumbnailUrl;
    target.EditDate = source.EditDate;
    target.LastEditedBy = source.LastEditedBy;
    return target;
  }

  // OUT
  static mapEditReportFormDataToUpdatePayfactorsReportDetailsRequest(data: EditReportFormData): UpdatePayfactorsReportDetailsRequest {
    return {
      WorkbookId: data.WorkbookId,
      DisplayName: data.DisplayName,
      Summary: data.Summary,
      ThumbnailUrl: data.ThumbnailUrl
    };
  }

}
