import {Injectable} from '@angular/core';

import {Actions, Effect, ofType} from '@ngrx/effects';
import {Action, select, Store} from '@ngrx/store';
import {Observable, of} from 'rxjs';
import {catchError, map, switchMap, withLatestFrom} from 'rxjs/operators';

import * as fromRootState from 'libs/state/state';
import { IntegrationApiService } from 'libs/data/payfactors-api/integration';
import { CompanyFilePackagesResponse, CompositeDataLoadViewResponse, PagedResponse } from 'libs/models/';

import * as fromLoaderDashboardPageActions from '../actions/loader-dashboard-page.actions';
import {LoaderDashboardModelMappers} from '../helpers';
import * as fromLoaderDashboardReducer from '../reducers';

@Injectable()
export class LoaderDashboardPageEffects {
  @Effect()
  init$: Observable<Action> = this.actions$
    .pipe(
      ofType<fromLoaderDashboardPageActions.Init>(fromLoaderDashboardPageActions.INIT),
      switchMap((obj) => {
        return [new fromLoaderDashboardPageActions.GetAllGridData(obj.payload)];
      })
    );

  @Effect()
  getAllGridData$: Observable<Action> = this.actions$.pipe(
    ofType<fromLoaderDashboardPageActions.GetAllGridData>(fromLoaderDashboardPageActions.GET_ALL_GRID_DATA),
    switchMap(obj => {
      return [
        new fromLoaderDashboardPageActions.GetCompositeLoadGridData(obj.payload),
        new fromLoaderDashboardPageActions.GetFilePackageGridData(obj.payload)
      ];
    })
  );

  @Effect()
  getCompositeLoadGridData$: Observable<Action> = this.actions$.pipe(
    ofType<fromLoaderDashboardPageActions.GetCompositeLoadGridData>(fromLoaderDashboardPageActions.GET_COMPOSITE_LOAD_GRID_DATA),
    withLatestFrom(
      this.store.pipe(select(fromRootState.getUserContext)),
      (action, userContext) => {
        return { action, userContext };
      }),
    switchMap(obj => {
      const searchPayload = LoaderDashboardModelMappers.mapGridSearchPayloadToSearchCriteria(obj.action.payload);
      return this.integrationApiService.SearchCompositeDataLoads(obj.userContext, searchPayload,
        obj.action.payload.Company_ID).pipe(
          map((r: PagedResponse<CompositeDataLoadViewResponse>) => {
            return new fromLoaderDashboardPageActions.GetCompositeLoadGridDataSuccess(r.results);
          }),
          catchError(e => of(new fromLoaderDashboardPageActions.GetCompositeLoadGridDataError()))
        );
    })
  );

  @Effect()
  getFilePackagesGridData$: Observable<Action> = this.actions$.pipe(
    ofType<fromLoaderDashboardPageActions.GetFilePackageGridData>(fromLoaderDashboardPageActions.GET_FILE_PACKAGE_GRID_DATA),
    withLatestFrom(
      this.store.pipe(select(fromRootState.getUserContext)),
      (action, userContext) => {
        return { action, userContext };
      }),
    switchMap(obj => {
      return this.integrationApiService.SearchCompanyFilePackages(obj.userContext, obj.action.payload.Company_ID).pipe(
        map((r: CompanyFilePackagesResponse[]) => {
          return new fromLoaderDashboardPageActions.GetFilePackageGridDataSuccess(r);
        }),
        catchError(e => of(new fromLoaderDashboardPageActions.GetFilePackageGridDataError()))
      );
    })
  );

  @Effect()
  toggleShowHideTestCompanies$: Observable<Action> = this.actions$
    .pipe(
      ofType<fromLoaderDashboardPageActions.ToggleShowHideTestCompanies>(fromLoaderDashboardPageActions.TOGGLE_SHOW_HIDE_TEST_COMPANIES),
      withLatestFrom(
        this.dashStore.pipe(select(fromLoaderDashboardReducer.getGridSearchPayload)),
        (action, searchPayload) => {
          return {action, searchPayload};
        }),
      switchMap((obj) => {
        return [new fromLoaderDashboardPageActions.GetAllGridData(obj.searchPayload)];
      })
    );

  @Effect()
  updateGridSearchPayload$: Observable<Action> = this.actions$
    .pipe(
      ofType<fromLoaderDashboardPageActions.UpdateGridSearchPayload>(fromLoaderDashboardPageActions.UPDATE_GRID_SEARCH_PAYLOAD),
      withLatestFrom(
        this.dashStore.pipe(select(fromLoaderDashboardReducer.getGridSearchPayload)),
        (action, searchPayload) => {
          return {action, searchPayload};
        }),
      switchMap((obj) => {
        return [new fromLoaderDashboardPageActions.GetAllGridData(obj.searchPayload)];
      })
    );

  @Effect()
  redropExportedSourceFile$: Observable<Action> = this.actions$
    .pipe(
      ofType<fromLoaderDashboardPageActions.RedropExportedSourceFile>(fromLoaderDashboardPageActions.REDROP_EXPORTED_SOURCE_FILE),
      withLatestFrom(
        this.store.pipe(select(fromRootState.getUserContext)),
        (action, userContext) => {
          return { action, userContext };
        }),
      switchMap(obj => {
        return this.integrationApiService.RedropExportedSourceFile(obj.action.payload, obj.userContext).pipe(
          map(() => new fromLoaderDashboardPageActions.RedropExportedSourceFileSuccess()),
          catchError((e) => of(new fromLoaderDashboardPageActions.RedropExportedSourceFileError()))
        );
      })
    );

  @Effect()
  redropExportedSourceFileSuccess$: Observable<Action> = this.actions$
    .pipe(
      ofType<fromLoaderDashboardPageActions.RedropExportedSourceFileSuccess>(fromLoaderDashboardPageActions.REDROP_EXPORTED_SOURCE_FILE_SUCCESS),
      switchMap(() => {
        return [new fromLoaderDashboardPageActions.DismissRedropConfirmationModal()];
      })
    );

  constructor(
    private actions$: Actions,
    private integrationApiService: IntegrationApiService,
    private store: Store<fromRootState.State>,
    private dashStore: Store<fromLoaderDashboardReducer.State>
  ) {}
}
