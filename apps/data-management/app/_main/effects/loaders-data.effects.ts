import {Injectable} from '@angular/core';

import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, select, Store } from '@ngrx/store';
import isEmpty from 'lodash/isEmpty';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';

import { CompositeDataLoadTypes } from 'libs/constants';
import { IntegrationApiService } from 'libs/data/payfactors-api/integration';
import { CompositeDataLoadSearchCriteria, CompositeDataLoadViewResponse, PagedResponse } from 'libs/models/';
import * as fromRootState from 'libs/state/state';

import * as fromLoadersDataActions from '../actions/loaders-data.actions';

@Injectable()
export class LoadersDataEffects {
  @Effect()
  getLatestOrgDataLoad$: Observable<Action> = this.actions$.pipe(
    ofType<fromLoadersDataActions.GetLatestOrgDataLoad>(fromLoadersDataActions.GET_LATEST_ORG_DATA_LOAD),
    withLatestFrom(
      this.store.pipe(select(fromRootState.getUserContext)),
      (action, userContext) => userContext
    ),
    switchMap(userContext => {
      const searchPayload: CompositeDataLoadSearchCriteria = {
        ExcludeTestCompanies: false,
        LoaderType: CompositeDataLoadTypes.OrgData,
        Page: 0,
        PageSize: 1,
      };
      return this.integrationApiService.SearchCompositeDataLoads(
        userContext,
        searchPayload,
        userContext.CompanyId
      ).pipe(
        map((r: PagedResponse<CompositeDataLoadViewResponse>) => {
          const result = isEmpty(r.results) ? null : r.results[0];
          return new fromLoadersDataActions.GetLatestOrgDataLoadSuccess(result);
        }),
        catchError(e => of(new fromLoadersDataActions.GetLatestOrgDataLoadError()))
      );
    })
  );

  @Effect()
  downloadIVRF$: Observable<Action> = this.actions$.pipe(
    ofType<fromLoadersDataActions.DownloadIVRF>(fromLoadersDataActions.DOWNLOAD_IVRF),
    withLatestFrom(
      this.store.pipe(select(fromRootState.getUserContext)),
      (action, userContext) => ({ action, userContext })
    ),
    switchMap(({ action, userContext }) => this.integrationApiService.compositeSummaryDownload(action.payload, userContext))
  );

  constructor(
    private actions$: Actions,
    private integrationApiService: IntegrationApiService,
    private store: Store<fromRootState.State>,
  ) {}
}
