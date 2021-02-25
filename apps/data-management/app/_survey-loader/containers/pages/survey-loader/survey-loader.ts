import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subject, Subscription } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

import { environment } from 'environments/environment';
import { UserContext } from 'libs/models';
import { ConfigurationGroup, EmailRecipientModel } from 'libs/models/data-loads';
import * as fromRootState from 'libs/state/state';
import * as fromAppNotificationsMainReducer from 'libs/features/infrastructure/app-notifications/reducers';
import { LoadingProgressBarModel } from 'libs/ui/common/loading/models';
import { CompositeDataLoadTypes, LoadTypes } from 'libs/constants';
import * as fromAppNotificationsActions from 'libs/features/infrastructure/app-notifications/actions/app-notifications.actions';
import { UploadSurveyFileComponent } from '../../upload-survey-file';
import * as fromSurveyLoaderActions from '../../../actions/survey-loader.actions';
import { SurveyUploadNotification } from '../../../models';
import * as fromSurveyLoaderMainReducer from '../../../reducers';
import { buildSurveyUploadNotification } from '../../../models';



@Component({
  selector: 'pf-survey-loader',
  templateUrl: './survey-loader.html',
  styleUrls: ['./survey-loader.scss']
})

export class SurveyLoaderComponent implements OnInit, OnDestroy {
  userContext$: Observable<UserContext>;
  processing$: Observable<boolean>;
  processingError$: Observable<boolean>;
  errorMessage$: Observable<string>;
  processingSuccess$: Observable<boolean>;
  savingConfigGroupSuccess$: Observable<boolean>;
  validationOnly$: Observable<boolean>;

  userContextSubscription: Subscription;
  processingSuccessSubscription: Subscription;
  processingErrorSubscription: Subscription;
  savingConfigGroupSuccessSubscription: Subscription;
  validationOnlySubscription: Subscription;

  @ViewChild('surveyFileUpload', {static: true}) private surveyFileUpload: UploadSurveyFileComponent;
  private unsubscribe$ = new Subject();
  env = environment;
  userContext: UserContext;
  notification: SurveyUploadNotification;
  validationOnly: boolean;
  loadingProgress: LoadingProgressBarModel = {
    interval: 10,
    intervalValue: 10,
    animated: true,
    progressive: false,
    title: 'Uploading...'
  };
  spinnerType = 'PROGRESS';
  constructor(
    private rootStore: Store<fromRootState.State>,
    private store: Store<fromSurveyLoaderMainReducer.State>,
    private notificationStore: Store<fromAppNotificationsMainReducer.State>
  ) {
    this.userContext$ = this.rootStore.select(fromRootState.getUserContext);
    this.processing$ = this.store.select(fromSurveyLoaderMainReducer.getProcessing);
    this.processingSuccess$ = this.store.select(fromSurveyLoaderMainReducer.getProcessingSuccess);
    this.processingError$ = this.store.select(fromSurveyLoaderMainReducer.getProcessingError);
    this.errorMessage$ = this.store.select(fromSurveyLoaderMainReducer.getErrorMessage);
    this.savingConfigGroupSuccess$ = this.store.select(fromSurveyLoaderMainReducer.getSavingConfigGroupSuccess);
    this.validationOnly$ = this.store.select(fromSurveyLoaderMainReducer.getValidationOnly);


  }

  ngOnInit() {
    this.userContextSubscription = this.userContext$.subscribe(userContext => {
      if (!!userContext) {
        this.userContext = userContext;
      }
    });
    this.processingSuccessSubscription = this.processingSuccess$.subscribe(success => {
      if (success) {
        this.showSuccessNotification();
        this.surveyFileUpload.clearFile();
      }
    });
    this.processingErrorSubscription = this.processingError$.subscribe(error => {
      if (error) {
        this.showErrorNotification();
      }
    });
    this.setConfigGroup();
    this.savingConfigGroupSuccessSubscription = this.savingConfigGroupSuccess$.subscribe(success => this.handleSavingConfigGroupSuccess(success));
    this.validationOnlySubscription = this.validationOnly$.subscribe(value => this.validationOnly = value);
    this.notification = buildSurveyUploadNotification();
  }
  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.unsubscribe();
    this.userContextSubscription.unsubscribe();
    this.processingSuccessSubscription.unsubscribe();
    this.processingErrorSubscription.unsubscribe();
    this.savingConfigGroupSuccessSubscription.unsubscribe();
    this.validationOnlySubscription.unsubscribe();
  }

  goBack() {
    window.location.href = this.env.siteAdminUrl;
  }

  handleProcessClicked(): void {
    this.store.dispatch(new fromSurveyLoaderActions.SaveConfig());
  }

  private setConfigGroup(): void {
      const configGroup: ConfigurationGroup = {
      LoaderConfigurationGroupId: null,
      GroupName: '',
      CompanyId: null,
      LoadType: LoadTypes.Manual,
      PrimaryCompositeDataLoadType: CompositeDataLoadTypes.Survey,
      CreateNewConfigOverride: true
    };
    this.store.dispatch(new fromSurveyLoaderActions.SetConfigGroup(configGroup));
  }

  handleSavingConfigGroupSuccess(success: boolean) {
    if (!success) {
      return;
    }

    this.store.dispatch(new fromSurveyLoaderActions.ProcessingSuccess());
  }

  showSuccessNotification(): void {
    if (this.validationOnly) {
      this.notificationStore.dispatch(new fromAppNotificationsActions.AddNotification(this.notification.ValidationOnly));
    } else {
      this.notificationStore.dispatch(new fromAppNotificationsActions.AddNotification(this.notification.Success));
    }
  }

  showErrorNotification(): void {
    this.notificationStore.dispatch(new fromAppNotificationsActions.AddNotification(this.notification.Error));
  }
}

