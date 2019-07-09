import { TableauReportResponse, UpsertUserReportTag } from 'libs/models/payfactors-api';

import { SaveWorkbookTagObj, StandardReport, Workbook } from '../models';

export class PayfactorsApiModelMapper {


  /// IN
  static mapTableauReportResponsesToStandardReports(response: TableauReportResponse[]): StandardReport[] {
    return response.map(tr => {
      return {
        Id: tr.WorkbookId,
        Name: tr.WorkbookName,
        ThumbnailUrl: tr.Thumbnail,
        ContentUrl: tr.ContentUrl,
        ShowTabs: tr.ShowTabs
      };
    });
  }

  static mapTableauReportResponsesToWorkbooks(response: TableauReportResponse[], companyName: string): Workbook[] {
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
        IsFavorite: r.IsFavorite,
        DefaultTag: `${companyName} Reports`
      };
    });
  }


  /// OUT
  static mapSaveWorkbookTagObjToUpsertUserReportTag(saveWorkbookTagObj: SaveWorkbookTagObj): UpsertUserReportTag {
    return  {
      WorkbookId: saveWorkbookTagObj.WorkbookId,
      Tag: saveWorkbookTagObj.Tag
    };
  }

}
