import {  ReportDetailsResponse } from 'libs/models/payfactors-api';

import { StandardReportDetails } from '../models';

export class PayfactorsApiModelMapper {


  /// IN
  static mapReportDetailsResponseToStandardReportDetails(response: ReportDetailsResponse[]): StandardReportDetails[] {
    return response.map(tr => {
      return {
        Id: tr.Id,
        Name: tr.Name,
        CreateDate: tr.CreateDate,
        EditDate: tr.EditDate,
        Summary: tr.Summary,
        LastEditedBy: tr.LastEditedBy,
        ThumbnailUrl: tr.Thumbnail
      };
    });
  }

}
