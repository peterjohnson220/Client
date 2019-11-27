import { ExchangeJobExchangeDetail, generateMockExchangeJobExchangeDetail } from '../../../features/peer/models';
import { generateMockPayMarket, PayMarket } from '../../paymarket';
import { generateMockSystemFilter, SystemFilter } from '../exchange-job-pay-market-filter.model';
import { generateMockPeerMapScopeSideBarInfo, PeerMapScopeSideBarInfo } from './peer-map-scope-side-bar-info.model';

export interface PeerMapScopeSystemSideBarInfo extends PeerMapScopeSideBarInfo {
  IncludeUntaggedIncumbents: boolean;
  IsFilteredBySimilarExchangeJobIds: boolean;
  LimitToPayMarket: boolean;
  PayMarket: PayMarket;
  SystemFilter: SystemFilter;
  LockedExchangeJobExchangeDetail: ExchangeJobExchangeDetail;
}

export function generateMockPeerMapScopeSystemSideBarInfo(): PeerMapScopeSystemSideBarInfo {
  return {
    ...generateMockPeerMapScopeSideBarInfo(),
    IncludeUntaggedIncumbents: false,
    IsFilteredBySimilarExchangeJobIds: false,
    LimitToPayMarket: false,
    PayMarket: generateMockPayMarket(),
    SystemFilter: generateMockSystemFilter(),
    LockedExchangeJobExchangeDetail: generateMockExchangeJobExchangeDetail()
  };
}
