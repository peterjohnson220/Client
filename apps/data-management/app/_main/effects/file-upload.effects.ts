import { Injectable } from '@angular/core';

import {act, Actions, Effect, ofType} from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { LoaderFieldMappingsApiService } from 'libs/data/payfactors-api/data-loads';
import * as fromFileUploadActions from '../actions/file-upload.actions';

@Injectable()
export class FileUploadEffects {
  @Effect()
  getFileUploadColumnNames$: Observable<Action> = this.actions$.pipe(
    ofType(fromFileUploadActions.GET_COLUMN_NAMES),
    switchMap((action: fromFileUploadActions.GetColumnNames) =>
      this.loaderFieldMappingsApiService.getFileUploadColumnNames(action.payload.columnNamesFile).pipe(
        map((columnNames: string[]) => {
          return new fromFileUploadActions.GetColumnNamesSuccess({columnNames: columnNames, columnNamesFile:  action.payload.columnNamesFile, entity: action.payload.entity});
        }),
        catchError(error => of(new fromFileUploadActions.GetColumnNamesError()))
      )
    )
  );

  constructor(
    private actions$: Actions,
    private loaderFieldMappingsApiService: LoaderFieldMappingsApiService
  ) { }
}



