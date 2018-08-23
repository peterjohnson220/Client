export enum CommunityPollStatusEnum {
  Draft = 0,
  Live = 1,
  Archived = 2
}

export const CommunityPollStatuses: Array<{ text: string, value: number }> = [
    { text: 'Draft', value: CommunityPollStatusEnum.Draft },
    { text: 'Live', value: CommunityPollStatusEnum.Live },
    { text: 'Archived', value: CommunityPollStatusEnum.Archived }
  ];


