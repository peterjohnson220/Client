import * as cloneDeep from 'lodash.clonedeep';
import { orderBy } from 'lodash';

import { ReportOrderType } from 'libs/constants';

import { View, Workbook } from '../models';

export class ViewsHelper {
  static getOrderByFn(type: ReportOrderType, views: View[]): View[] {
    let orderByFn;
    switch (type) {
      case ReportOrderType.Custom:
        orderByFn = orderBy(views, ['ViewsOrder', (x: View) => x.ViewName.toLowerCase()], 'asc');
        break;
      case ReportOrderType.Favorites:
        orderByFn = orderBy(views, ['FavoritesOrder', (x: View) => x.ViewName.toLowerCase()], 'asc');
        break;
      default:
        orderByFn = orderBy(views, ['ViewName', (x: View) => x.ViewName.toLowerCase()], 'asc');
        break;
    }

    return orderByFn;
  }

  static orderDataViewReports(workbooks: Workbook[]): Workbook[] {
    return orderBy(workbooks, ['DashboardsOrder', (x: Workbook) => x.WorkbookName.toLowerCase()], 'asc');
  }

  static orderWorkbooksViews(workbooks: Workbook[]): Workbook[] {
    return workbooks.map((w: Workbook) => {
      const viewsAsyncClone = cloneDeep(w.Views);
      if (!!viewsAsyncClone) {
        viewsAsyncClone.obj = ViewsHelper.getOrderByFn(ReportOrderType.Custom, viewsAsyncClone.obj);
      }
      return {
        ...w,
        Views: viewsAsyncClone
      };
    });
  }

  static getFavoriteTableauReports(workbooks: Workbook[]): View[] {
    const favoriteViews = [];
    workbooks.forEach(function (workbook) {
      workbook.Views.obj.forEach(function (view) {
        if (view.IsFavorite) {
          favoriteViews.push({
            ...view,
            WorkbookId: workbook.WorkbookId,
            WorkbookSourceUrl: workbook.SourceUrl,
            WorkbookContentUrl: workbook.ContentUrl,
            WorkbookName: workbook.WorkbookName
          });
        }
      });
    });
    return favoriteViews;
  }

  static getFavoriteDataViewReports(workbooks: Workbook[]): Workbook[] {
    const favoriteDataViewReports = [];
    workbooks.forEach(function (workbook) {
      if (workbook.IsFavorite) {
        favoriteDataViewReports.push(workbook);
      }
    });
    return favoriteDataViewReports;
  }

  static applyViewOrderByType(views: View[], orderedViewIds: string[], type: ReportOrderType): View[] {
    orderedViewIds.map((id: string, index: number) => {
      const view = views.find((x: View) => x.ViewId === id);
      if (type === ReportOrderType.Custom) {
        view.ViewsOrder = index + 1;
      } else {
        view.FavoritesOrder = index + 1;
      }
    });
    views = this.getOrderByFn(type, views);
    return views;
  }
}
