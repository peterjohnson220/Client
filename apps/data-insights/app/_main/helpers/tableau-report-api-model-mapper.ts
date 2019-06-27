import { TableauReportResponse } from 'libs/models/payfactors-api/data-insights/response';

import { TableauReport } from '../models';

export class TableauReportApiModelMapper {

  static mapTableauReportResponseToTableauReport(reports: TableauReportResponse[]): TableauReport[] {
    return reports.map(r => {
      return {
        WorkbookId: r.WorkbookId,
        WorkbookName: r.WorkbookName,
        Thumbnail: r.Thumbnail,
        WorkbookDescription: r.WorkbookDescription,
        ContentUrl: r.ContentUrl,
        ShowTabs: r.ShowTabs,
        IconClass: r.IconClass,
        Tag: r.Tag
      };
    });
  }
}
