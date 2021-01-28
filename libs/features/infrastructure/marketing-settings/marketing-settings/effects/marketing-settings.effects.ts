import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Effect, Actions, ofType } from '@ngrx/effects';

import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import * as marketingSettingsActions from 'libs/features/infrastructure/marketing-settings/marketing-settings/actions/marketing-settings.actions';
import { MarketingApiService } from 'libs/data/payfactors-api/marketing/marketing-api.service';
import { MarketingImageDto } from 'libs/models/marketing/marketing-image-dto.model';

@Injectable()
export class MarketingSettingsEffects {

  @Effect()
  getMarketingImage$: Observable<Action> = this.actions$
    .pipe(
      ofType(marketingSettingsActions.GET_MARKETING_IMAGE),
      switchMap(() =>
        this.marketingApiService.getMarketingImage().pipe(
          map((marketingImage: MarketingImageDto) => new marketingSettingsActions.GetMarketingImageSuccess(marketingImage)),
          catchError(error => {
            return of (new marketingSettingsActions.GetMarketingImageError(error));
          })
        )
      )
    );

    @Effect()
    updateMarketingSettings$: Observable<Action> = this.actions$
      .pipe(
        ofType(marketingSettingsActions.UPDATING_MARKETING_SETTINGS),
        switchMap((action: marketingSettingsActions.UpdatingMarketingSettings) =>
          this.marketingApiService.updateMarketingSettings(action.payload).pipe(
            map(() => new marketingSettingsActions.UpdatingMarketingSettingsSuccess()),
            catchError(error => {
              return of (new marketingSettingsActions.UpdatingMarketingSettingsError(error));
            })
          )
        )
      );


  @Effect()
  getMarketingVideoUrl$: Observable<Action> = this.actions$
    .pipe(
      ofType(marketingSettingsActions.GET_MARKETING_VIDEO_URL),
      switchMap(() =>
        this.marketingApiService.getMarketingVideoUrl().pipe(
          map((videoUrl: string) => new marketingSettingsActions.GetMarketingVideoUrlSuccess(videoUrl)),
          catchError(error => {
            return of (new marketingSettingsActions.GetMarketingVideoUrlError(error));
          })
        )
      )
    );

  constructor(
    private actions$: Actions,
    private marketingApiService: MarketingApiService) {
  }
}
