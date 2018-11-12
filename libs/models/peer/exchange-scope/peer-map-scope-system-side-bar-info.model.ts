import { generateMockPayMarket, PayMarket } from '../../paymarket';
import { generateMockSystemFilter, SystemFilter } from '../exchange-job-pay-market-filter.model';
import { generateMockPeerMapScopeSideBarInfo, PeerMapScopeSideBarInfo } from './peer-map-scope-side-bar-info.model';

export interface PeerMapScopeSystemSideBarInfo extends PeerMapScopeSideBarInfo {
  IncludeUntaggedIncumbents: boolean;
  LimitToPayMarket: boolean;
  PayMarket: PayMarket;
  SystemFilter: SystemFilter;
}

export function generateMockPeerMapScopeSystemSideBarInfo(): PeerMapScopeSystemSideBarInfo {
  return {
    ...generateMockPeerMapScopeSideBarInfo(),
    IncludeUntaggedIncumbents: false,
    LimitToPayMarket: false,
    PayMarket: generateMockPayMarket(),
    SystemFilter: generateMockSystemFilter()
  };
}
