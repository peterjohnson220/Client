import { Injectable } from '@angular/core';

import { of } from 'rxjs';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { switchMap, catchError, map, debounceTime } from 'rxjs/operators';

import { DataViewApiService } from 'libs/data/payfactors-api';
import { PfConstants } from 'libs/models/common';

import * as fromConfigurationActions from '../actions/configuration.actions';
import { PayfactorsApiModelMapper } from '../helpers';

@Injectable()
export class DataViewConfigurationEffects {

  @Effect()
  getFilterOptions$ = this.action$
  .pipe(
    ofType(fromConfigurationActions.GET_FILTER_OPTIONS),
    debounceTime(PfConstants.DEBOUNCE_DELAY),
    switchMap((action: fromConfigurationActions.GetFilterOptions) => {
      const request = PayfactorsApiModelMapper.buildDataViewFilterOptionsRequest(action.payload);
      return this.dataViewApiService.getFilterOptions(request)
        .pipe(
          map((response) => new fromConfigurationActions.GetFilterOptionsSuccess({
            index: action.payload.FilterIndex,
            options: response
          })),
          catchError(() => of(new fromConfigurationActions.GetFilterOptionsError()))
        );
    })
  );

  constructor(
    private action$: Actions,
    private dataViewApiService: DataViewApiService
  ) {}
}
