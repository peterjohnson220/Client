export interface CommunityLink {
  Type: string;
  Value: string;
  Href: string;
}

export function generateMockCommunityLink(): CommunityLink {
  return {
    Type: 'hashtag',
    Value: '#t',
    Href: '#t'
  };
}
