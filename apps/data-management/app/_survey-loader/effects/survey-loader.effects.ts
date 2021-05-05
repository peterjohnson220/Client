import { Injectable } from '@angular/core';

import { Store } from '@ngrx/store';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { switchMap, map, catchError, withLatestFrom } from 'rxjs/operators';
import { of } from 'rxjs';
import cloneDeep from 'lodash/cloneDeep';

import { SurveyLoaderApiService, DataLoadEmailRecipientsApiService } from 'libs/data/payfactors-api';
import { EmailRecipientModel } from 'libs/models';
import { DataImportApiService } from 'libs/data/payfactors-api/integration/data-import';
import { ExcelFileUploadRequest } from 'libs/features/loaders/org-data-loader/models';

import * as fromSurveyLoaderMainReducer from '../reducers';
import * as fromSurveyLoaderActions from '../actions/survey-loader.actions';
import { SurveyLoaderSettingsHelper } from '../helpers';

@Injectable()
export class SurveyLoaderEffects {

  @Effect()
  saveConfig$ = this.actions$
    .pipe(
      ofType(fromSurveyLoaderActions.SAVE_CONFIG),
      withLatestFrom(
        this.store.select(fromSurveyLoaderMainReducer.getConfigGroup),
        this.store.select(fromSurveyLoaderMainReducer.getFileUploadSettings),
        (action, configGroup, fileUploadSetting) =>
          ({ action, configGroup, fileUploadSetting})
      ),
      switchMap((data) => {
        const request = SurveyLoaderSettingsHelper.buildSaveConfigRequest(data.configGroup, data.fileUploadSetting);
        return this.surveyLoaderApiService.saveSurveyLoaderConfig(request)
          .pipe(
            map((response) => new fromSurveyLoaderActions.SaveConfigSuccess({ loaderConfigurationGroupId: response })),
            catchError(() => of(new fromSurveyLoaderActions.ProcessingError({ message: 'Error saving loader settings.'})))
          );
      })
    );

  @Effect()
  saveEmailRecipient$ = this.actions$
    .pipe(
      ofType(fromSurveyLoaderActions.ADD_EMAIL_RECIPIENT),
      withLatestFrom(
        this.store.select(fromSurveyLoaderMainReducer.getConfigGroup),
        this.store.select(fromSurveyLoaderMainReducer.getEmailRecipient),
        (action: fromSurveyLoaderActions.AddEmailRecipient, configGroup, emailRecipient) =>
          ({ action, configGroup, emailRecipient })
      ),
      switchMap((data) => {
        const emailRecipientClone: EmailRecipientModel = cloneDeep(data.emailRecipient);
        emailRecipientClone.LoaderConfigurationGroupId = data.configGroup.LoaderConfigurationGroupId;
        return this.dataLoadEmailRecipientsApiService.insertRecipient(emailRecipientClone)
          .pipe(
            map((response) => new fromSurveyLoaderActions.AddEmailRecipientSuccess()),
            catchError(() => of(new fromSurveyLoaderActions.AddEmailRecipientError()))
          );
      })
    );

  @Effect()
  uploadExcelFile$ = this.actions$
    .pipe(
      ofType(fromSurveyLoaderActions.UPLOAD_FILE),
      withLatestFrom(
        this.store.select(fromSurveyLoaderMainReducer.getConfigGroup),
        (action: fromSurveyLoaderActions.UploadFile, configGroup) =>
          ({ action, configGroup })
      ),
      switchMap((data) => {
        const request: ExcelFileUploadRequest = {
          CompanyId: data.action.payload.companyId,
          UserContext: data.action.payload.userContext,
          FormData: {
            loaderConfigurationGroupId: data.configGroup.LoaderConfigurationGroupId,
            file: data.action.payload.file
          }
        };
        return this.dataImportApiService.sendExcelFile(request)
          .pipe(
            map((response) => new fromSurveyLoaderActions.ProcessingSuccess()),
            catchError(() => of(new fromSurveyLoaderActions.ProcessingError({ message: 'Error uploading file.'})))
          );
      })
    );

  constructor(
    private actions$: Actions,
    private dataLoadEmailRecipientsApiService: DataLoadEmailRecipientsApiService,
    private surveyLoaderApiService: SurveyLoaderApiService,
    private dataImportApiService: DataImportApiService,
    private store: Store<fromSurveyLoaderMainReducer.State>
  ) {}
}
