import { Action } from '@ngrx/store';

import { ComphubPages } from '../data';

export const INIT = '[Comphub/Comphub Page] Init Comphub Page';
export const NAVIGATE_TO_CARD = '[Comphub/Comphub Page] Navigate to Card';
export const NAVIGATE_TO_NEXT_CARD = '[Comphub/Comphub Page] Navigate to Next Card';
export const NAVIGATE_TO_PREVIOUS_CARD = '[Comphub/Comphub Page] Navigate to Previous Card';
export const ADD_ACCESSIBLE_PAGES = '[Comphub/Comphub Page] Add Accessible Pages';
export const REMOVE_ACCESSIBLE_PAGES = '[Comphub/Comphub Page] Remove Accessible Pages';
export const RESET_ACCESSIBLE_PAGES = '[Comphub/Comphub Page] Reset Accessible Pages';
export const UPDATE_CARD_SUBTITLE = '[Comphub/Comphub Page] Update Card Subtitle';

export class Init implements Action {
  readonly type = INIT;

  constructor() {}
}

export class NavigateToCard implements Action {
  readonly type = NAVIGATE_TO_CARD;

  constructor(public payload: { cardId: string }) {}
}

export class NavigateToNextCard implements Action {
  readonly type = NAVIGATE_TO_NEXT_CARD;

  constructor() {}
}

export class NavigateToPreviousCard implements Action {
  readonly type = NAVIGATE_TO_PREVIOUS_CARD;

  constructor() {}
}

export class AddAccessiblePages implements Action {
  readonly type = ADD_ACCESSIBLE_PAGES;

  constructor(public payload: ComphubPages[]) {}
}

export class RemoveAccessiblePages implements Action {
  readonly type = REMOVE_ACCESSIBLE_PAGES;

  constructor(public payload: ComphubPages[]) {}
}

export class ResetAccessiblePages implements Action {
  readonly type = RESET_ACCESSIBLE_PAGES;

  constructor() {}
}

export class UpdateCardSubtitle implements Action {
  readonly type = UPDATE_CARD_SUBTITLE;

  constructor(public payload: { cardId: ComphubPages, subTitle: string }) {}
}

export type Actions
  = Init
  | NavigateToCard
  | NavigateToNextCard
  | NavigateToPreviousCard
  | AddAccessiblePages
  | RemoveAccessiblePages
  | ResetAccessiblePages
  | UpdateCardSubtitle;
