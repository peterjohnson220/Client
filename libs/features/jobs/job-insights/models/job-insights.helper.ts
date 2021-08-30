import { CompanyJob, GenericKeyValue } from 'libs/models';

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
}
