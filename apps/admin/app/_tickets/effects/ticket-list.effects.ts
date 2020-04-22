import { Injectable } from '@angular/core';

import { Action, Store } from '@ngrx/store';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { switchMap, catchError, mergeMap, withLatestFrom, map } from 'rxjs/operators';
import { GridDataResult } from '@progress/kendo-angular-grid';

import { UserTicketApiService } from 'libs/data/payfactors-api';

import * as fromTicketActions from '../actions/ticket.actions';
import * as fromTicketListActions from '../actions/ticket-list.actions';
import * as fromTicketLookupActions from '../actions/ticket-lookup.actions';
import { PayfactorsApiModelMapper } from '../helpers';
import * as fromReducers from '../reducers';

@Injectable()
export class TicketListEffects {
  @Effect()
  initTickets$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromTicketListActions.INIT_TICKETS),
      switchMap((action: fromTicketListActions.InitTickets) =>
        [
          new fromTicketLookupActions.LoadTicketTypes(),
          new fromTicketLookupActions.LoadTicketStates(),
          new fromTicketLookupActions.LoadPfServiceReps()
        ]
      )
    );

  @Effect()
  initTicketsCheck$: Observable<Action> = this.actions$.pipe(
    ofType<fromTicketActions.LoadTicket>(fromTicketListActions.INIT_TICKETS_CHECK),
    withLatestFrom(
      this.store.select(fromReducers.getPfServiceReps),
      this.store.select(fromReducers.getUserTicketTypes),
      this.store.select(fromReducers.getUserTicketStates),
      (action, serviceReps, userTicketTypes, userTicketStates) => {
        return { action, serviceReps, userTicketTypes, userTicketStates };
      }
    ),
    switchMap(obj => {
      const actions = [];
      if (obj.userTicketTypes.length && obj.userTicketStates.length && obj.serviceReps.length) {
        actions.push(new fromTicketListActions.InitTicketsSuccess());
      }
      return actions;
    })
  );

  @Effect()
  loadTickets$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromTicketListActions.LOAD_TICKETS),
      switchMap((action: fromTicketListActions.LoadTickets) =>
        this.userTicketApiService.searchUserTickets(action.payload).pipe(
          mergeMap((gridResult: GridDataResult) => {
            const resTransformed = {
              data: PayfactorsApiModelMapper.mapUserTicketResponseToUserTicketGridItem(gridResult.data),
              total: gridResult.total
            };
            return [
              new fromTicketListActions.LoadTicketsSuccess(resTransformed),
              new fromTicketListActions.SetGridDirtyStatus(false)
            ];
          }),
          catchError(error => of(new fromTicketListActions.LoadTicketsError()))
        )
      )
    );

  @Effect()
  exportTickets$ = this.actions$
    .pipe(
      ofType(fromTicketListActions.EXPORT_GRID),
      switchMap((action: fromTicketListActions.ExportGrid) => {
        return this.userTicketApiService.exportGrid(action.payload)
          .pipe(
            map(response => new fromTicketListActions.ExportGridSuccess()),
            catchError(() => of(new fromTicketListActions.ExportGridError()))
          );
      })
    );

  constructor(
    private actions$: Actions,
    private store: Store<fromReducers.State>,
    private userTicketApiService: UserTicketApiService
  ) { }
}
