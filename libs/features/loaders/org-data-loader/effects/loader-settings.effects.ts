import { Injectable } from '@angular/core';

import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/internal/operators';

import { LoaderSettingsApiService } from 'libs/data/payfactors-api/data-loads';
import { LoaderSetting } from 'libs/models/data-loads';

import * as fromLoaderSettingsActions from '../actions/loader-settings.actions';

@Injectable()
export class LoaderSettingsEffects {

  @Effect()
  loadingLoaderSettings$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromLoaderSettingsActions.LOADING_LOADER_SETTINGS),
      switchMap((action: fromLoaderSettingsActions.LoadingLoaderSettings) =>
        this.loaderSettingsApiService.getCompanyLoaderSettings(action.companyId, action.configGroupId).pipe(
          map((result: LoaderSetting[]) => {
            return new fromLoaderSettingsActions.LoadingLoaderSettingsSuccess(result);
          }),
          catchError(error => of(new fromLoaderSettingsActions.LoadingLoaderSettingsError()))
        ))
    );

  @Effect()
  savingLoaderSettings$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromLoaderSettingsActions.SAVING_LOADER_SETTINGS),
      switchMap((action: fromLoaderSettingsActions.SavingLoaderSettings) =>
        this.loaderSettingsApiService.saveOrUpdate(action.payload).pipe(
          map(() => {
            return new fromLoaderSettingsActions.SavingLoaderSettingsSuccess();
          }),
          catchError(error => of(new fromLoaderSettingsActions.SavingLoaderSettingsError()))
        ))
    );


  constructor(
    private actions$: Actions,
    private loaderSettingsApiService: LoaderSettingsApiService
  ) { }
}
