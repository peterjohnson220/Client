import { orderBy } from 'lodash';

import { DashboardView, Workbook } from '../models';

export class DashboardsHelper {
  static getWorkbookFilterFn(view: DashboardView) {
    let filterFn;
    switch (view) {
      case DashboardView.All:
        filterFn = () => true;
        break;
      case DashboardView.Favorites:
        filterFn = (workbook: Workbook) => workbook.IsFavorite === true;
        break;
      default:
        filterFn = () => true;
        break;
    }

    return filterFn;
  }

  static getOrderByFn(view: DashboardView, workbooks: Workbook[]) {
    let orderByFn;
    switch (view) {
      case DashboardView.All:
        orderByFn = orderBy(workbooks, ['DashboardsOrder', 'WorkbookName'], 'asc');
        break;
      case DashboardView.Favorites:
        orderByFn = orderBy(workbooks, ['FavoritesOrder', 'WorkbookName'], 'asc');
        break;
      default:
        orderByFn = orderBy(workbooks, ['WorkbookName'], 'asc');
        break;
    }

    return orderByFn;
  }

  static getCompanyWorkbooksByView(workbooks: Workbook[], view: DashboardView): Workbook[] {
    let filteredWorkbooks = workbooks.filter(this.getWorkbookFilterFn(view));
    filteredWorkbooks = this.getOrderByFn(view, filteredWorkbooks);
    return filteredWorkbooks;
  }

  static applyWorkbookOrderByView(workbooks: Workbook[], orderedWorkbookIds: string[], view: DashboardView): Workbook[] {
    orderedWorkbookIds.map((id: string, index: number) => {
      const workbook = workbooks.find((w: Workbook) => w.WorkbookId === id);
      if (view === DashboardView.All) {
        workbook.DashboardsOrder = index + 1;
      } else {
        workbook.FavoritesOrder = index + 1;
      }
    });
    return workbooks;
  }
}
