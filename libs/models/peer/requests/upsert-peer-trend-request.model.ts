import { BaseExchangeDataSearchRequest } from '../../payfactors-api/peer/exchange-data-search/request';

export interface PeerTrendDetails {
  Name: string;
  MinDate: Date;
  MaxDate: Date;
  RollForward: boolean;
}

export interface UpsertPeerTrendRequest {
  PeerTrendDetails: PeerTrendDetails;
  ExchangeDataSearchRequest: BaseExchangeDataSearchRequest;
}
