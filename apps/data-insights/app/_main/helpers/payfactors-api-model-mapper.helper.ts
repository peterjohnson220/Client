import { TableauReportResponse, UpsertUserReportTag, SaveWorkbookOrderRequest } from 'libs/models/payfactors-api';
import { WorkbookOrderType } from 'libs/constants';

import { SaveWorkbookTagObj, StandardReport, Workbook, DashboardView } from '../models';

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
        DefaultTag: `${companyName} Reports`,
        DashboardsOrder: r.DashboardsOrder,
        FavoritesOrder: r.FavoritesOrder
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

  static buildSaveWorkbookOrderRequest(workbookIds: string[], view: DashboardView): SaveWorkbookOrderRequest {
    const workbookOrderType = view === DashboardView.All
      ? WorkbookOrderType.DashboardsOrdering
      : WorkbookOrderType.FavoritesOrdering;
    return {
      WorkbookIds: workbookIds,
      Type: workbookOrderType
    };
  }

}
