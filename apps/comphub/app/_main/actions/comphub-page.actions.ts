import { Action } from '@ngrx/store';

export const NAVIGATE_TO_CARD = '[Comphub/Comphub Page] Navigate to Card';
export const NAVIGATE_TO_NEXT_CARD = '[Comphub/Comphub Page] Navigate to Next Card';
export const NAVIGATE_TO_PREVIOUS_CARD = '[Comphub/Comphub Page] Navigate to Previous Card';

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

export type Actions
  = NavigateToCard
  | NavigateToNextCard
  | NavigateToPreviousCard;
