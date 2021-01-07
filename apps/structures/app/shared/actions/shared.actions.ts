import { Action } from '@ngrx/store';

import { RangeGroupMetadata } from 'libs/models/structures';

export const SET_METADATA = '[Structures - Shared] Set Metadata';

export class SetMetadata implements Action {
  readonly type = SET_METADATA;

  constructor(public payload: RangeGroupMetadata) {}
}

export type SharedActions
  = SetMetadata;

