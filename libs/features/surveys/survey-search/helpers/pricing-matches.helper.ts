import { SurveySearchResultDataSources } from 'libs/constants';
import {
  PFJobMatches,
  PricingMatchesRequest,
  PricingMatchesResponse, SearchFilter,
  SurveyJobsMatches
} from 'libs/models/payfactors-api';

import { JobResult, PricingMatchDataSearchContext } from '../models';

export function applyMatchesToJobResults(jobResults: JobResult[], pricingMatches: PricingMatchesResponse): JobResult[] {
  const surveyJobsMatches: SurveyJobsMatches[] = pricingMatches.SurveyJobsMatches;
  const pfJobsMatches: PFJobMatches[] = pricingMatches.PFJobsMatches;
  jobResults.map((jobResult: JobResult) => {
    if (jobResult.DataSource === SurveySearchResultDataSources.Payfactors) {
      const pfJobMatches: PFJobMatches = pfJobsMatches.find(m => m.JobCode === jobResult.Code);
      if (!!pfJobMatches) {
        jobResult.Matches = pfJobMatches.Matches;
      }
    } else if (jobResult.DataSource === SurveySearchResultDataSources.Surveys) {
      const surveyJobMatches: SurveyJobsMatches = surveyJobsMatches.find(m => m.SurveyJobId === jobResult.Id);
      if (!!surveyJobMatches) {
        jobResult.Matches = surveyJobMatches.Matches;
      }
    }
    return jobResult;
  });
  return jobResults;
}

export function createPricingMatchesRequest(
  jobResults: JobResult[],
  lastJobResultIndex: number,
  projectSearchContext: PricingMatchDataSearchContext,
  filters: SearchFilter[]
): PricingMatchesRequest {
  const latestResults: JobResult[] = jobResults.slice(lastJobResultIndex, jobResults.length);
  const surveyJobIds: number[] = [];
  const exchangeJobIds: number[] = [];
  const jobCodes: string[] = [];
  latestResults.forEach((jobResult: JobResult) => {
    if (jobResult.DataSource === SurveySearchResultDataSources.Payfactors) {
      jobCodes.push(jobResult.Code);
    } else if (jobResult.DataSource === SurveySearchResultDataSources.Surveys) {
      surveyJobIds.push(jobResult.Id);
    } else if (jobResult.DataSource === SurveySearchResultDataSources.Peer) {
      exchangeJobIds.push(jobResult.PeerJobInfo.ExchangeJobId);
    }
  });

  const pricingMatchesRequest: PricingMatchesRequest = {
    Filters: filters,
    CurrencyCode: projectSearchContext.CurrencyCode,
    CountryCode: projectSearchContext.CountryCode,
    Rate: projectSearchContext.Rate,
    SurveyJobIds: surveyJobIds,
    PFJobCodes: jobCodes,
    ExchangeJobIds: exchangeJobIds
  };
  return pricingMatchesRequest;
}

export function calculateTooltipTopPx(tooltipContainerData: TooltipContainerData): number {
  let newTopPx: number = tooltipContainerData.Top;
  const isOverlappingTop: boolean = tooltipContainerData.Top + tooltipContainerData.Height > tooltipContainerData.ContainerHeight;
  if (isOverlappingTop) {
    newTopPx = tooltipContainerData.Top - tooltipContainerData.Height + tooltipContainerData.Margin;
    newTopPx = newTopPx < 0 ? 0 : newTopPx;
  }
  return newTopPx;
}

export interface TooltipContainerData {
  Top: number;
  Height: number;
  Margin: number;
  ContainerHeight: number;
}
