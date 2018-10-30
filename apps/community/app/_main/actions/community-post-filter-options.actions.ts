import { Action } from '@ngrx/store';

export const ADDING_COMMUNITY_TAG_TO_FILTER_OPTIONS = '[Community/Filter Options] ' +
  'Adding Community Tag To Filter Options';

export const ADDING_COMMUNITY_TAG_TO_FILTER_OPTIONS_SUCCESS = '[Community/Filter Options] ' +
  'Adding Community Tag To Filter Options Success';

export const ADDING_COMMUNITY_CATEGORY_TO_FILTER_OPTIONS = '[Community/Filter Options] ' +
  'Adding Community Category To Filter Options';

export const ADDING_COMMUNITY_CATEGORY_TO_FILTER_OPTIONS_SUCCESS = '[Community/Filter Options] ' +
  'Adding Community Category To Filter Options Success';

export const DELETING_COMMUNITY_TAG_FROM_FILTER_OPTIONS = '[Community/Filter Options] ' +
  'Deleting Community Tag To Filter Options';

export const DELETING_COMMUNITY_CATEGORY_FROM_FILTER_OPTIONS = '[Community/Filter Options] ' +
  'Deleting Community Category To Filter Options';

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

export class DeletingCommunityTagFromFilterOptions implements Action {
  readonly type = DELETING_COMMUNITY_TAG_FROM_FILTER_OPTIONS;
  constructor(public payload: any) {}
}

export class DeletingCommunityCategoryFromFilterOptions implements Action {
  readonly type = DELETING_COMMUNITY_CATEGORY_FROM_FILTER_OPTIONS;
  constructor(public payload: any) {}
}

export type Actions
  = AddingCommunityTagToFilterOptions
  | AddingCommunityTagToFilterOptionsSuccess
  | AddingCommunityCategoryToFilterOptions
  | AddingCommunityCategoryToFilterOptionsSuccess
  | DeletingCommunityTagFromFilterOptions
  | DeletingCommunityCategoryFromFilterOptions;
