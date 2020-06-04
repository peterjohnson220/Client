import { Injectable } from '@angular/core';

import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import { ECommerceApiService } from 'libs/data/payfactors-api/ecommerce';

import * as fromECommerceActions from '../actions/ecommerce.actions';

@Injectable()
export class ECommerceEffects {

  @Effect()
  getSettings$: Observable<Action> = this.actions$
    .pipe(
      ofType<fromECommerceActions.GetSettings>(fromECommerceActions.GET_SETTINGS),
      switchMap(() =>
        this.eCommerceApiService.getSettings()
          .pipe(
            map(settings => new fromECommerceActions.GetSettingsSuccess({ settings })),
            catchError(() => of(new fromECommerceActions.GetSettingsError()))
          )
      )
    );

  constructor(
    private actions$: Actions,
    private eCommerceApiService: ECommerceApiService
  ) {
  }
}
