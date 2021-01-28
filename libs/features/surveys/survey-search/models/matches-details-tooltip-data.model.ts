import { PricingMatchesDetailsRequest, MatchesDetailsRequestJobTypes } from 'libs/models/payfactors-api';

export interface MatchesDetailsTooltipData {
  TargetX: number;
  TargetY: number;
  Request?: PricingMatchesDetailsRequest;
  MatchesDetails?: string[];
}

export function generateMatchesDetailsTooltipData(): MatchesDetailsTooltipData {
  const request: PricingMatchesDetailsRequest = {
    JobId: '1',
    JobType: MatchesDetailsRequestJobTypes.SurveyData
  };
  return {
    TargetX: 60,
    TargetY: 100,
    Request: request,
    MatchesDetails: ['Administrative Assistant (25) - *Denver']
  };
}
