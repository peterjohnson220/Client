import { PagingOptions, SearchField, SurveyJob, SearchType } from 'libs/models/survey-search';

import { Filter, JobResult, ResultsPagingOptions } from '../models';

export function mapSurveyJobsToJobResults(surveyJobs: SurveyJob[]): JobResult[] {
  return surveyJobs.map((sj: SurveyJob) => {
    return {
      Id: parseInt(sj.Id, 10),
      Title: sj.Job.Title,
      Code: sj.Job.Code,
      SurveyName: sj.Survey.Title,
      Family: sj.Job.Family,
      Level: '',
      Source: sj.Survey.Publisher,
      Description: sj.Job.Description,
      IsPayfactors: sj.IsPayfactorsJob,
      MatchCount: 0,
      EffectiveDate: sj.Survey.EffectiveDateTime,
      Category: sj.Job.Category,
      FLSAStatus: sj.Job.FLSAStatus
    };
  });
}

export function mapResultsPagingOptionsToPagingOptions(resultsPagingOptions: ResultsPagingOptions): PagingOptions {
  return {
    From: resultsPagingOptions.pageSize * (resultsPagingOptions.page - 1),
    Count: resultsPagingOptions.pageSize
  };
}


export function mapFiltersToSearchFields(filters: Filter[]): SearchField[] {
  return filters.map((f: Filter) => {
    return {
      Name: f.backingField,
      Value: f.values[ 0 ],
      SearchType: SearchType.Wild,
      Must: true
    };
  });
}
