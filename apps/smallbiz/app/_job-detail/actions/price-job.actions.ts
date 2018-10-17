import { Action } from '@ngrx/store';
import { Location } from '../../shared/models/location';

export const LOCATION_SEARCH_TERM_CHANGED = '[PRICE JOB] LocationSearchTermChanged';
export const LOCATION_SEARCH_SUCCESS = '[PRICE JOB] LocationSearchSuccess';
export const LOCATION_SEARCH_FAILURE = '[PRICE JOB] LocationSearchFailure';
export const LOCATION_SELECTION_CHANGED = '[PRICE JOB] LocationSelectionChanged';

export class LocationSearchTermChanged implements Action {
    readonly type = LOCATION_SEARCH_TERM_CHANGED;
    constructor(public payload: { searchTerm: string }) { }
}

export class LocationSearchSuccess implements Action {
    readonly type = LOCATION_SEARCH_SUCCESS;
    constructor(public payload: { locations: Location[] }) { }
}

export class LocationSearchFailure implements Action {
    readonly type = LOCATION_SEARCH_FAILURE;
    constructor(public payload: any) { }
}

export class LocationSelectionChanged implements Action {
    readonly type = LOCATION_SELECTION_CHANGED;
    constructor(public payload: { location: Location }) { }
}

export type PriceJobAction =
    LocationSearchTermChanged |
    LocationSearchSuccess |
    LocationSearchFailure |
    LocationSelectionChanged;
