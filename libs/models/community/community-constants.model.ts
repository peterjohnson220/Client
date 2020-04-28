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
  Podcast = 'Podcast',
  Attachment = 'Attachment'
}

export enum CommunitySearchDurationEnum {
  AllTime = 0,
  Day,
  Week,
  Month,
  Year
}

export enum CommunitySearchSortByEnum {
  Relevance = 0,
  Date
}

export const CommunitySearchResultDates: Array<{ text: string, value: number }> = [
  { text: 'All Time', value: CommunitySearchDurationEnum.AllTime },
  { text: 'Past 24 Hours', value: CommunitySearchDurationEnum.Day },
  { text: 'Past Week', value: CommunitySearchDurationEnum.Week },
  { text: 'Past Month', value: CommunitySearchDurationEnum.Month },
  { text: 'Past Year', value: CommunitySearchDurationEnum.Year }
];

export const CommunitySearchResultSortOptions: Array<{ text: string, value: number }> = [
  { text: 'Relevance', value: CommunitySearchSortByEnum.Relevance },
  { text: 'Date', value: CommunitySearchSortByEnum.Date }
];

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
