import {
  SaveWorkbookOrderRequest,
  TableauReportViewsResponse,
  UpsertUserReportTag
} from 'libs/models/payfactors-api';
import { WorkbookOrderType } from 'libs/constants';
import { View } from 'libs/features/surveys/reports/models';
import { ReportsPayfactorsApiModelMapper } from 'libs/features/surveys/reports/helpers';

import { DashboardView, SaveWorkbookTagObj } from '../models';

export class PayfactorsApiModelMapper extends  ReportsPayfactorsApiModelMapper {
  static mapTableauReportViewsResponsesToViews(response: TableauReportViewsResponse[]): View[] {
    return response.map(r => {
      return {
        ContentUrl: r.ContentUrl,
        ViewId: r.ViewId,
        ViewName: r.ViewName,
        ViewThumbnail: r.ViewThumbnail,
        IsFavorite: r.IsFavorite,
        ViewsOrder: r.ViewsOrder,
        FavoritesOrder: r.FavoritesOrder,
        WorkbookId: r.WorkbookId
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
