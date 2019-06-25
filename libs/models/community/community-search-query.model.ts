import { CommunitySearchDurationEnum, CommunitySearchSortByEnum } from './community-constants.model';

export interface CommunitySearchQuery {
  searchTerm: string;
  searchSort: CommunitySearchSortByEnum;
  searchDuration: CommunitySearchDurationEnum;
}

export function generateMockCommunitySearchQuery(): CommunitySearchQuery {
  return {
    searchTerm: 'searchTerm',
    searchSort: CommunitySearchSortByEnum.Relevance,
    searchDuration: CommunitySearchDurationEnum.AllTime
  };
}
