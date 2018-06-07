import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Effect, Actions } from '@ngrx/effects';

import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

import * as fromMarketingImageActions from '../actions/marketing-image.actions';
import { MarketingImageService } from 'libs/data/payfactors-api/marketing-image/marketing-image-service.service';

@Injectable()
export class MarketingImageEffects {

@Effect()
uploadMarketingImage$: Observable<Action> = this.actions$
  .ofType(fromMarketingImageActions.SAVING_MARKETING_IMAGE)
  .switchMap((action: fromMarketingImageActions.SavingFile) =>
      this.marketingImageApiService.postFile(action.payload)
        .map((result: any) => {
          console.log(result);
          return new fromMarketingImageActions.SavingFileSuccess();
        })
        .catch((error: any) => {
          console.log(error);
          return of(new fromMarketingImageActions.SavingFileError(error));
        })
  );

  constructor(
    private actions$: Actions,
    private marketingImageApiService: MarketingImageService
  ) {}

}
