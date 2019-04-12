import { Injectable } from '@angular/core';
import { Action, select, Store } from '@ngrx/store';

import { Effect, Actions, ofType } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { catchError, map, switchMap, mergeMap, withLatestFrom, debounceTime } from 'rxjs/operators';
import { iif, of } from 'rxjs';
import { GridDataResult } from '@progress/kendo-angular-grid';

import { CompanyJobApiService } from 'libs/data/payfactors-api/company/company-job-api.service';
import { ExchangeCompanyApiService } from 'libs/data/payfactors-api/peer/exchange-company-api.service';
import { GenericMenuItem } from 'libs/models/common';

import * as fromPeerJobsActions from '../actions/exchange-jobs.actions';
import * as fromPeerJobsReducer from '../reducers';
import { IGridState } from 'libs/core/reducers/grid.reducer';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable()
export class ExchangeJobsEffects {
  @Effect()
  load$: Observable<Action> = this.actions$.pipe(
    ofType(fromPeerJobsActions.LOAD),
    mergeMap(() => [
      new fromPeerJobsActions.LoadExchangeJobs(),
      new fromPeerJobsActions.LoadJobFamilyFilter(),
      new fromPeerJobsActions.LoadExchangeFilter()
    ])
  );

  @Effect()
  getExchangeJobs$: Observable<Action> = this.actions$.pipe(
    ofType(fromPeerJobsActions.LOAD_EXCHANGE_JOBS),
    // debounce for when multiple filters are changed at once, eg a reset click in an empty grid
    debounceTime(600),
    // grab list state
    withLatestFrom(
      this.store.pipe(
        select(fromPeerJobsReducer.getExchangeJobsGrid)),
        (action, gridState: IGridState) => gridState
    ),
    // grab the search term
    withLatestFrom(
      this.store.pipe(
        select(fromPeerJobsReducer.getExchangeJobsSearchTerm)),
        (gridState: IGridState, searchTerm) => ({ gridState, searchTerm })
    ),
    // grab the selected job families
    withLatestFrom(
      this.store.pipe(
        select(fromPeerJobsReducer.getExchangeJobFamilyFilterSelectedOptionNames)),
        (combined, selectedJobFamilyNames: string[]) => ({ ...combined, selectedJobFamilyNames })
    ),
    // grab the selected exchanges
    withLatestFrom(
      this.store.pipe(
        select(fromPeerJobsReducer.getExchangeJobExchangeFilterSelectedOptionIds)),
        (combined, selectedExchangeIds: number[]) => ({ ...combined, selectedExchangeIds })
    ),
    // make the call to the api service, then fire a success/failure action
    switchMap(combined =>
      this.exchangeCompanyApiService.getExchangeJobs(
        combined.gridState.grid, combined.searchTerm, combined.selectedJobFamilyNames, combined.selectedExchangeIds
      ).pipe(
          map((gridDataResult: GridDataResult) => new fromPeerJobsActions.LoadExchangeJobsSuccess(gridDataResult)),
          catchError((error: HttpErrorResponse ) => {
            if (error.status === 400) {
              return of(new fromPeerJobsActions.LoadExchangeJobsBadRequest(error.error.Message));
            } else {
              return of(new fromPeerJobsActions.LoadExchangeJobsError(error.error.Message));
            }
          })
        )
      )
  );

  @Effect()
  getJobFamilies$: Observable<Action> = this.actions$.pipe(
    ofType(fromPeerJobsActions.LOAD_JOB_FAMILY_FILTER),
    switchMap(() =>
      this.exchangeCompanyApiService.getJobFamilies().pipe(
        map((jobFamilies: GenericMenuItem[]) => new fromPeerJobsActions.LoadJobFamilyFilterSuccess(jobFamilies)),
        catchError(() => of(new fromPeerJobsActions.LoadJobFamilyFilterError()))
      )
    )
  );

  @Effect()
  getExchanges$: Observable<Action> = this.actions$.pipe(
    ofType(fromPeerJobsActions.LOAD_EXCHANGE_FILTER),
    switchMap(() =>
      this.exchangeCompanyApiService.getExchanges().pipe(
        map((exchanges) => exchanges.map(e => ({ Id: e.ExchangeId, DisplayName: e.ExchangeName } as GenericMenuItem))),
        map((genericMenuItems) => new fromPeerJobsActions.LoadExchangeFilterSuccess(genericMenuItems)),
        catchError(() => of(new fromPeerJobsActions.LoadExchangeFilterError()))
      )
    )
  );

  @Effect()
  getPreviousAssociations$: Observable<Action> = this.actions$.pipe(
    ofType(fromPeerJobsActions.LOAD_PREVIOUS_ASSOCIATIONS),
    map((action: any) => action.payload.CompanyJobMappings.map(c => c.CompanyJobId)),
    switchMap((companyJobIds: number[]) =>
      // if we don't have previous associations just return an empty array, otherwise get the job info from the server
      iif(
        () => !companyJobIds.length,
        of(new fromPeerJobsActions.LoadPreviousAssociationsSuccess([])),
        this.companyJobApiService.getCompanyJobs(companyJobIds).pipe(
          map((companyJobs: any) => new fromPeerJobsActions.LoadPreviousAssociationsSuccess(companyJobs)),
          catchError(() => of(new fromPeerJobsActions.LoadPreviousAssociationsError()))
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private companyJobApiService: CompanyJobApiService,
    private exchangeCompanyApiService: ExchangeCompanyApiService,
    private store: Store<fromPeerJobsReducer.State>,
  ) {}
}
