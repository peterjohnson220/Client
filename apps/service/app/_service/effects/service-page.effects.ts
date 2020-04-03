import { Injectable } from '@angular/core';

import { Effect, Actions, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { switchMap, catchError, map, mergeMap } from 'rxjs/operators';

import { UserTicketApiService } from 'libs/data/payfactors-api/index';
import * as fromPfDataGridActions from 'libs/features/pf-data-grid/actions';

import * as fromServicePageActions from '../actions/service-page.actions';
import { PayfactorsApiModelMapper } from '../helpers/payfactors-api-model-mapper.helper';
import { ServicePageConfig } from '../models';

@Injectable()
export class ServicePageEffects {

  @Effect()
  loadTicketTypes$ = this.actions$
    .pipe(
      ofType(fromServicePageActions.LOAD_TICKET_TYPES),
      switchMap((action: fromServicePageActions.LoadTicketTypes) => {
        return this.userTicketApiService.getUserTicketTypes()
          .pipe(
            map((response) => new fromServicePageActions.LoadTicketTypesSuccess(PayfactorsApiModelMapper.mapTicketTypeResponseToTicketTypes(response))),
            catchError((error) => of(new fromServicePageActions.LoadTicketTypesError(error)))
          );
      })
    );

  @Effect()
  createUserTicket$ = this.actions$
    .pipe(
      ofType(fromServicePageActions.CREATE_USER_TICKET),
      switchMap((action: fromServicePageActions.CreateUserTicket) => {
        return this.userTicketApiService.createUserTicket({
          UserTicket: action.payload.ticket,
          FileData: action.payload.fileData
        }).pipe(
            map((response) => new fromServicePageActions.CreateUserTicketSuccess()),
            catchError((error) => of(new fromServicePageActions.CreateUserTicketError('Error creating ticket. Please try again later')))
          );
      })
    );

  @Effect()
  createUserTicketSuccess$ = this.actions$
    .pipe(
      ofType(fromServicePageActions.CREATE_USER_TICKET_SUCCESS),
      mergeMap(() => [
        new fromPfDataGridActions.LoadData(ServicePageConfig.ServicePageViewId),
        new fromServicePageActions.ShowNewTicketModal(false)
        ])
    );

  constructor(
    private actions$: Actions,
    private userTicketApiService: UserTicketApiService
  ) {}
}
