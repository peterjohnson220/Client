import { Injectable } from '@angular/core';

import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import { CurrencyApiService } from 'libs/data/payfactors-api/currency';
import { CompositeFieldApiService } from 'libs/data/payfactors-api/composite-field';
import { StructuresApiService } from 'libs/data/payfactors-api/structures';

import * as fromModelingSettingsPageActions from '../actions/modeling-settings-page.actions';

@Injectable()
export class ModelingSettingsPageEffects {
  @Effect()
  getModelingSettingsOptions$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromModelingSettingsPageActions.GET_MODELING_SETTINGS_OPTIONS),
      switchMap(() =>
        [
          new fromModelingSettingsPageActions.GetCurrencies(),
          new fromModelingSettingsPageActions.GetStandardPayElements(),
          new fromModelingSettingsPageActions.GetPercentiles(),
        ]
      )
    );

  @Effect()
  getCurrencies$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromModelingSettingsPageActions.GET_CURRENCIES),
      switchMap(() =>
        this.currencyApiService.getCurrencies()
          .pipe(
            map((response) => new fromModelingSettingsPageActions.GetCurrenciesSuccess(response))
          )
      ),
      catchError(error => of(new fromModelingSettingsPageActions.GetCurrenciesError()))
    );

  @Effect()
  getStandardPayElements$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromModelingSettingsPageActions.GET_STANDARD_PAY_ELEMENTS),
      switchMap(() =>
        this.compositeFieldsApiService.GetCompositeFieldFieldNames()
          .pipe(
            map((response) => new fromModelingSettingsPageActions.GetStandardPayElementsSuccess(response))
          )
      ),
      catchError(error => of(new fromModelingSettingsPageActions.GetStandardPayElementsError()))
    );

  @Effect()
  getPercentiles$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromModelingSettingsPageActions.GET_PERCENTILES),
      switchMap(() =>
        this.compositeFieldsApiService.GetCompositeFieldDisplayNames()
          .pipe(
            map((response) => new fromModelingSettingsPageActions.GetPercentilesSuccess(response))
          )
      ),
      catchError(error => of(new fromModelingSettingsPageActions.GetPercentilesError()))
    );

  @Effect()
  createModel$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromModelingSettingsPageActions.CREATE_MODEL),
      switchMap(() =>
        this.structuresApiService.createModel()
          .pipe(
            map((response) => new fromModelingSettingsPageActions.CreateModelSuccess(response))
          )
      ),
      catchError(error => of(new fromModelingSettingsPageActions.CreateModelError()))
    );

  constructor(
    private actions$: Actions,
    private currencyApiService: CurrencyApiService,
    private structuresApiService: StructuresApiService,
    private compositeFieldsApiService: CompositeFieldApiService
  ) {
  }
}
