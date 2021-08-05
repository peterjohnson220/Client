import { BasicDataViewField, DataViewFieldDataType, DataViewFilter } from 'libs/models/payfactors-api';

export interface MarketDataJobPricing {
  Id: number;
  Rate: string;
  JobTitle: string;
  JobCode: string;
  JobId: number;
  PayMarket: string;
  PayMarketId: number;
  JobPricingEffectiveDate: Date;
  LinkedPayMarketId: number;
}

export class MarketDataConfig {
  static marketDataGridId = 'jobs-job-insights-market-data';
  static baseEntity = 'CompanyJobs_PricingsMatches';

  static fields: BasicDataViewField[] = [
    {
      EntitySourceName: 'CompanyJobs_PricingsMatches',
      SourceName: 'Match_Weight',
      DisplayName: 'Wtg',
      DataType: DataViewFieldDataType.Float,
      KendoGridField: 'CompanyJobs_PricingsMatches_Match_Weight',
      SortOrder: 0,
      SortDirection: 'desc'
    },
    {
      EntitySourceName: 'vw_PricingMatchesJobTitlesMerged',
      SourceName: 'Job_Title',
      DisplayName: 'Job Title',
      DataType: DataViewFieldDataType.String,
      KendoGridField: 'vw_PricingMatchesJobTitlesMerged_Job_Title',
      SortOrder: 1,
      SortDirection: 'asc'
    },
    {
      EntitySourceName: 'vw_PricingMatchesJobTitlesMerged',
      SourceName: 'Job_Code',
      DisplayName: 'Job Code',
      DataType: DataViewFieldDataType.String,
      KendoGridField: 'vw_PricingMatchesJobTitlesMerged_Job_Code'
    },
    {
      EntitySourceName: 'vw_PricingMatchesJobTitlesMerged',
      SourceName: 'Source',
      DisplayName: 'Source',
      DataType: DataViewFieldDataType.String,
      KendoGridField: 'vw_PricingMatchesJobTitlesMerged_Source'
    },
    {
      EntitySourceName: 'vw_PricingMatchesJobTitlesMerged',
      SourceName: 'Effective_Date',
      DisplayName: 'Effective',
      DataType: DataViewFieldDataType.DateTime,
      KendoGridField: 'vw_PricingMatchesJobTitlesMerged_Effective_Date'
    },
    {
      EntitySourceName: 'CompanyJobs_PricingsMatches',
      SourceName: 'Base10',
      DisplayName: '10th',
      DataType: DataViewFieldDataType.Float,
      KendoGridField: 'CompanyJobs_PricingsMatches_Base10',
      Group: 'Base'
    },
    {
      EntitySourceName: 'CompanyJobs_PricingsMatches',
      SourceName: 'Base25',
      DisplayName: '25th',
      DataType: DataViewFieldDataType.Float,
      KendoGridField: 'CompanyJobs_PricingsMatches_Base25',
      Group: 'Base'
    },
    {
      EntitySourceName: 'CompanyJobs_PricingsMatches',
      SourceName: 'Base50',
      DisplayName: '50th',
      DataType: DataViewFieldDataType.Float,
      KendoGridField: 'CompanyJobs_PricingsMatches_Base50',
      Group: 'Base'
    },
    {
      EntitySourceName: 'CompanyJobs_PricingsMatches',
      SourceName: 'Base75',
      DisplayName: '75th',
      DataType: DataViewFieldDataType.Float,
      KendoGridField: 'CompanyJobs_PricingsMatches_Base75',
      Group: 'Base'
    },
    {
      EntitySourceName: 'CompanyJobs_PricingsMatches',
      SourceName: 'Base90',
      DisplayName: '90th',
      DataType: DataViewFieldDataType.Float,
      KendoGridField: 'CompanyJobs_PricingsMatches_Base90',
      Group: 'Base'
    },
    {
      EntitySourceName: 'CompanyJobs_PricingsMatches',
      SourceName: 'TCC10',
      DisplayName: '10th',
      DataType: DataViewFieldDataType.Float,
      KendoGridField: 'CompanyJobs_PricingsMatches_TCC10',
      Group: 'TCC'
    },
    {
      EntitySourceName: 'CompanyJobs_PricingsMatches',
      SourceName: 'TCC25',
      DisplayName: '25th',
      DataType: DataViewFieldDataType.Float,
      KendoGridField: 'CompanyJobs_PricingsMatches_TCC25',
      Group: 'TCC'
    },
    {
      EntitySourceName: 'CompanyJobs_PricingsMatches',
      SourceName: 'TCC50',
      DisplayName: '50th',
      DataType: DataViewFieldDataType.Float,
      KendoGridField: 'CompanyJobs_PricingsMatches_TCC50',
      Group: 'TCC'
    },
    {
      EntitySourceName: 'CompanyJobs_PricingsMatches',
      SourceName: 'TCC75',
      DisplayName: '75th',
      DataType: DataViewFieldDataType.Float,
      KendoGridField: 'CompanyJobs_PricingsMatches_TCC75',
      Group: 'TCC'
    },
    {
      EntitySourceName: 'CompanyJobs_PricingsMatches',
      SourceName: 'TCC90',
      DisplayName: '90th',
      DataType: DataViewFieldDataType.Float,
      KendoGridField: 'CompanyJobs_PricingsMatches_TCC90',
      Group: 'TCC'
    },
    {
      EntitySourceName: 'CompanyJobs_PricingsMatches',
      SourceName: 'CompanyJobPricing_ID',
      DisplayName: 'CompanyJobPricingId',
      DataType: DataViewFieldDataType.Int,
      KendoGridField: 'CompanyJobs_PricingsMatches_CompanyJobPricing_ID'
    },
    {
      EntitySourceName: 'CompanyJobs_PricingsMatches',
      SourceName: 'CompanyJobPricingMatch_ID',
      DisplayName: 'CompanyJobPricingMatchId',
      DataType: DataViewFieldDataType.Int,
      KendoGridField: 'CompanyJobs_PricingsMatches_CompanyJobPricingMatch_ID'
    },
    {
      EntitySourceName: 'CompanyJobs_PricingsMatches',
      SourceName: 'MDJob_Code',
      DisplayName: 'MDJobCode',
      DataType: DataViewFieldDataType.String,
      KendoGridField: 'CompanyJobs_PricingsMatches_MDJob_Code'
    },
    {
      EntitySourceName: 'CompanyJobs_PricingsMatches',
      SourceName: 'Slotted_CompanyJob_ID',
      DisplayName: 'SlottedCompanyJobId',
      DataType: DataViewFieldDataType.String,
      KendoGridField: 'CompanyJobs_PricingsMatches_Slotted_CompanyJob_ID'
    },
    {
      EntitySourceName: 'ExchangeDataCut',
      SourceName: 'FilterGUID',
      DisplayName: 'FilterGUID',
      DataType: DataViewFieldDataType.String,
      KendoGridField: 'ExchangeDataCut_FilterGUID'
    }
  ];

  static getFilters(jobPricingId: number): DataViewFilter[] {
    return [
      {
        EntitySourceName: 'CompanyJobs_PricingsMatches',
        SourceName: 'CompanyJobPricing_ID',
        Operator: '=',
        Values: [jobPricingId?.toString()]
      }
    ];
  }
}
