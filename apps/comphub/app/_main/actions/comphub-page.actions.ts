import { Action } from '@ngrx/store';

export const ACCORDION_CARD_CHANGE = '[Comphub/Comphub Page] Accordion Card Change';

export class AccordionCardChange implements Action {
  readonly type = ACCORDION_CARD_CHANGE;

  constructor(public payload: { cardId: string }) {}
}

export type Actions
  = AccordionCardChange;
