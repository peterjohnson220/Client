export interface CommunityCategory {
  Name: string;
  Count: number;
}

export function generateMockCommunityCategory(): CommunityCategory {
  return {
    Name: 'JobPostings',
    Count: 10
  };
}
