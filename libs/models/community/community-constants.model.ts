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

export enum CommunityPollTypeEnum {
  CommunityPoll = 0,
  DiscussionPoll = 1
}

export enum CommunitySearchResultTypeEnum {
  Discussion = 'Discussion',
  Reply = 'Reply',
  Poll = 'Poll',
  Podcast = 'Podcast'
}

export const CommunityPollStatuses: Array<{ text: string, value: number }> = [
    { text: 'DRAFT', value: CommunityPollStatusEnum.Draft },
    { text: 'LIVE', value: CommunityPollStatusEnum.Live },
    { text: 'ARCHIVED', value: CommunityPollStatusEnum.Archived }
  ];

export const HashTagRegEx = new RegExp(/([#])\w+/ig, 'gi');

export const UrlLinkRegEx = new RegExp('(http(s)?:\\/\\/.)?(www\\.)?' +
  '[-a-zA-Z0-9@:%._\\+~#=]{2,256}\\.[a-z]{2,6}\\b([-a-zA-Z0-9@:%_\\+.~#?&//=]*)', 'gi');

export const NewLineRegEx = new RegExp('(?:\r\n|\r|\n)', 'gi');
export const NewMultiLineRegEx = new RegExp('(?:\r\n|\r|\n){2,}', 'gi');
