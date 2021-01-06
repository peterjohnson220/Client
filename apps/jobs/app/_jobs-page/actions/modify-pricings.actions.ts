import { Action } from '@ngrx/store';

import {
  DeletePricingRequest,
  UpdatePricingMatchRequest,
  UpdatePricingRequest
} from 'libs/models/payfactors-api';

export const RESET_MODIFY_PRICINGS_MODALS = '[Modify Pricings] Reset Modify Pricings Modals';
export const DELETING_PRICING = '[Modify Pricings] Deleting Pricing';
export const DELETING_PRICING_SUCCESS = '[Modify Pricings] Deleting Pricing Success';
export const DELETING_PRICING_ERROR = '[Modify Pricings] Deleting Pricing Error';
export const UPDATING_PRICING = '[Modify Pricings] Updating Pricing';
export const UPDATING_PRICING_SUCCESS = '[Modify Pricings] Updating Pricing Success';
export const UPDATING_PRICING_ERROR = '[Modify Pricings] Updating Pricing Error';
export const DELETING_PRICING_MATCH = '[Modify Pricings] Deleting Pricing Match';
export const DELETING_PRICING_MATCH_SUCCESS = '[Modify Pricings] Deleting Pricing Match Success';
export const DELETING_PRICING_MATCH_ERROR = '[Modify Pricings] Deleting Pricing Match Error';
export const UPDATING_PRICING_MATCH = '[Modify Pricings] Updating Pricing Match';
export const UPDATING_PRICING_MATCH_SUCCESS = '[Modify Pricings] Updating Pricing Match Success';
export const UPDATING_PRICING_MATCH_ERROR = '[Modify Pricings] Updating Pricing Match Error';
export const REFRESH_LINKED_PRICINGS = '[Modify Pricings] Refresh Linked Pricings';
export const DELETE_PRICING_AND_MATCH = '[Modify Pricings] Deleting Pricing And Match';

export class ResetModifyPricingsModals implements Action {
  readonly type = RESET_MODIFY_PRICINGS_MODALS;
  constructor() { }
}

export class DeletingPricing implements Action {
  readonly type = DELETING_PRICING;
  constructor(public payload: DeletePricingRequest) { }
}

export class DeletingPricingSuccess implements Action {
  readonly type = DELETING_PRICING_SUCCESS;
  constructor() { }
}

export class DeletingPricingError implements Action {
  readonly type = DELETING_PRICING_ERROR;
  constructor(public error: any) { }
}

export class UpdatingPricing implements Action {
  readonly type = UPDATING_PRICING;
  constructor(public request: UpdatePricingRequest, public payfactorsGridPageViewId: string) { }
}

export class UpdatingPricingSuccess implements Action {
  readonly type = UPDATING_PRICING_SUCCESS;
  constructor() { }
}

export class UpdatingPricingError implements Action {
  readonly type = UPDATING_PRICING_ERROR;
  constructor(public error: any) { }
}

export class DeletingPricingMatch implements Action {
  readonly type = DELETING_PRICING_MATCH;
  constructor(public payload: any) { }
}

export class DeletingPricingMatchSuccess implements Action {
  readonly type = DELETING_PRICING_MATCH_SUCCESS;
  constructor() { }
}

export class DeletingPricingMatchError implements Action {
  readonly type = DELETING_PRICING_MATCH_ERROR;
  constructor(public error: any) { }
}

export class UpdatingPricingMatch implements Action {
  readonly type = UPDATING_PRICING_MATCH;
  constructor(public request: UpdatePricingMatchRequest, public pricingId: number, public matchesGridPageViewId: string) { }
}

export class UpdatingPricingMatchSuccess implements Action {
  readonly type = UPDATING_PRICING_MATCH_SUCCESS;
  constructor() { }
}

export class UpdatingPricingMatchError implements Action {
  readonly type = UPDATING_PRICING_MATCH_ERROR;
  constructor(public error: any) { }
}

export class RefreshLinkedPricings implements Action {
  readonly type = REFRESH_LINKED_PRICINGS;
  constructor(public pricingIds: number[]) { }
}

export class DeletePricingAndMatch implements  Action {
  readonly type = DELETE_PRICING_AND_MATCH;
  constructor(public payload: any) { }
}

export type ModifyPricingsActions
  = ResetModifyPricingsModals
  | DeletingPricing
  | DeletingPricingSuccess
  | DeletingPricingError
  | UpdatingPricing
  | UpdatingPricingSuccess
  | UpdatingPricingError
  | DeletingPricingMatch
  | DeletingPricingMatchSuccess
  | DeletingPricingMatchError
  | UpdatingPricingMatch
  | UpdatingPricingMatchSuccess
  | UpdatingPricingMatchError
  | RefreshLinkedPricings
  | DeletePricingAndMatch;
