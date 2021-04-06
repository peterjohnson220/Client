import { DataCutSummaryTypes } from 'libs/features/pricings/data-cut-summary/constants';
import { DataCutSummaryEntityTypes } from 'libs/constants';

export interface JobMatchCutsResponse {
  JobMatchCuts: JobMatchCut[];
}

export interface JobMatchCut {
  MatchId?: string|number;
  MatchType?: DataCutSummaryEntityTypes;
  Source: string;
  Base50?: number;
  TCC50?: number;
  JobTitle: string;
  JobCode: string;
  MatchSourceCode: string;
  DataSourceJobId?: number;
  SurveyJobCode?: string;
  PeerCutId?: string;
  CutFilterId?: string;
  MatchWeight: number;
  MatchAdjustment: number;
  Incs: number;
  Orgs: number;
  WeightingType: string;
}

export function generateMockJobMatchCut(): JobMatchCut {
  return {
    MatchId: 1,
    MatchType: DataCutSummaryEntityTypes.CompanyJobPricingMatchId,
    Source: 'Payfactors',
    Base50: 25.66,
    TCC50: 100.11,
    JobCode: 'JB122',
    JobTitle: 'Janitor/Custodian',
    MatchSourceCode: DataCutSummaryTypes.PEER,
    SurveyJobCode: 'KKNN',
    DataSourceJobId: 12345,
    MatchWeight: 0,
    MatchAdjustment: 0,
    Incs: 0,
    Orgs: 0,
    WeightingType: 'I'
  };
}
