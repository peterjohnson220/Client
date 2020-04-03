import { Injectable } from '@angular/core';

import { Effect, Actions, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { switchMap, catchError, map  } from 'rxjs/operators';

import { UserTicketApiService } from 'libs/data/payfactors-api/index';

import * as fromServicePageActions from '../actions/service-page.actions';

@Injectable()
export class ServicePageEffects {

  @Effect()
  loadTicketTypes$ = this.actions$
    .pipe(
      ofType(fromServicePageActions.LOAD_TICKET_TYPES),
      switchMap((action: fromServicePageActions.LoadTicketTypes) => {
        return this.userTicketApiService.getUserTicketTypes()
          .pipe(
            map((response) => new fromServicePageActions.LoadTicketTypesSuccess(response)),
            catchError((error) => of(new fromServicePageActions.LoadTicketTypesError(error)))
          );
      })
    );

  constructor(
    private actions$: Actions,
    private userTicketApiService: UserTicketApiService
  ) {}
}
