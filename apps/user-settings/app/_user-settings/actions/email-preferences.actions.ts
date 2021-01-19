import { Action } from '@ngrx/store';

import { UserSubscriptionDto } from 'libs/models/payfactors-api/UserSubscriptionDto/user-subscription-dto.model';

import { UserSubscription } from '../models/communication-preferences';

export const GET_USER_SUBSCRIPTIONS = '[User Settings / User Settings Page] Get User Subscriptions';
export const GET_USER_SUBSCRIPTIONS_SUCCESS = '[User Settings / User Settings Page] Get User Subscriptions Success';
export const GET_USER_SUBSCRIPTIONS_ERROR = '[User Settings / User Settings Page] Get User Subscriptions Error';
export const UPDATE_USER_SUBSCRIPTIONS = '[User Settings / User Settings Page] Update User Subscriptions';
export const UPDATE_USER_SUBSCRIPTIONS_SUCCESS = '[User Settings / User Settings Page] Update User Subscriptions Success';
export const UPDATE_USER_SUBSCRIPTIONS_ERROR = '[User Settings / User Settings Page] Update User Subscriptions Error';
export const TOGGLE_USER_SUBSCRIPTION = '[User Settings / User Settings Page] Toggle User Subscription';

export class GetUserSubscriptions implements Action {
  readonly type = GET_USER_SUBSCRIPTIONS;
  constructor() {}
}
export class GetUserSubscriptionsSuccess implements Action {
  readonly type = GET_USER_SUBSCRIPTIONS_SUCCESS;
  constructor(public payload: UserSubscriptionDto[]) {}
}
export class GetUserSubscriptionsError implements Action {
  readonly type = GET_USER_SUBSCRIPTIONS_ERROR;
  constructor() {}
}
export class UpdateUserSubscriptions implements Action {
  readonly type = UPDATE_USER_SUBSCRIPTIONS;
  constructor(public payload: UserSubscription[]) {}
}
export class UpdateUserSubscriptionsSuccess implements Action {
  readonly type = UPDATE_USER_SUBSCRIPTIONS_SUCCESS;
  constructor() {}
}
export class UpdateUserSubscriptionError implements Action {
  readonly type = UPDATE_USER_SUBSCRIPTIONS_ERROR;
  constructor() {}
}
export class ToggleUserSubscription implements Action {
  readonly type = TOGGLE_USER_SUBSCRIPTION;
  constructor(public payload: any) {}
}

export type Actions =
  GetUserSubscriptions
| GetUserSubscriptionsSuccess
| GetUserSubscriptionsError
| UpdateUserSubscriptions
| UpdateUserSubscriptionsSuccess
| UpdateUserSubscriptionError
| ToggleUserSubscription;
