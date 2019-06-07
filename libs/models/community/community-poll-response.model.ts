export interface CommunityPollResponse {
  CommunityPollId: string;
  ResponsePercents: number[];
  ResponseVotes: number[];
  UserHasVoted: boolean;
}

export function generateMockCommunityPollResponse(): CommunityPollResponse {
  return {
    CommunityPollId: '1234',
    ResponsePercents: [0, 100],
    ResponseVotes: [0, 1],
    UserHasVoted: false
  };
}
