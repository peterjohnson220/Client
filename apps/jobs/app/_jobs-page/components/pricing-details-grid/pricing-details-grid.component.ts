import { Component, AfterViewInit, ViewChild, ElementRef, Input } from '@angular/core';

import { Observable, Subscription } from 'rxjs';

import { SortDescriptor } from '@progress/kendo-data-query';

import { PfDataGridFilter } from 'libs/features/pf-data-grid/models';
import { PfDataGridColType } from 'libs/features/pf-data-grid/enums';
import { Permissions } from 'libs/constants';

@Component({
  selector: 'pf-pricing-details-grid',
  templateUrl: './pricing-details-grid.component.html',
  styleUrls: ['./pricing-details-grid.component.scss']
})
export class PricingDetailsGridComponent implements AfterViewInit {

  @Input() filters: PfDataGridFilter[];

  @ViewChild('payMarketColumn', { static: false }) payMarketColumn: ElementRef;
  @ViewChild('baseMrpColumn', { static: false }) baseMrpColumn: ElementRef;
  @ViewChild('baseTccColumn', { static: false }) baseTccColumn: ElementRef;
  @ViewChild('currencyColumn', { static: false }) currencyColumn: ElementRef;

  colTemplates = {};

  defaultSort: SortDescriptor[] = [{
    dir: 'asc',
    field: 'CompanyPayMarkets_PayMarket'
  }];
  pageViewId = '86870F9F-C148-4626-92DE-C2B73B6E0D35';
  permissions = Permissions;
  selectedKeys: number[];
  selectedKeysSubscription: Subscription;
  addingToProject$: Observable<boolean>;

  constructor() {  }

  ngAfterViewInit() {
    this.colTemplates = {
      'PayMarket': { Template: this.payMarketColumn },
      'BaseMRP': { Template: this.baseMrpColumn },
      'TCCMRP': { Template: this.baseTccColumn },
      [PfDataGridColType.currency]: { Template: this.currencyColumn }
    };
  }
}
