export enum CommunityPollStatusEnum {
  Draft = 0,
  Live = 1,
  Archived = 2
}

export enum CommunityPostTypeStatusEnum {
  Discussion = 0,
  Question = 1,
  Job = 2
}

export const CommunityPollStatuses: Array<{ text: string, value: number }> = [
    { text: 'DRAFT', value: CommunityPollStatusEnum.Draft },
    { text: 'LIVE', value: CommunityPollStatusEnum.Live },
    { text: 'ARCHIVED', value: CommunityPollStatusEnum.Archived }
  ];

export const HashTagRegEx = new RegExp(/([#])\w+/ig, 'gi');


