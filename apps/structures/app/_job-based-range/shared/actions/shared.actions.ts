import { Action } from '@ngrx/store';

import { RangeGroupMetadata } from "../models";

export const SET_METADATA = '[Structures - Job Based Range - Shared] Set Metadata';

export class SetMetadata implements Action {
  readonly type = SET_METADATA;

  constructor(public payload: RangeGroupMetadata) {}
}

export type SharedActions
  = SetMetadata;
