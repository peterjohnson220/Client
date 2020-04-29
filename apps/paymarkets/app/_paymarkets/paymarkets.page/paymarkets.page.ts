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
  @ViewChild('payMarketSizeColumn', { static: false }) payMarketSizeColumn: ElementRef;
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
      ShowActionBar: false,
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
      'Size_Value': { Template: this.payMarketSizeColumn },
      'Default_Scope': { Template: this.defaultScopesColumn}
    };
  }
}
