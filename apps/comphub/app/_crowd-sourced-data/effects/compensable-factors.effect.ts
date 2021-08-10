import { Injectable } from '@angular/core';

import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

import { ComphubCrowdSourcedApiService } from 'libs/data/payfactors-api/comphub';

import * as fromComphubCrowdSourcedDataReducer from '../reducers';
import * as fromCompensableFactorsActions from '../actions/compensable-factors.actions';
import * as fromComphubPageActions from '../../_shared/actions/comphub-page.actions';


@Injectable()
export class CompensableFactorsEffect {

  @Effect()
  getCompensableFactors = this.actions$
    .pipe(
      ofType(fromCompensableFactorsActions.GET_ALL_COMPENSABLE_FACTORS),
      switchMap((action: fromCompensableFactorsActions.GetAllCompensableFactors) => {
          return this.comphubCSDApiService.getCompensableFactors({
            JobTitle: action.payload.jobTitle,
            Country: action.payload.country,
            PaymarketId: action.payload.paymarketId
          })
            .pipe(
              map(response => {
                return new fromCompensableFactorsActions.GetAllCompensableFactorsSuccess(response);
              }),
              catchError((err) => of(new fromCompensableFactorsActions.GetAllCompensableFactorsError()))
            );
        }
      ));

  @Effect()
  getEducationTypes = this.actions$
    .pipe(
      ofType(fromCompensableFactorsActions.GET_EDUCATION_TYPES),
      switchMap(() => {
        return this.comphubCSDApiService.getCrowdSourcedEducationTypes()
          .pipe(
            map((response) => new fromCompensableFactorsActions.GetEducationTypesSuccess(response)),
            catchError((error) => of(
              new fromCompensableFactorsActions.GetEducationTypesError(),
              new fromComphubPageActions.HandleApiError(error))
            )
          );
      })
    );

  constructor(
    private actions$: Actions,
    private store: Store<fromComphubCrowdSourcedDataReducer.State>,
    private comphubCSDApiService: ComphubCrowdSourcedApiService,
  ) {}
}
