import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Effect, Actions, ofType } from '@ngrx/effects';

import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import * as marketingImageActions from '../actions/marketing-image.actions';
import { MarketingApiService } from 'libs/data/payfactors-api/marketing/marketing-api.service';
import { MarketingImageDto } from 'libs/models/marketing/marketing-image-dto.model';

@Injectable()
export class MarketingImageEffects {
  @Effect()
  getMarketingImage$: Observable<Action> = this.actions$
    .pipe(
      ofType(marketingImageActions.GET_MARKETING_IMAGE),
      switchMap(() =>
        this.marketingApiService.getMarketingImage().pipe(
          map((marketingImage: MarketingImageDto) => new marketingImageActions.GetMarketingImageSuccess(marketingImage)),
          catchError(error => {
            return of (new marketingImageActions.GetMarketingImageError(error));
          })
        )
      )
    );

  constructor(
    private actions$: Actions,
    private marketingApiService: MarketingApiService) {
  }
}
