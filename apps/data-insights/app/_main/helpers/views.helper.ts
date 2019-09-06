import * as cloneDeep from 'lodash.clonedeep';
import { orderBy } from 'lodash';

import { ReportOrderType } from 'libs/constants';

import { DashboardView, View, Workbook } from '../models';

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

  static orderWorkbooksViews(workbooks: Workbook[]): Workbook[] {
    return workbooks.map((w: Workbook) => {
      const viewsAsyncClone = cloneDeep(w.Views);
      viewsAsyncClone.obj = ViewsHelper.getOrderByFn(ReportOrderType.Custom, viewsAsyncClone.obj);
      return {
        ...w,
        Views: viewsAsyncClone
      };
    });
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
