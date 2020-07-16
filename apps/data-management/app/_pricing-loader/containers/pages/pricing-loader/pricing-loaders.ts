import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';

import { Observable, Subject, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { filter, take, takeUntil } from 'rxjs/operators';

import * as fromRootState from 'libs/state/state';
import * as fromCompanyReducer from 'libs/features/company/company-selector/reducers';
import * as fromCompanySelectorActions from 'libs/features/company/company-selector/actions';
import * as fromAppNotificationsActions from 'libs/features/app-notifications/actions/app-notifications.actions';
import * as fromAppNotificationsMainReducer from 'libs/features/app-notifications/reducers';
import { environment } from 'environments/environment';
import { CompanySelectorItem } from 'libs/features/company/company-selector/models';
import { ConfigurationGroup, EmailRecipientModel } from 'libs/models/data-loads';
import { LoadTypes, CompositeDataLoadTypes } from 'libs/constants';
import { UserContext } from 'libs/models';
import { LoadingProgressBarModel } from 'libs/ui/common/loading/models';

import * as fromPricingLoaderActions from '../../../actions/pricing-loader.actions';
import * as fromPricingLoaderMainReducer from '../../../reducers';
import {
  EntityChoice,
  getEntityChoicesForPricingLoader,
  PricingUploadNotification,
  buildPricingUploadNotification
} from '../../../models';
import { FILETYPES, MRPFIELDS } from '../../../constants';
import { UploadPricingFileComponent } from '../../upload-pricing-file';

@Component({
  selector: 'pf-pricing-loaders',
  templateUrl: './pricing-loaders.html',
  styleUrls: ['./pricing-loaders.scss']
})

export class PricingLoadersComponent implements OnInit, OnDestroy {
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

  @ViewChild('pricingFileUpload', { static: true }) private pricingFileUpload: UploadPricingFileComponent;
  private unsubscribe$ = new Subject();
  private companies$: Observable<CompanySelectorItem[]>;
  private selectedCompany$: Observable<CompanySelectorItem>;
  public selectedCompany: CompanySelectorItem = null;
  entities: EntityChoice[];
  env = environment;
  isCollapsed = false;
  fileTypes = FILETYPES;
  MRPFields = MRPFIELDS;
  isEditingSetting: boolean;
  userContext: UserContext;
  notification: PricingUploadNotification;
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
    private companyStore: Store<fromCompanyReducer.State>,
    private store: Store<fromPricingLoaderMainReducer.State>,
    private rootStore: Store<fromRootState.State>,
    private notificationStore: Store<fromAppNotificationsMainReducer.State>
  ) {
    this.entities  = getEntityChoicesForPricingLoader();
    this.companies$ = this.companyStore.select(fromCompanyReducer.getCompanies);
    this.selectedCompany$ = this.companyStore.select(fromCompanyReducer.getSelectedCompany);
    this.userContext$ = this.rootStore.select(fromRootState.getUserContext);
    this.processing$ = this.store.select(fromPricingLoaderMainReducer.getProcessing);
    this.processingSuccess$ = this.store.select(fromPricingLoaderMainReducer.getProcessingSuccess);
    this.processingError$ = this.store.select(fromPricingLoaderMainReducer.getProcessingError);
    this.errorMessage$ = this.store.select(fromPricingLoaderMainReducer.getErrorMessage);
    this.savingConfigGroupSuccess$ = this.store.select(fromPricingLoaderMainReducer.getSavingConfigGroupSuccess);
    this.validationOnly$ = this.store.select(fromPricingLoaderMainReducer.getValidationOnly);

    this.selectedCompany$.pipe(
      takeUntil(this.unsubscribe$)
    ).subscribe(f => {
      this.selectedCompany = f;
      this.setConfigGroup();
      this.setEmailRecipient(this.userContext);
    });

    this.companies$.pipe(
      filter(uc => !!uc),
      take(1),
      takeUntil(this.unsubscribe$)
    ).subscribe(f => {
      this.companyStore.dispatch(new fromCompanySelectorActions.SetSelectedCompany(null));
    });
  }

  ngOnInit() {
    this.userContextSubscription = this.userContext$.subscribe(userContext => {
      if (!!userContext) {
        this.userContext = userContext;
      }
    });
    this.companyStore.dispatch(new fromCompanySelectorActions.GetCompanies());
    this.processingSuccessSubscription = this.processingSuccess$.subscribe(success => {
      if (success) {
        this.companyStore.dispatch(new fromCompanySelectorActions.SetSelectedCompany(null));
        this.showSuccessNotification();
      }
    });
    this.processingErrorSubscription = this.processingError$.subscribe(error => {
      if (error) {
        this.showErrorNotification();
      }
    });
    this.savingConfigGroupSuccessSubscription = this.savingConfigGroupSuccess$.subscribe(success => this.handleSavingConfigGroupSuccess(success));
    this.validationOnlySubscription = this.validationOnly$.subscribe(value => this.validationOnly = value);
    this.notification = buildPricingUploadNotification();
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

  selectedEntities(): EntityChoice[] {
    if (!this.entities) {
      return [];
    }
    return this.entities;
  }

  goBack() {
    window.location.href = this.env.siteAdminUrl;
  }

  textWidth(value: number) {
   return value.toString().length <= 3;
  }

  goDownload() {
    window.open('/client/data-management/pricing-loader/pricing-loaders-download?company=' +
      encodeURIComponent(this.selectedCompany.CompanyId + '-' + this.selectedCompany.CompanyName) + '&companyId=' + this.selectedCompany.CompanyId, '_blank');
  }

  handleProcessClicked(): void {
    if (!this.selectedCompany) {
      return;
    }
    this.store.dispatch(new fromPricingLoaderActions.SaveConfig());
  }

  private setConfigGroup(): void {
    if (!this.selectedCompany) {
      this.store.dispatch(new fromPricingLoaderActions.ResetState());
      return;
    }
    const configGroup: ConfigurationGroup = {
      LoaderConfigurationGroupId: null,
      GroupName: '',
      CompanyId: this.selectedCompany.CompanyId,
      LoadType: LoadTypes.Manual,
      PrimaryCompositeDataLoadType: CompositeDataLoadTypes.Pricings,
      CreateNewConfigOverride: true
    };
    this.store.dispatch(new fromPricingLoaderActions.SetConfigGroup(configGroup));
  }

  private setEmailRecipient(userContext: UserContext): void {
    if (!userContext) {
      return;
    }
    const emailRecipient: EmailRecipientModel = {
      DataLoadEmailRecipientId: 0,
      CompanyId: this.selectedCompany.CompanyId,
      UserId: userContext.UserId,
      EmailAddress: userContext.EmailAddress,
      FirstName: userContext.FirstName,
      LastName: userContext.LastName,
      LoaderType: CompositeDataLoadTypes.Pricings,
      IsCompanyServicesRep: false,
      UserPicture: '',
      LoaderConfigurationGroupId: null
    };
    this.store.dispatch(new fromPricingLoaderActions.SetEmailRecipient(emailRecipient));
  }

  private handleSavingConfigGroupSuccess(success: boolean) {
    if (!success) {
      return;
    }
    this.addEmailRecipient();
    this.uploadExcelFile();
  }

  private addEmailRecipient(): void {
    this.store.dispatch(new fromPricingLoaderActions.AddEmailRecipient());
  }

  private uploadExcelFile(): void {
    if (!this.selectedCompany || !this.userContext || !this.pricingFileUpload.selectedFile) {
      return;
    }
    this.store.dispatch(new fromPricingLoaderActions.UploadFile({
      companyId: this.selectedCompany.CompanyId,
      userContext: this.userContext,
      file: this.pricingFileUpload.selectedFile
    }));
  }

  private showSuccessNotification(): void {
    if (this.validationOnly) {
      this.notificationStore.dispatch(new fromAppNotificationsActions.AddNotification(this.notification.ValidationOnly));
    } else {
      this.notificationStore.dispatch(new fromAppNotificationsActions.AddNotification(this.notification.Success));
    }
  }

  private showErrorNotification(): void {
    this.notificationStore.dispatch(new fromAppNotificationsActions.AddNotification(this.notification.Error));
  }
}

