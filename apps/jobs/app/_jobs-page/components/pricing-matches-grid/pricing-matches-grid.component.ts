import { Component, Input, ViewChild, ElementRef, AfterViewInit, OnChanges, SimpleChanges } from '@angular/core';
import { PfDataGridFilter, ActionBarConfig, getDefaultActionBarConfig } from 'libs/features/pf-data-grid/models';
import { SortDescriptor } from '@progress/kendo-data-query';
import { PfDataGridColType } from 'libs/features/pf-data-grid/enums';
import { PagingOptions } from 'libs/models/payfactors-api';
import { PageViewIds } from '../../constants';

@Component({
  selector: 'pf-pricing-matches-grid',
  templateUrl: './pricing-matches-grid.component.html',
  styleUrls: ['./pricing-matches-grid.component.scss']
})
export class PricingMatchesGridComponent implements AfterViewInit, OnChanges {

  @Input() pricingInfo: any[];

  @ViewChild('jobTitleColumn', { static: false }) jobTitleColumn: ElementRef;
  @ViewChild('currencyColumn', { static: false }) currencyColumn: ElementRef;

  colTemplates = {};

  rate: string;
  filter: PfDataGridFilter = {
    SourceName: 'CompanyJobPricing_ID',
    Operator: '=',
    Value: ''
  };

  defaultSort: SortDescriptor[] = [{
    dir: 'desc',
    field: 'vw_PricingMatchesJobTitlesMerged_Effective_Date'
  }];

  defaultPagingOptions: PagingOptions = {
    From: 0,
    Count: 500
  };
  actionBarConfig: ActionBarConfig;

  constructor() {
    this.actionBarConfig = {
      ...getDefaultActionBarConfig(),
      ShowActionBar: false
    };
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!!changes.pricingInfo) {
      this.filter.Value = changes.pricingInfo.currentValue['CompanyJobs_Pricings_CompanyJobPricing_ID'];
      this.rate = changes.pricingInfo.currentValue['CompanyJobs_Pricings_Rate'];
    }
  }

  ngAfterViewInit() {
    this.colTemplates = {
      'Job_Title': { Template: this.jobTitleColumn },
      [PfDataGridColType.currency]: { Template: this.currencyColumn }
    };
  }

  getPageViewId() {
    return this.filter ? `${PageViewIds.PricingMatches}_${this.filter.Value}` : null;
  }
}
