import {
  Component, Input, ViewChild, ElementRef, AfterViewInit, OnChanges, SimpleChanges, OnInit,
  TemplateRef, Output, EventEmitter
} from '@angular/core';

import { SortDescriptor } from '@progress/kendo-data-query';

import { PfDataGridFilter, ActionBarConfig, getDefaultActionBarConfig } from 'libs/features/pf-data-grid/models';
import { PfDataGridColType } from 'libs/features/pf-data-grid/enums';
import { PagingOptions } from 'libs/models/payfactors-api';
import { PermissionCheckEnum, Permissions } from 'libs/constants/permissions';
import { PermissionService } from 'libs/core/services';

import { PageViewIds } from '../../../../constants';

@Component({
  selector: 'pf-pricing-matches-grid',
  templateUrl: './pricing-matches-grid.component.html',
  styleUrls: ['./pricing-matches-grid.component.scss']
})
export class PricingMatchesGridComponent implements OnInit, AfterViewInit, OnChanges {

  @Input() pricingInfo: any;
  @Output() reScopeSurveyDataEmitter = new EventEmitter();

  @ViewChild('jobTitleColumn') jobTitleColumn: ElementRef;
  @ViewChild('agingColumn') agingColumn: ElementRef;
  @ViewChild('currencyColumn') currencyColumn: ElementRef;
  @ViewChild('pricingInfoColumn') pricingInfoColumn: ElementRef;

  colTemplates = {};

  pageViewId = PageViewIds.PricingMatches;

  rate: string;
  filter: PfDataGridFilter = {
    SourceName: 'CompanyJobPricing_ID',
    Operator: '=',
    Value: ''
  };

  defaultSort: SortDescriptor[] = [{
    dir: 'desc',
    field: 'CompanyJobs_PricingsMatches_Match_Weight'
  }, {
    dir: 'asc',
    field: 'vw_PricingMatchesJobTitlesMerged_Job_Title'
  }];

  defaultPagingOptions: PagingOptions = {
    From: 0,
    Count: 500
  };
  actionBarConfig: ActionBarConfig;

  hasModifyPricingPemission: boolean;
  constructor(private permissionService: PermissionService) {
    this.hasModifyPricingPemission = this.permissionService.CheckPermission([Permissions.MODIFY_PRICINGS],
      PermissionCheckEnum.Single);
  }

  ngOnInit(): void {
    this.actionBarConfig = {
      ...getDefaultActionBarConfig(),
      ShowActionBar: false
    };
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!!changes.pricingInfo) {
      const newFilterValue = changes.pricingInfo.currentValue.CompanyJobs_Pricings_CompanyJobPricing_ID;
      if (newFilterValue && newFilterValue !== this.filter.Value) {
        this.filter.Value = newFilterValue;
        this.rate = changes.pricingInfo.currentValue.CompanyJobs_Pricings_Rate;
      }
    }
  }

  ngAfterViewInit() {
    this.colTemplates = {
      'Job_Title': { Template: this.jobTitleColumn },
      'Aging_Factor': { Template: this.agingColumn },
      [PfDataGridColType.currency]: { Template: this.currencyColumn },
      [PfDataGridColType.pricingInfo]: { Template: this.pricingInfoColumn }
    };
  }
}
