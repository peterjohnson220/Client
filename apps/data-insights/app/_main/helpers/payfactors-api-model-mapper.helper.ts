import { TableauReportResponse, UpsertUserReportTag, SaveWorkbookOrderRequest,
  TableauReportViewsResponse
} from 'libs/models/payfactors-api';
import { WorkbookOrderType } from 'libs/constants';

import { SaveWorkbookTagObj, StandardReport, Workbook, DashboardView, View } from '../models';

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

  static mapTableauReportViewsResponsesToViews(response: TableauReportViewsResponse[]): View[] {
    return response.map(r => {
      return {
        ContentUrl: r.ContentUrl,
        ViewId: r.ViewId,
        ViewName: r.ViewName
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

  static buildSaveWorkbookOrderRequest(workbookIds: string[], view: DashboardView,
    typeOverride?: WorkbookOrderType): SaveWorkbookOrderRequest {
    const typeByView = view === DashboardView.All
      ? WorkbookOrderType.DashboardsOrdering
      : WorkbookOrderType.FavoritesOrdering;
    const workbookOrderType = !!typeOverride ? typeOverride : typeByView;
    return {
      WorkbookIds: workbookIds,
      Type: workbookOrderType
    };
  }

}
