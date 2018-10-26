import { Action } from '@ngrx/store';
import { CommunityCategory } from 'libs/models/community/community-categories.model';

export const GETTING_COMMUNITY_CATEGORIES = '[Community/Categories] Get Community Categories';
export const GETTING_COMMUNITY_CATEGORIES_SUCCESS = '[Community/Categories] Get Community Categories Success';
export const GETTING_COMMUNITY_CATEGORIES_ERROR = '[Community/Categories] Get Community Categories Error';
export const ADDING_COMMUNITY_POST_TO_CATEGORIES_COUNT = '[Community/Categories] Add To Community Categories Count';
export const SUBTRACTING_COMMUNITY_POST_TO_CATEGORIES_COUNT = '[Community/Categories] Subtract To Community Categories Count';

export class GettingCommunityCategories implements Action {
  readonly type = GETTING_COMMUNITY_CATEGORIES;
  constructor() {}
}

export class GettingCommunityCategoriesSuccess implements Action {
  readonly type = GETTING_COMMUNITY_CATEGORIES_SUCCESS;
  constructor(public payload: CommunityCategory[]) {}
}

export class GettingCommunityCategoriesError implements Action {
  readonly type = GETTING_COMMUNITY_CATEGORIES_ERROR;
  constructor() {}
}

export class AddingCommunityPostToCategoriesCount implements Action {
  readonly type = ADDING_COMMUNITY_POST_TO_CATEGORIES_COUNT;
  constructor(public payload: any) {}
}

export class SubtractingCommunityPostToCategoriesCount implements Action {
  readonly type = SUBTRACTING_COMMUNITY_POST_TO_CATEGORIES_COUNT;
  constructor(public payload: any) {}
}

export type Actions
  =  GettingCommunityCategories
  | GettingCommunityCategoriesSuccess
  | GettingCommunityCategoriesError
  | AddingCommunityPostToCategoriesCount
  | SubtractingCommunityPostToCategoriesCount;
