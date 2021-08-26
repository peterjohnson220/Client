import { CompanyJob, GenericKeyValue } from 'libs/models';

import { MarketDataJobPricingMatch } from './market-data-job-pricing.model';

export interface JobDetailsField {
  Name: string;
  SourceName: string;
}

export class JobInsightsHelper {
  static standardFields: JobDetailsField[] = [
    {
      Name: 'Job Code',
      SourceName: 'JobCode'
    },
    {
      Name: 'Job Family',
      SourceName: 'JobFamily'
    },
    {
      Name: 'FLSA Status',
      SourceName: 'FlsaStatus'
    },
    {
      Name: 'Level',
      SourceName: 'JobLevel'
    },
  ];

  static mapJobDataToGenericKeyValues(job: CompanyJob): GenericKeyValue<string, string>[] {
    const results: GenericKeyValue<string, string>[] = [];
    this.standardFields.forEach(f => {
      results.push({
        Key: f.Name,
        Value: job[f.SourceName]
      });
    });
    return results;
  }

  static getCustomFieldsWithValues(job: CompanyJob, udfFields: GenericKeyValue<string, string>[]): GenericKeyValue<string, string>[] {
    let results: GenericKeyValue<string, string>[] = [];
    udfFields.forEach(f => {
      results.push({
        Key: f.Value,
        Value: job[f.Key]
      });
    });
    results = results.filter(x => !!x.Value);
    return results;
  }

  static buildMarketDataJobPricingMatch(pricingMatch: any): MarketDataJobPricingMatch {
    return {
      PricingMatchId: pricingMatch['CompanyJobs_PricingsMatches_CompanyJobPricingMatch_ID'],
      JobTitle: pricingMatch['vw_PricingMatchesJobTitlesMerged_Job_Title'],
      JobCode: pricingMatch['vw_PricingMatchesJobTitlesMerged_Job_Code'],
      EffectiveDate: pricingMatch['vw_PricingMatchesJobTitlesMerged_Effective_Date'],
      Source: pricingMatch['vw_PricingMatchesJobTitlesMerged_Source'],
      Weight: pricingMatch['CompanyJobs_PricingsMatches_Match_Weight'],
      Adjustment: pricingMatch['CompanyJobs_PricingsMatches_Match_Adjustment'],
      PricingId: pricingMatch['CompanyJobs_PricingsMatches_CompanyJobPricing_ID']
    };
  }
}
