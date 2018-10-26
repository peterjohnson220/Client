export interface CommunityPollResponse {
  CommunityPollId: string;
  ResponsePercents: number[];
}

export function generateMockCommunityPollResponse(): CommunityPollResponse {
  return {
    CommunityPollId: '1234',
    ResponsePercents: [0, 100]
  };
}
