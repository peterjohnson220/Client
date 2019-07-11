import { Injectable } from '@angular/core';

import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import {catchError, mergeMap, switchMap} from 'rxjs/operators';

import { UserApiService, UserTicketApiService } from 'libs/data/payfactors-api';
import { UserTicketStateResponse, UserTicketTypeResponse } from 'libs/models/payfactors-api/service/response';
import { UserResponse } from 'libs/models/payfactors-api/user/response';

import * as fromTicketListActions from '../actions/ticket-list.actions';
import * as fromTicketLookupActions from '../actions/ticket-lookup.actions';
import { PayfactorsApiModelMapper } from '../helpers';

@Injectable()
export class TicketLookupEffects {
  @Effect()
  loadServiceReps$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromTicketLookupActions.LOAD_PFSERVICESREPS),
      mergeMap((action: fromTicketLookupActions.LoadPfServiceReps) =>
        this.userApiService.getPfServicesReps().pipe(
          switchMap((userResponses: UserResponse[]) => {
            const servicesReps = PayfactorsApiModelMapper.mapUserResponseToPfServicesRep(userResponses);
            return [
              new fromTicketLookupActions.LoadPfServiceRepsSuccess(servicesReps),
              new fromTicketListActions.InitTicketsCheck()
            ];
          }),
          catchError(error => of(new fromTicketLookupActions.LoadPfServiceRepsError()))
        )
      )
    );

  @Effect()
  loadTicketStates$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromTicketLookupActions.LOAD_TICKETSTATES),
      mergeMap((action: fromTicketLookupActions.LoadTicketStates) =>
        this.userTicketApiService.getUserTicketStates().pipe(
          switchMap((ticketStates: UserTicketStateResponse[]) => {
            const states = PayfactorsApiModelMapper.mapUserTicketStatesResposnseToUserTicketState(ticketStates);
            return [
              new fromTicketLookupActions.LoadTicketStatesSuccess(states),
              new fromTicketListActions.InitTicketsCheck()
            ];
          }),
          catchError(error => of(new fromTicketLookupActions.LoadTicketStatesError()))
        )
      )
    );

  @Effect()
  loadTicketTypes$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromTicketLookupActions.LOAD_TICKETTYPES),
      mergeMap((action: fromTicketLookupActions.LoadTicketTypes) =>
        this.userTicketApiService.getUserTicketTypes().pipe(
          switchMap((ticketTypes: UserTicketTypeResponse[]) => {
            const types = PayfactorsApiModelMapper.mapUserTicketTypeResponseToTicketType(ticketTypes);
            return [
              new fromTicketLookupActions.LoadTicketTypesSuccess(types),
              new fromTicketListActions.InitTicketsCheck()
            ];
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

