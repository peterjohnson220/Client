import { PricingMatchesResponse, PricingMatchesRequest, SurveyJobsMatches, PFJobMatches } from 'libs/models/survey-search';

import { JobResult } from '../models';

export function applyMatchesToJobResults(jobResults: JobResult[], pricingMatches: PricingMatchesResponse): JobResult[] {
  const surveyJobsMatches: SurveyJobsMatches[] = pricingMatches.SurveyJobsMatches;
  const pfJobsMatches: PFJobMatches[] = pricingMatches.PFJobsMatches;
  jobResults.map((jobResult: JobResult) => {
    if (jobResult.IsPayfactors) {
      const pfJobMatches: PFJobMatches = pfJobsMatches.find(m => m.JobCode === jobResult.Code);
      if (!!pfJobMatches) {
        jobResult.Matches = pfJobMatches.Matches;
      }
    } else {
      const surveyJobMatches: SurveyJobsMatches = surveyJobsMatches.find(m => m.SurveyJobId === jobResult.Id);
      if (!!surveyJobMatches) {
        jobResult.Matches = surveyJobMatches.Matches;
      }
    }
    return jobResult;
  });
  return jobResults;
}

export function createPricingMatchesRequest(jobResults: JobResult[], lastJobResultIndex: number): PricingMatchesRequest {
  const latestResults: JobResult[] = jobResults.slice(lastJobResultIndex + 1, jobResults.length);
  const jobIds: number[] = [];
  const jobCodes: string[] = [];
  latestResults.forEach((jobResult: JobResult) => {
    if (jobResult.IsPayfactors) {
      jobCodes.push(jobResult.Code);
    } else {
      jobIds.push(jobResult.Id);
    }
  });
  const pricingMatchesRequest: PricingMatchesRequest = {
    SurveyJobIds: jobIds,
    PFJobCodes: jobCodes
  };
  return pricingMatchesRequest;
}
