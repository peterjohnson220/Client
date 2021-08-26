import { ExchangeDataSearchRequest } from '../../peer';

export interface ModifyPricingMatchesRequest {
  PricingId: number;
  JobId: number;
  PaymarketId: number;
  MatchesToDeleted: number[];
  SurveyCutMatchesToAdded: number[];
  PayfactorsCutMatchesToAdded: string[];
  PeerCutMatchesToAdded: PeerCutData[];
  TempPeerCutMatchesToAdd: TempPeerCutData[];
}

export interface PeerCutData {
  ExchangeId: number;
  ExchangeJobId: number;
  DailyNatAvgId: number;
  DailyScopeAvgId: number;
}

export interface TempPeerCutData {
  Id: string;
  ExchangeJobId: number;
  ExchangeDataSearchRequest: ExchangeDataSearchRequest;
}

export interface ModifyPricingMatchesResponse {
  CompanyJobId: number;
  PaymarketId: number;
}
