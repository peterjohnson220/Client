import { Injectable } from '@angular/core';

import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, delay, map, mergeMap, switchMap, withLatestFrom } from 'rxjs/operators';

import { UserTicketApiService } from 'libs/data/payfactors-api';
import { UserTicketCompanyDetailResponse, UserTicketResponse } from 'libs/models/payfactors-api/service/response';
import { UserTicketCommentRequest } from 'libs/models/payfactors-api/service/request';

import * as fromTicketListActions from '../actions/ticket-list.actions';
import * as fromTicketLookupActions from '../actions/ticket-lookup.actions';
import * as fromTicketActions from '../actions/ticket.actions';
import * as fromReducers from '../reducers';
import { PayfactorsApiModelMapper } from '../helpers';

@Injectable()
export class TicketEffects {
  @Effect()
  initializeTicket$: Observable<Action> = this.actions$.pipe(
    ofType(fromTicketActions.INITIALIZE_TICKET_TAB),
    delay(0),
    switchMap((action: fromTicketActions.InitializeTicketTab) => of(action.payload)),
    switchMap((res) => [
      new fromTicketActions.LoadTicket(res)
    ])
  );

  @Effect()
  loadTicket$: Observable<Action> = this.actions$.pipe(
    ofType<fromTicketActions.LoadTicket>(fromTicketActions.LOAD_TICKET),
    withLatestFrom(
      this.store.select(fromReducers.getUserTicketTypes),
      this.store.select(fromReducers.getUserTicketStates),
      (action, userTicketTypes, userTicketStates) => {
        return {
          action,
          userTicketTypes,
          userTicketStates
        };
      }
    ),
    switchMap(obj =>
      this.userTicketApiService.getUserTicket(obj.action.payload).pipe(
        mergeMap((userTicket: UserTicketResponse) => {
          const ticket = PayfactorsApiModelMapper.mapUserTicketResponseToUserTicketItem(userTicket);
          const actions = [];
          actions.push(new fromTicketActions.LoadTicketSuccess(ticket));
          actions.push(new fromTicketActions.LoadCompanyDetail({
            companyId: userTicket.CompanyId
          }));

          if (!obj.userTicketTypes.length) {
            actions.push(new fromTicketLookupActions.LoadTicketTypes());
          }
          if (!obj.userTicketStates.length) {
            actions.push(new fromTicketLookupActions.LoadTicketStates());
          }
          return actions;
        }),
        catchError(error => of(new fromTicketActions.LoadTicketError()))
      )
    )
  );

  @Effect()
  loadCompanyDetail$: Observable<Action> = this.actions$.pipe(
    ofType(fromTicketActions.LOAD_COMPANY_DETAIL),
    switchMap((action: fromTicketActions.LoadCompanyDetail) =>
      this.userTicketApiService.getCompanyDetails(action.payload.companyId).pipe(
        map((companyDetailResponse: UserTicketCompanyDetailResponse) => {
          const companyDetail = PayfactorsApiModelMapper.mapUserTicketCompanyDetailResponseToCompanyDetail(companyDetailResponse);
          return new fromTicketActions.LoadCompanyDetailSuccess({
            companyDetail: companyDetail
          });
        }),
        catchError(error => of(new fromTicketActions.LoadCompanyDetailError()))
      )
    )
  );

  @Effect()
  updateUserTicket$: Observable<Action> = this.actions$.pipe(
    ofType(fromTicketActions.UPDATE_TICKET),
    switchMap((action: fromTicketActions.UpdateTicket) =>
      this.userTicketApiService.updateUserTicket(action.payload.userTicketId, action.payload.updateFields).pipe(
        mergeMap((userTicket: UserTicketResponse) => {
          const ticket = PayfactorsApiModelMapper.mapUserTicketResponseToUserTicketItem(userTicket);
          return [
            new fromTicketActions.UpdateTicketSuccess(ticket),
            new fromTicketActions.LoadCompanyDetail({
              companyId: userTicket.CompanyId
            }),
            new fromTicketListActions.SetGridDirtyStatus(true)
          ];
        }),
        catchError(error => of(new fromTicketActions.UpdateTicketError()))
      )
    )
  );

  @Effect()
  createTicketComment$: Observable<Action> = this.actions$.pipe(
    ofType(fromTicketActions.CREATE_COMMENT),
    switchMap((action: fromTicketActions.CreateComment) =>
      this.userTicketApiService.addComment(action.payload).pipe(
        mergeMap(() => {
          return [
            new fromTicketActions.LoadTicket(action.payload.UserTicketId)
          ];
        }),
        catchError(error => of(new fromTicketActions.CreateCommentError()))
      )
    )
  );

  @Effect()
  deleteTicketComment$: Observable<Action> = this.actions$.pipe(
    ofType(fromTicketActions.DELETE_COMMENT),
    switchMap((action: fromTicketActions.DeleteComment) =>
      this.userTicketApiService.deleteComment(action.payload).pipe(
        mergeMap(() => {
          return [
            new fromTicketActions.LoadTicket(action.payload.UserTicketId)
          ];
        }),
        catchError(error => of(new fromTicketActions.DeleteCommentError()))
      )
    )
  );

  @Effect()
  updateTicketComment$: Observable<Action> = this.actions$.pipe(
    ofType(fromTicketActions.UPDATE_COMMENT),
    switchMap((action: fromTicketActions.UpdateComment) =>
      this.userTicketApiService.updateComment(action.payload).pipe(
        mergeMap(() => {
          return [
            new fromTicketActions.LoadTicket(action.payload.UserTicketId)
          ];
        }),
        catchError(error => of(new fromTicketActions.UpdateCommentError()))
      )
    )
  );

  @Effect()
  replyClientNote$ = this.actions$
    .pipe(
      ofType(fromTicketActions.REPLY_CLIENT_NOTE),
      switchMap((action: fromTicketActions.ReplyClientNote) => {
        const request: UserTicketCommentRequest = {
          UserTicketId: action.payload.comment.TicketId,
          ParentTicketCommentId: action.payload.comment.CommentId,
          Comments: action.payload.content,
          Level: 'Admin'
        };
        return this.userTicketApiService.replyComment(request)
          .pipe(
            map((response) => new fromTicketActions.ReplyClientNoteSuccess(PayfactorsApiModelMapper.mapTicketCommentsToReplies(response))),
            catchError((error) => of(new fromTicketActions.ReplyClientNoteError()))
          );
      })
    );

  constructor(
    private actions$: Actions,
    private store: Store<fromReducers.State>,
    private userTicketApiService: UserTicketApiService
  ) { }
}
