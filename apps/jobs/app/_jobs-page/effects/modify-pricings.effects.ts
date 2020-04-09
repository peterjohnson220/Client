import { Injectable } from '@angular/core';

import {switchMap, map} from 'rxjs/operators';

import {Actions, Effect, ofType} from '@ngrx/effects';
import {Action} from '@ngrx/store';

import {Observable} from 'rxjs';

import { JobsApiService } from 'libs/data/payfactors-api';

import * as fromModifyPricingsActions from '../actions';

@Injectable()
export class ModifyPricingsEffects {
  constructor(
    private action$: Actions,
    private jobsApiService: JobsApiService
  ) {}

  @Effect()
  modifyPricings$: Observable<Action> = this.action$.pipe(
    ofType(fromModifyPricingsActions.GET_PRICINGS_TO_MODIFY),
    switchMap((action: any) => {
      return this.jobsApiService.getPricingsToModify(action.payload).pipe(
        map(response => new fromModifyPricingsActions.GetPricingsToModifySuccess(response))
      );
    })
  );
}

