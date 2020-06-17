import { Injectable } from '@angular/core';

import { Store } from '@ngrx/store';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { switchMap, map, catchError, withLatestFrom } from 'rxjs/operators';
import { of } from 'rxjs';
import { cloneDeep } from 'lodash';

import { PricingLoaderApiService, DataLoadEmailRecipientsApiService } from 'libs/data/payfactors-api';
import { EmailRecipientModel } from 'libs/models';

import * as fromPricingLoaderMainReducer from '../reducers';
import * as fromPricingLoaderActions from '../actions/pricing-loader.actions';
import { PricingLoaderSettingsHelper } from '../helpers';

@Injectable()
export class PricingLoaderEffects {

  @Effect()
  saveConfig$ = this.actions$
    .pipe(
      ofType(fromPricingLoaderActions.SAVE_CONFIG),
      withLatestFrom(
        this.store.select(fromPricingLoaderMainReducer.getConfigGroup),
        this.store.select(fromPricingLoaderMainReducer.getDefaultSettings),
        this.store.select(fromPricingLoaderMainReducer.getFileUploadSettings),
        (action, configGroup, defaultSettings, fileUploadSetting) =>
          ({ action, configGroup, defaultSettings, fileUploadSetting})
      ),
      switchMap((data) => {
        const request = PricingLoaderSettingsHelper.buildSaveConfigRequest(data.configGroup, data.fileUploadSetting, data.defaultSettings);
        return this.pricingLoaderApiService.savePricingLoaderConfig(request)
          .pipe(
            map((response) => new fromPricingLoaderActions.SaveConfigSuccess({ loaderConfigurationGroupId: response })),
            catchError(() => of(new fromPricingLoaderActions.ProcessingError({ message: 'Error saving loader settings.'})))
          );
      })
    );

  @Effect()
  saveEmailRecipient$ = this.actions$
    .pipe(
      ofType(fromPricingLoaderActions.SAVE_CONFIG_SUCCESS),
      withLatestFrom(
        this.store.select(fromPricingLoaderMainReducer.getEmailRecipient),
        (action: fromPricingLoaderActions.SaveConfigSuccess, emailRecipient) => ({ action, emailRecipient })
      ),
      switchMap((data) => {
        const emailRecipientClone: EmailRecipientModel = cloneDeep(data.emailRecipient);
        emailRecipientClone.LoaderConfigurationGroupId = data.action.payload.loaderConfigurationGroupId;
        return this.dataLoadEmailRecipientsApiService.insertRecipient(emailRecipientClone)
          .pipe(
            map((response) => new fromPricingLoaderActions.ProcessingSuccess()),
            catchError(() => of(new fromPricingLoaderActions.ProcessingError({ message: 'Error adding email recipient.'})))
          );
      })
    );

  constructor(
    private actions$: Actions,
    private dataLoadEmailRecipientsApiService: DataLoadEmailRecipientsApiService,
    private pricingLoaderApiService: PricingLoaderApiService,
    private store: Store<fromPricingLoaderMainReducer.State>
  ) {}
}
