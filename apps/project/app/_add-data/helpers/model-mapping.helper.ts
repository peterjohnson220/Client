import { PagingOptions, SearchField, SurveyJob, SearchType, SurveyDataCut } from 'libs/models/survey-search';

import { Filter, JobResult, ResultsPagingOptions, DataCut } from '../models';

export function mapSurveyJobsToJobResults(surveyJobs: SurveyJob[]): JobResult[] {
  const currentdate = new Date();
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
      EffectiveDate: sj.IsPayfactorsJob ?
        new Date(currentdate.getFullYear(), currentdate.getMonth(), 1) :
        sj.Survey.EffectiveDateTime,
      Category: sj.Job.Category,
      FLSAStatus: sj.Job.FLSAStatus,
      LoadingDataCuts: false,
      DataCuts: [],
      ShowDataCuts: false
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

export function mapSurveyDataCutResultsToDataCut(dataCuts: SurveyDataCut[]): DataCut[] {
  return dataCuts.map((dc: SurveyDataCut) => {
    return {
      SurveyDataId: dc.SurveyDataId,
      Title: dc.Title,
      Country: dc.Country,
      Weight: dc.Weight,
      Base50th: dc.Base50,
      TCC50th: dc.Tcc50,
      Match: 0
    };
  });
}

