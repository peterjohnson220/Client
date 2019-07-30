import { Action } from '@ngrx/store';

export const ADDING_COMMUNITY_TAG_TO_FILTER_OPTIONS = '[Community/Filter Options] Adding Community Tag To Filter Options';
export const ADDING_COMMUNITY_TAG_TO_FILTER_OPTIONS_SUCCESS = '[Community/Filter Options] Adding Community Tag To Filter Options Success';
export const ADDING_COMMUNITY_CATEGORY_TO_FILTER_OPTIONS = '[Community/Filter Options] Adding Category To Filter Options';
export const ADDING_COMMUNITY_CATEGORY_TO_FILTER_OPTIONS_SUCCESS = '[Community/Filter Options] Adding Category To Filter Options Success';
export const ADDING_COMMUNITY_POST_TO_FILTER_OPTIONS = '[Community/Filter Options] Adding Community Post To Filter Options';
export const ADDING_COMMUNITY_POST_REPLY_TO_FILTER_OPTIONS = '[Community/Filter Options] Adding Community Post Reply To Filter Options';
export const DELETING_COMMUNITY_TAG_FROM_FILTER_OPTIONS = '[Community/Filter Options] Deleting Community Tag To Filter Options';
export const DELETING_COMMUNITY_CATEGORY_FROM_FILTER_OPTIONS = '[Community/Filter Options] Deleting Community Category To Filter Options';
export const DELETING_ALL_FILTER_OPTIONS = '[Community/Filter Options] Deleting All Filter Options';
export const ADDING_COMMUNITY_INDUSTRY_TO_FILTER_OPTIONS =
  '[Community/Filter Options] Adding Community Industry To Filter Options';
export const ADDING_COMMUNITY_INDUSTRY_TO_FILTER_OPTIONS_SUCCESS =
'[Community/Filter Options] Adding Community Industry To Filter Options Success';
export const DELETING_COMMUNITY_INDUSTRY_FROM_FILTER_OPTIONS =
  '[Community/Filter Options] Deleting Community Industry To Filter Options';

export const ADDING_COMMUNITY_COMPANY_SIZE_TO_FILTER_OPTIONS =
  '[Community/Filter Options] Adding Community Company Size To Filter Options';
export const ADDING_COMMUNITY_COMPANY_SIZE_TO_FILTER_OPTIONS_SUCCESS =
'[Community/Filter Options] Adding Community Company Size To Filter Options Success';
export const DELETING_COMMUNITY_COMPANY_SIZE_FROM_FILTER_OPTIONS =
  '[Community/Filter Options] Deleting Community Company Size To Filter Options';

export const CHANGING_COMMUNITY_TOPIC_FILTER_OPTIONS =
  '[Community/Filter Options] Changing Community Topic Filter Options';
export const CHANGING_COMMUNITY_TOPIC_FILTER_OPTIONS_SUCCESS =
  '[Community/Filter Options] Changing Community Topic Filter Options Success';
export const DELETING_COMMUNITY_TOPIC_FROM_FILTER_OPTIONS =
  '[Community/Filter Options] Deleting Community Topic from Filter Options';
export const DELETING_COMMUNITY_TOPIC_FROM_FILTER_OPTIONS_SUCCESS =
  '[Community/Filter Options] Deleting Community Topic from Filter Options Success';


export class AddingCommunityTagToFilterOptions implements Action {
  readonly type = ADDING_COMMUNITY_TAG_TO_FILTER_OPTIONS;
  constructor(public payload: any) {}
}

export class AddingCommunityTagToFilterOptionsSuccess implements Action {
  readonly type = ADDING_COMMUNITY_TAG_TO_FILTER_OPTIONS_SUCCESS;
  constructor(public payload: any) {}
}

export class AddingCommunityCategoryToFilterOptions implements Action {
  readonly type = ADDING_COMMUNITY_CATEGORY_TO_FILTER_OPTIONS;
  constructor(public payload: any) {}
}

export class AddingCommunityCategoryToFilterOptionsSuccess implements Action {
  readonly type = ADDING_COMMUNITY_CATEGORY_TO_FILTER_OPTIONS_SUCCESS;
  constructor(public payload: any) {}
}

export class AddingCommunityPostToFilterOptions implements Action {
  readonly type = ADDING_COMMUNITY_POST_TO_FILTER_OPTIONS;
  constructor(public payload: any) {}
}
export class AddingCommunityPostReplyToFilterOptions implements Action {
  readonly type = ADDING_COMMUNITY_POST_REPLY_TO_FILTER_OPTIONS;
  constructor(public payload: any) {}
}
export class DeletingCommunityTagFromFilterOptions implements Action {
  readonly type = DELETING_COMMUNITY_TAG_FROM_FILTER_OPTIONS;
  constructor(public payload: any) {}
}

export class DeletingCommunityCategoryFromFilterOptions implements Action {
  readonly type = DELETING_COMMUNITY_CATEGORY_FROM_FILTER_OPTIONS;
  constructor(public payload: any) {}
}

export class DeletingAllFilterOptions implements Action {
  readonly type = DELETING_ALL_FILTER_OPTIONS;
}

export class AddingCommunityIndustryToFilterOptions implements Action {
  readonly type = ADDING_COMMUNITY_INDUSTRY_TO_FILTER_OPTIONS;
  constructor(public payload: any) {}
}

export class AddingCommunityIndustryToFilterOptionsSuccess implements Action {
  readonly type = ADDING_COMMUNITY_INDUSTRY_TO_FILTER_OPTIONS_SUCCESS;
  constructor(public payload: any) {}
}

export class DeletingCommunityIndustryFromFilterOptions implements Action {
  readonly type = DELETING_COMMUNITY_INDUSTRY_FROM_FILTER_OPTIONS;
  constructor(public payload: any) {}
}

export class AddingCommunityCompanySizeToFilterOptions implements Action {
  readonly type = ADDING_COMMUNITY_COMPANY_SIZE_TO_FILTER_OPTIONS;
  constructor(public payload: any) {}
}

export class AddingCommunityCompanySizeToFilterOptionsSuccess implements Action {
  readonly type = ADDING_COMMUNITY_COMPANY_SIZE_TO_FILTER_OPTIONS_SUCCESS;
  constructor(public payload: any) {}
}

export class DeletingCommunityCompanySizeFromFilterOptions implements Action {
  readonly type = DELETING_COMMUNITY_COMPANY_SIZE_FROM_FILTER_OPTIONS;
  constructor(public payload: any) {}
}

export class ChangingCommunityTopicFilterOptions implements Action {
  readonly type = CHANGING_COMMUNITY_TOPIC_FILTER_OPTIONS;
  constructor(public payload: any) {}
}

export class ChangingCommunityTopicFilterOptionsSuccess implements Action {
  readonly type = CHANGING_COMMUNITY_TOPIC_FILTER_OPTIONS_SUCCESS;
  constructor(public payload: any) {}
}

export class DeletingCommunityTopicFromFilterOptions implements Action {
  readonly type = DELETING_COMMUNITY_TOPIC_FROM_FILTER_OPTIONS;
  constructor(public payload: any) {}
}

export class DeletingCommunityTopicFromFilterOptionsSuccess implements Action {
  readonly type = DELETING_COMMUNITY_TOPIC_FROM_FILTER_OPTIONS_SUCCESS;
  constructor() {}
}



export type Actions
  = AddingCommunityTagToFilterOptions
  | AddingCommunityTagToFilterOptionsSuccess
  | AddingCommunityCategoryToFilterOptions
  | AddingCommunityCategoryToFilterOptionsSuccess
  | AddingCommunityPostToFilterOptions
  | AddingCommunityPostReplyToFilterOptions
  | DeletingCommunityTagFromFilterOptions
  | DeletingCommunityCategoryFromFilterOptions
  | DeletingAllFilterOptions
  | AddingCommunityIndustryToFilterOptions
  | AddingCommunityIndustryToFilterOptionsSuccess
  | DeletingCommunityIndustryFromFilterOptions
  | AddingCommunityCompanySizeToFilterOptions
  | AddingCommunityCompanySizeToFilterOptionsSuccess
  | DeletingCommunityCompanySizeFromFilterOptions
  | ChangingCommunityTopicFilterOptions
  | ChangingCommunityTopicFilterOptionsSuccess
  | DeletingCommunityTopicFromFilterOptions
  | DeletingCommunityTopicFromFilterOptionsSuccess;

