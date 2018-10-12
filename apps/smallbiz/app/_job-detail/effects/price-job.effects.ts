import { Injectable } from '@angular/core';

import { Effect, Actions } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { of, Observable } from 'rxjs';
import { map, catchError, switchMap, debounceTime } from 'rxjs/operators';

import * as fromPriceJobAction from '../actions/price-job.actions';
import { LocationService } from '../../shared/services/location.service';

@Injectable()
export class PriceJobEffects {
  constructor(
    private actions$: Actions,
    private locationService: LocationService) { }

  @Effect()
  searchLocations: Observable<Action> = this.actions$
    .ofType(fromPriceJobAction.LOCATION_SEARCH_TERM_CHANGED).pipe(
      debounceTime(300),
      switchMap((action: fromPriceJobAction.LocationSearchTermChanged) => {
        return this.locationService.search(action.payload.searchTerm).pipe(
          map((response: any) => {
            return new fromPriceJobAction.LocationSearchSuccess({ locations: response });
          }),
          catchError(error => of(new fromPriceJobAction.LocationSearchFailure(error)))
        );
      })
    );
}
