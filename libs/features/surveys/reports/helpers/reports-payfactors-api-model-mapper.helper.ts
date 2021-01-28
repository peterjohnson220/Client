import { TableauReportResponse, TableauReportViewsResponse } from 'libs/models/payfactors-api';
import { generateDefaultAsyncStateObj } from 'libs/models';

import { ReportType, View, Workbook } from '../models';

export class ReportsPayfactorsApiModelMapper {
  static mapTableauReportResponsesToWorkbooks(response: TableauReportResponse[], companyName?: string): Workbook[] {
    return response.map(r => this.mapTableauReportResponseToWorkbook(r, companyName));
  }

  static mapTableauReportResponseToWorkbook(response: TableauReportResponse, companyName?: string): Workbook {
    let views = null;
    if (response.Views) {
      views = generateDefaultAsyncStateObj<View[]>([]);
      views.obj = this.mapTableauReportViewsResponsesToViews(response.Views);
    }
    return {
      Type: response.ReportType === 'TableauReport' ? ReportType.TableauReport : ReportType.DataView,
      WorkbookId: response.WorkbookId,
      WorkbookName: response.WorkbookName,
      Thumbnail: response.Thumbnail,
      WorkbookDescription: response.WorkbookDescription,
      ContentUrl: response.ContentUrl,
      ShowTabs: response.ShowTabs,
      IconClass: response.IconClass,
      Tag: response.Tag,
      IsFavorite: response.IsFavorite,
      IsStandard: companyName ? false : true,
      SourceUrl: companyName ? '/company-reports' : '/standard-reports',
      DefaultTag: companyName ? `${companyName} Reports` : 'Payfactors Reports',
      DashboardsOrder: response.DashboardsOrder,
      FavoritesOrder: response.FavoritesOrder,
      Views: views,
      AccessLevel: response.AccessLevel
    };
  }

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
}
