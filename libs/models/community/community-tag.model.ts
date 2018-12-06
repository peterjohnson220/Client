export interface CommunityTag {
  Id: string;
  Tag: string;
  PostIds: string[];
  ReplyIds: string[];
  IsSuggested: boolean;
}

export function generateMockCommunityTag(): CommunityTag {
  return {
    Id: '1234',
    Tag: '12345',
    PostIds: [],
    ReplyIds: [],
    IsSuggested: false
  };
}
