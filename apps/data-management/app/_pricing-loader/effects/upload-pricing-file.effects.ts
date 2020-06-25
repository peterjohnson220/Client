import { Injectable } from '@angular/core';

import { Effect, Actions, ofType } from '@ngrx/effects';
import { switchMap, map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

import { PricingLoaderApiService } from 'libs/data/payfactors-api/data-loads';

import * as fromUploadPricingFileActions from '../actions/upload-pricing-file.actions';

@Injectable()
export class UploadPricingFileEffects {

  @Effect()
  getWorksheetNames$ = this.actions$
    .pipe(
      ofType(fromUploadPricingFileActions.GET_WORKSHEET_NAMES),
      switchMap((action: fromUploadPricingFileActions.GetWorksheetNames) => {
        return this.pricingLoaderApiService.getWorksheetNames(action.payload)
          .pipe(
            map((response) => new fromUploadPricingFileActions.GetWorksheetNamesSuccess({ worksheetNames: response })),
            catchError(() => of(new fromUploadPricingFileActions.GetWorksheetNamesError()))
          );
      })
    );

  constructor(
    private actions$: Actions,
    private pricingLoaderApiService: PricingLoaderApiService
  ) {}
}
