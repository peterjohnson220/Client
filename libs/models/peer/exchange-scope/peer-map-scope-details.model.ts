import { generateMockPeerMapScopeSideBarInfo, PeerMapScopeSideBarInfo } from './peer-map-scope-side-bar-info.model';
import { generateMockPeerMapScopeMapInfo, PeerMapScopeMapInfo } from './peer-map-scope-map-info.model';

export interface PeerMapScopeDetails {
  SideBarInfo: PeerMapScopeSideBarInfo;
  MapInfo: PeerMapScopeMapInfo;
}

export function generateMockPeerMapScopeDetails(): PeerMapScopeDetails {
  return {
    SideBarInfo: generateMockPeerMapScopeSideBarInfo(),
    MapInfo: generateMockPeerMapScopeMapInfo()
  };
}
