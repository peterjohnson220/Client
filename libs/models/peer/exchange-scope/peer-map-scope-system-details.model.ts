import { generateMockPeerMapScopeSystemSideBarInfo, PeerMapScopeSystemSideBarInfo } from './peer-map-scope-system-side-bar-info.model';
import { generateMockPeerMapScopeMapInfo, PeerMapScopeMapInfo } from './peer-map-scope-map-info.model';

export interface PeerMapScopeSystemDetails {
  SideBarInfo: PeerMapScopeSystemSideBarInfo;
  MapInfo: PeerMapScopeMapInfo;
}

export function generateMockPeerMapScopeSystemDetails(): PeerMapScopeSystemDetails {
  return {
    SideBarInfo: generateMockPeerMapScopeSystemSideBarInfo(),
    MapInfo: generateMockPeerMapScopeMapInfo()
  };
}
