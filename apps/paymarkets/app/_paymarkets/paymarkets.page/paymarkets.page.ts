import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { SortDescriptor } from '@progress/kendo-data-query';
import { ActionBarConfig,
  getDefaultActionBarConfig,
  getDefaultGridRowActionsConfig,
  GridRowActionsConfig,
  PositionType
} from 'libs/features/pf-data-grid/models';
import { PayMarketsPageViewId } from '../models';

@Component({
  selector: 'pf-paymarkets-page',
  templateUrl: './paymarkets.page.html',
  styleUrls: ['./paymarkets.page.scss']
})
export class PayMarketsPageComponent implements AfterViewInit {
  @ViewChild('gridRowActionsTemplate', { static: false }) gridRowActionsTemplate: ElementRef;
  @ViewChild('defaultScopesColumn', { static: false }) defaultScopesColumn: ElementRef;

  defaultSort: SortDescriptor[] = [{
    dir: 'asc',
    field: 'CompanyPayMarkets_PayMarket'
  }];
  actionBarConfig: ActionBarConfig;
  pageViewId = PayMarketsPageViewId;
  colTemplates = {};

  gridRowActionsConfig: GridRowActionsConfig = getDefaultGridRowActionsConfig();

  constructor() {
    this.actionBarConfig = {
      ...getDefaultActionBarConfig(),
      ShowActionBar: true,
      AllowSaveFilter: false
    };
  }

  ngAfterViewInit(): void {
    this.gridRowActionsConfig = {
      ...this.gridRowActionsConfig,
      ActionsTemplate : this.gridRowActionsTemplate,
      Position: PositionType.Right
    };
    this.colTemplates = {
      'Default_Scope': { Template: this.defaultScopesColumn}
    };
  }

  customSortOptions = (sortDescriptor: SortDescriptor[]): SortDescriptor[] => {
    if (sortDescriptor && sortDescriptor.length > 0) {
      const sizeSortInfo = sortDescriptor.find(s => s.field === 'CompanyPayMarkets_ScopeSize');
      if (!sizeSortInfo) {
        return sortDescriptor;
      }
      return this.getSizeColumnSort(sizeSortInfo);
    }
    return sortDescriptor;
  }

  private getSizeColumnSort(sizeSortInfo: SortDescriptor): SortDescriptor[] {
    return [
      {
        field: 'CompanyPayMarkets_Size_Label',
        dir: sizeSortInfo.dir
      },
      {
        field: 'CompanyPayMarkets_Size_Id',
        dir: sizeSortInfo.dir
      },
      {
        field: 'CompanyPayMarkets_ScopeSize',
        dir: sizeSortInfo.dir
      }
    ];
  }
}
