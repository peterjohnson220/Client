import { Injectable } from '@angular/core';

import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { of } from 'rxjs';

import { ComphubCrowdSourcedApiService } from 'libs/data/payfactors-api/comphub';

import * as fromComphubCrowdSourcedDataReducer from '../reducers';
import * as fromComphubSharedReducer from '../../_shared/reducers';
import * as fromExportDataActions from '../actions/export-data.actions';

@Injectable()
export class ExportDataEffect {

  @Effect()
  saveExportData = this.actions$
    .pipe(
      ofType(
        fromExportDataActions.SAVE_EXPORT_DATA
      ),
      withLatestFrom(
        this.store.select(fromComphubCrowdSourcedDataReducer.getExportDataAsyncObj),
        this.sharedStore.select(fromComphubSharedReducer.getSelectedJobData),
        this.sharedStore.select(fromComphubSharedReducer.getSelectedPaymarket),
        (action: fromExportDataActions.SaveExportData, exportDataAsyncObj, selectedJob, selectedPaymarket) =>
          ({action, exportDataAsyncObj, selectedJob, selectedPaymarket})
      ),
      switchMap((data) => {
          return this.comphubCSDApiService.saveExportData({
            JsonRequest: data.exportDataAsyncObj.obj.JsonRequest,
            JsonResponse: data.exportDataAsyncObj.obj.JsonResponse,
            PayscaleJobTitle: data.selectedJob.JobTitle,
            CompanyPayMarketId: data?.selectedPaymarket.CompanyPayMarketId
          }).pipe(
            map((response) => {
              return new fromExportDataActions.SaveExportDataSuccess();
            }),
            catchError(() => of(new fromExportDataActions.SaveExportDataError()))
          );
        }
      ));

  constructor(
    private actions$: Actions,
    private store: Store<fromComphubCrowdSourcedDataReducer.State>,
    private sharedStore: Store<fromComphubSharedReducer.State>,
    private comphubCSDApiService: ComphubCrowdSourcedApiService,
  ) {}
}
