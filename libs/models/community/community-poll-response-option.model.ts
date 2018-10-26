export interface CommunityPollResponseOption {
  ResponseId: number;
  ResponseText: string;
}

export function generateMockCommunityPollResponseOption(responseId: number, responseText: string): CommunityPollResponseOption {
  return {
    ResponseId: responseId,
    ResponseText: responseText
  };
}
