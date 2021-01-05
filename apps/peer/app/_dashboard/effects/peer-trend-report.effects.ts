import { Injectable } from '@angular/core';

import { Action } from '@ngrx/store';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import { TableauReportApiService } from 'libs/data/payfactors-api';
import { TableauReportResponse } from 'libs/models/payfactors-api/reports/response';
import { ReportsPayfactorsApiModelMapper } from 'libs/features/surveys/reports/helpers';

import * as fromPeerTrendReportActions from '../actions/peer-trend-report.actions';

@Injectable()
export class PeerTrendReportEffects {
  @Effect()
  loadPeerTrendReport$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromPeerTrendReportActions.LOAD_PEER_TREND_REPORT),
      switchMap(() =>
        this.tableauReportApiService.getPeerTrendsStandardReport().pipe(
          map((response: TableauReportResponse) => {
            return new fromPeerTrendReportActions.LoadPeerTrendReportSuccess(ReportsPayfactorsApiModelMapper.mapTableauReportResponseToWorkbook(response));
          }),
          catchError(() => of(new fromPeerTrendReportActions.LoadPeerTrendReportError()))
        )
      )
    );

  constructor(
    private actions$: Actions,
    private tableauReportApiService: TableauReportApiService
  ) {}
}


