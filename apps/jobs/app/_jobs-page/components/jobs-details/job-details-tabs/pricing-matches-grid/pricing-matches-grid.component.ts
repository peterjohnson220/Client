import {
  Component, Input, ViewChild, ElementRef, AfterViewInit, OnChanges, SimpleChanges, OnInit,
  Output, EventEmitter
} from '@angular/core';

import { SortDescriptor } from '@progress/kendo-data-query';

import { PfDataGridFilter, ActionBarConfig, getDefaultActionBarConfig } from 'libs/features/grids/pf-data-grid/models';
import { PfDataGridColType } from 'libs/features/grids/pf-data-grid/enums';
import { PagingOptions } from 'libs/models/payfactors-api';
import { PermissionCheckEnum, Permissions } from 'libs/constants/permissions';
import { PermissionService } from 'libs/core/services';
import { PfThemeType } from 'libs/features/grids/pf-data-grid/enums/pf-theme-type.enum';
import { MrpFormatterService } from 'libs/core/services/mrp-formatter.service';

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
  @ViewChild('genericMrpColumn') genericMrpColumn: ElementRef;

  colTemplates = {};

  pageViewId = PageViewIds.PricingMatches;

  pfThemeType = PfThemeType;
  mrpDisplayOverrides: any[] = [];
  rateOverride = '';
  mrpFields = ['AllowMRP', 'BaseMRP', 'BonusMRP', 'BonusPctMRP', 'BonusTargetMRP', 'BonusTargetPctMRP', 'FixedMRP', 'LTIPMRP', 'LTIPPctMRP', 'RemunMRP',
    'SalesIncentiveActualMRP', 'SalesIncentiveActualPctMRP', 'SalesIncentiveTargetMRP', 'SalesIncentiveTargetPctMRP',
    'TargetLTIPMRP', 'TargetTDCMRP', 'TCCMRP', 'TCCPlusAllowMRP', 'TCCPlusAllowNoCarMRP', 'TCCTargetMRP', 'TCCTargetPlusAllowMRP',
    'TCCTargetPlusAllowNoCarMRP', 'TDCMRP', 'TGPMRP'];

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
  constructor(private permissionService: PermissionService, private mrpFormatterService: MrpFormatterService) {
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
      this.mrpDisplayOverrides = this.mrpFormatterService.generateDisplayOverrides(changes.pricingInfo.currentValue, this.mrpFields);
      this.rateOverride = this.mrpFormatterService.generateRateOverride(changes.pricingInfo.currentValue);

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

    this.mrpFields.forEach(mrp => {
      this.colTemplates[mrp] = { Template: this.genericMrpColumn };
    });
  }
}
