import { TableauReportResponse } from 'libs/models/payfactors-api';

import { StandardReport, Workbook } from '../models';

export class PayfactorsApiModelMapper {

  static mapTableauReportResponsesToStandardReports(response: TableauReportResponse[]): StandardReport[] {
    return response.map(tr => {
      return {
        Id: tr.WorkbookId,
        Name: tr.WorkbookName,
        ThumbnailUrl: tr.Thumbnail
      };
    });
  }

  static mapTableauReportResponsesToWorkbooks(response: TableauReportResponse[]): Workbook[] {
    return response.map(r => {
      return {
        WorkbookId: r.WorkbookId,
        WorkbookName: r.WorkbookName,
        Thumbnail: r.Thumbnail,
        WorkbookDescription: r.WorkbookDescription,
        ContentUrl: r.ContentUrl,
        ShowTabs: r.ShowTabs,
        IconClass: r.IconClass,
        Tag: r.Tag,
        IsFavorite: r.IsFavorite
      };
    });
  }
}
