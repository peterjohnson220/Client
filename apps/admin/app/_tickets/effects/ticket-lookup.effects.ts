import { Injectable } from '@angular/core';

import { Actions, Effect } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import { UserApiService, UserTicketApiService } from 'libs/data/payfactors-api';
import { UserTicketStateResponse, UserTicketTypeResponse } from 'libs/models/payfactors-api/service/response';
import { UserResponse } from 'libs/models/payfactors-api/user/response';

import * as fromTicketLookupActions from '../actions/ticket-lookup.actions';
import { PayfactorsApiModelMapper } from '../helpers';

@Injectable()
export class TicketLookupEffects {
  @Effect()
  loadServiceReps$: Observable<Action> = this.actions$
    .ofType(fromTicketLookupActions.LOAD_PFSERVICESREPS).pipe(
      switchMap((action: fromTicketLookupActions.LoadPfServiceReps) =>
        this.userApiService.getPfServicesReps().pipe(
          map((userResponses: UserResponse[]) => {
            const servicesReps = PayfactorsApiModelMapper.mapUserResponseToPfServicesRep(userResponses);
            return new fromTicketLookupActions.LoadPfServiceRepsSuccess(servicesReps);
          }),
          catchError(error => of(new fromTicketLookupActions.LoadPfServiceRepsError()))
        )
      )
    );

  @Effect()
  loadTicketStates$: Observable<Action> = this.actions$
    .ofType(fromTicketLookupActions.LOAD_TICKETSTATES).pipe(
      switchMap((action: fromTicketLookupActions.LoadTicketStates) =>
        this.userTicketApiService.getUserTicketStates().pipe(
          map((ticketStates: UserTicketStateResponse[]) => {
            const states = PayfactorsApiModelMapper.mapUserTicketStatesResposnseToUserTicketState(ticketStates);
            return new fromTicketLookupActions.LoadTicketStatesSuccess(states);
          }),
          catchError(error => of(new fromTicketLookupActions.LoadTicketStatesError()))
        )
      )
    );

  @Effect()
  loadTicketTypes$: Observable<Action> = this.actions$
    .ofType(fromTicketLookupActions.LOAD_TICKETSTATES).pipe(
      switchMap((action: fromTicketLookupActions.LoadTicketTypes) =>
        this.userTicketApiService.getUserTicketTypes().pipe(
          map((ticketTypes: UserTicketTypeResponse[]) => {
            return new fromTicketLookupActions.LoadTicketTypesSuccess(ticketTypes);
          }),
          catchError(error => of(new fromTicketLookupActions.LoadTicketTypesError()))
        )
      )
    );

  constructor(
    private actions$: Actions,
    private userApiService: UserApiService,
    private userTicketApiService: UserTicketApiService
  ) {}
}

