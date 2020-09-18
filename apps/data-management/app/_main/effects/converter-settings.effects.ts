import {Injectable} from '@angular/core';

import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, select, Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, withLatestFrom, switchMap, mergeMap } from 'rxjs/operators';


import { ConverterSettingsHrisApiService } from 'libs/data/payfactors-api';
import { ConverterSettings } from 'libs/models/hris-api';
import * as fromRootState from 'libs/state/state';

import * as fromConverterSettingsActions from '../actions/converter-settings.actions';
import * as fromReducers from '../reducers';


@Injectable()
export class ConverterSettingsEffects {
  @Effect()
  getConverterSettings$: Observable<Action> = this.actions$.pipe(
      ofType<fromConverterSettingsActions.GetConverterSettings>(fromConverterSettingsActions.GET_CONVERTER_SETTINGS),
      withLatestFrom(
        this.store.pipe(select(fromRootState.getUserContext)),
        this.store.pipe(select(fromReducers.getHrisConnectionSummary)),
        (action, userContext, connectionSummary) => {
          return {
            action,
            userContext,
            connectionSummary
        };
      }),
      switchMap(obj => {
        return this.converterSettingsApiService.get(obj.userContext, obj.connectionSummary.connectionID)
          .pipe(
            mergeMap((response: ConverterSettings[]) => {
              return [
                new fromConverterSettingsActions.GetConverterSettingsSuccess(response)
              ];
            }),
            catchError((error) => of(new fromConverterSettingsActions.GetConverterSettingsError())
          ));
      })
    );

  @Effect()
  saveConverterSettings$: Observable<Action> = this.actions$.pipe(
    ofType<fromConverterSettingsActions.SaveConverterSettings>(fromConverterSettingsActions.SAVE_CONVERTER_SETTINGS),
    withLatestFrom(
      this.store.pipe(select(fromRootState.getUserContext)),
      this.store.pipe(select(fromReducers.getHrisConnectionSummary)),
      this.store.pipe(select(fromReducers.getConverterSettings)),
      (action, userContext, connectionSummary, converterSettings) => {
        return {
          action,
          userContext,
          connectionSummary,
          converterSettings
      };
    }),
    switchMap(obj => {
      return this.converterSettingsApiService.saveSettings(obj.userContext, obj.connectionSummary.connectionID, obj.converterSettings)
        .pipe(
          mergeMap((response: any) => {
            return [new fromConverterSettingsActions.SaveConverterSettingsSuccess()];
          }),
          catchError((error) => of(new fromConverterSettingsActions.SaveConverterSettingsError())
        ));
    })
  );

  constructor(
    private actions$: Actions,
    private store: Store<fromReducers.State>,
    private converterSettingsApiService: ConverterSettingsHrisApiService
  ) {}
}
