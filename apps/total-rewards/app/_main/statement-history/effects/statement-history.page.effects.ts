import { Injectable } from '@angular/core';

import { Action, select, Store } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, switchMap, withLatestFrom } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

import { Statement } from 'libs/features/total-rewards/total-rewards-statement/models';
import { StatementHistoryListViewModel } from 'libs/features/total-rewards/total-rewards-statement/models/statement-history-list-view-model';
import {
  TotalRewardsApiService,
  TotalRewardsEDeliveryApiService,
  TotalRewardsStatementHistoryApiService
} from 'libs/data/payfactors-api';
import { StatementHistoryListResponse } from 'libs/models/payfactors-api/total-rewards/response/statement-history-list-response.model';
import {
  NotificationLevel, NotificationPayloadFileType,
  NotificationSource,
  NotificationType
} from 'libs/features/infrastructure/app-notifications';
import * as fromAppNotificationsActions from 'libs/features/infrastructure/app-notifications/actions/app-notifications.actions';

import * as fromStatementHistoryPageActions from '../../statement-history/actions/statement-history.page.actions';
import * as fromTotalRewardsReducer from '../reducers';

@Injectable()
export class StatementHistoryPageEffects {
  @Effect()
  loadStatement$ = this.actions$
    .pipe(
      ofType(fromStatementHistoryPageActions.LOAD_STATEMENT),
      switchMap((action: fromStatementHistoryPageActions.LoadStatement) =>
        this.totalRewardsApi.getStatementFromId(action.payload.statementId).pipe(
          map((response: Statement) => new fromStatementHistoryPageActions.LoadStatementSuccess(response)),
          catchError(error => of(new fromStatementHistoryPageActions.LoadStatementError(error)))
        )
      )
    );

    @Effect()
    loadStatementHistory$ = this.actions$
      .pipe(
        ofType(fromStatementHistoryPageActions.LOAD_STATEMENT_HISTORY),
        withLatestFrom(
          this.store.pipe(select(fromTotalRewardsReducer.getStatement)),
          this.store.pipe(select(fromTotalRewardsReducer.getStatementHistoryGridState)),
          (action: fromStatementHistoryPageActions.LoadStatementHistory, statement: Statement, gridState) => ({ statement, gridState })),
          switchMap(gridData =>
            this.totalRewardsStatementHistoryApi.getStatementHistory({
              StatementId: gridData.statement.StatementId,
              Count: gridData.gridState.take,
              From: gridData.gridState.skip,
              SortBy: gridData.gridState.sort?.length ? gridData.gridState.sort[0].field : null,
              SortDirection: gridData.gridState.sort?.length ? gridData.gridState.sort[0].dir : null
            }).pipe(
              map((response: StatementHistoryListResponse) => new fromStatementHistoryPageActions.LoadStatementHistorySuccess(response)),
              catchError(error => of(new fromStatementHistoryPageActions.LoadStatementHistoryError(error)))
            )
          )
      );

  @Effect()
  getHistoricalStatementDownload$: Observable<Action> =
    this.actions$.pipe(
      ofType(fromStatementHistoryPageActions.DOWNLOAD_HISTORICAL_STATEMENT),
      withLatestFrom(
        this.store.pipe(select(fromTotalRewardsReducer.getPdfIdToExport)),
        this.store.pipe(select(fromTotalRewardsReducer.getStatementHistoryToExport)),
        (action: fromStatementHistoryPageActions.DownloadHistoricalStatement, pdfId: string, statementHistory: StatementHistoryListViewModel) =>
          ({ pdfId, statement: statementHistory })),
      switchMap(data =>
        this.totalRewardsStatementHistoryApi.getStatementUrl(data.pdfId).pipe(
          mergeMap((pdfUrl: string) => {
            const actions = [];
            if (pdfUrl) {
              actions.push(new fromStatementHistoryPageActions.DownloadHistoricalStatementSuccess({ downloadUrl: pdfUrl }));

              const notification = {
                NotificationId: '',
                Level: NotificationLevel.Success,
                From: NotificationSource.TotalRewardsStatementHistory,
                Payload: {
                  Title: 'File Ready',
                  Message: `Download: ${data.statement.StatementName}`,
                  ExportedViewLink: pdfUrl,
                  FileType: NotificationPayloadFileType.Pdf
                },
                EnableHtml: true,
                Type: NotificationType.Event
              };

              actions.push(new fromAppNotificationsActions.AddNotification(notification));
            } else {
              actions.push(new fromStatementHistoryPageActions.DownloadHistoricalStatementError());
            }
            actions.push(new fromStatementHistoryPageActions.UpdatePdfIdToExport({ pdfId: null }));
            return actions;
          }),
          catchError(error => of(new fromStatementHistoryPageActions.DownloadHistoricalStatementError()))
        ))
    );

  @Effect()
  downloadHistoricalStatementError$: Observable<Action> =
    this.actions$.pipe(
      ofType(fromStatementHistoryPageActions.DOWNLOAD_HISTORICAL_STATEMENT_ERROR),
      map(() =>
        new fromAppNotificationsActions.AddNotification({
          NotificationId: '',
          Level: NotificationLevel.Error,
          From: NotificationSource.TotalRewardsStatementHistory,
          Payload: {
            Title: 'Error',
            Message: 'There was an error processing this request. Please try again later.'
          },
          EnableHtml: true,
          Type: NotificationType.Event
        })
      )
    );

  constructor(
    private actions$: Actions,
    private totalRewardsApi: TotalRewardsApiService,
    private totalRewardsStatementHistoryApi: TotalRewardsStatementHistoryApiService,
    private totalRewardsDeliveryApi: TotalRewardsEDeliveryApiService,
    private store: Store<fromTotalRewardsReducer.State>
  ) {}
}
