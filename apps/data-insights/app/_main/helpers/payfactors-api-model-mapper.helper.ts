import {
  DataViewEntityResponse,
  SaveWorkbookOrderRequest,
  TableauReportResponse,
  TableauReportViewsResponse,
  UpsertUserReportTag,
  UserDataViewResponse
} from 'libs/models/payfactors-api';
import { WorkbookOrderType } from 'libs/constants';

import { DashboardView, Entity, ReportType, SaveWorkbookTagObj, UserDataView, View, Workbook } from '../models';

export class PayfactorsApiModelMapper {


  /// IN
  static mapTableauReportResponsesToWorkbooks(response: TableauReportResponse[], companyName?: string): Workbook[] {
    return response.map(r => {
      return {
        Type: r.ReportType === 'TableauReport' ? ReportType.TableauReport : ReportType.DataView,
        WorkbookId: r.WorkbookId,
        WorkbookName: r.WorkbookName,
        Thumbnail: r.Thumbnail,
        WorkbookDescription: r.WorkbookDescription,
        ContentUrl: r.ContentUrl,
        ShowTabs: r.ShowTabs,
        IconClass: r.IconClass,
        Tag: r.Tag,
        IsFavorite: r.IsFavorite,
        IsStandard: companyName ? false : true,
        SourceUrl: companyName ? '/company-reports' : '/standard-reports',
        DefaultTag: companyName ? `${companyName} Reports` : 'Payfactors Reports',
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

  static mapDataViewEntityResponsesToEntities(response: DataViewEntityResponse[]): Entity[] {
    return response.map(e => {
      return {
        Id: e.EntityId,
        Name: e.Entity,
        IsBaseEntity: e.IsBaseEntity
      };
    });
  }

  static mapUserDataViewResponseToUserDataView(response: UserDataViewResponse): UserDataView {
    return {
      BaseEntityId: response.BaseEntityId,
      Entity: response.Entity,
      Name: response.Name,
      Summary: response.Summary,
      UserDataViewId: response.UserDataViewId
    };
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
