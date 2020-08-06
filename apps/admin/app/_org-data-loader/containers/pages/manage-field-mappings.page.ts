import {ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';

import { delay, isNumber, isObject, isEmpty } from 'lodash';
import { Store } from '@ngrx/store';
import {Observable, Subject} from 'rxjs';
import {filter, take, takeUntil} from 'rxjs/operators';
import { NotificationRef, NotificationService, NotificationSettings } from '@progress/kendo-angular-notification';

import { environment } from 'environments/environment';
import { CompositeDataLoadTypes } from 'libs/constants/composite-data-load-types';
import { LoaderFieldMappingsApiService } from 'libs/data/payfactors-api/data-loads/index';
import { LoaderFileFormat } from 'libs/features/org-data-loader/constants';
import { LoaderSettings, OrgDataLoadHelper } from 'libs/features/org-data-loader/helpers';
import { LoaderEntityStatus, VisibleLoaderOptionModel } from 'libs/features/org-data-loader/models';
import * as fromLoaderSettingsActions from 'libs/features/org-data-loader/state/actions/loader-settings.actions';
import { ConfigSetting } from 'libs/models/security';
import { ConfigSettingsSelectorFactory } from 'libs/state/app-context/services';
import * as fromEmailRecipientsActions from 'libs/features/loader-email-reipients/state/actions/email-recipients.actions';
import {
  ConfigurationGroup,
  EmailRecipientModel, LoaderFieldSet,
  LoaderSaveCoordination,
  LoaderSetting, MappingModel
} from 'libs/models/data-loads';
import { LoadTypes } from 'libs/constants';
import * as fromCompanySelectorActions from 'libs/features/company/company-selector/actions';
import { CompanySelectorItem } from 'libs/features/company/company-selector/models';
import * as fromCompanyReducer from 'libs/features/company/company-selector/reducers';
import {CompanySelectorComponent} from 'libs/features/company/company-selector/components';
import { OrgDataLoaderConfigurationSaveRequest } from 'libs/models/data-loads/request';
import { SftpUserModel } from 'libs/models/Sftp';

import * as fromOrgDataAutoloaderReducer from '../../reducers';
import * as fromOrgDataFieldMappingsActions from '../../actions/org-data-field-mappings.actions';
import * as fromConfigurationGroupsActions from '../../actions/configuration-groups.actions';
import * as fromOrgDataConfigurationActions from '../../actions/org-data-loader-configuration.actions';
import * as fromSftpUserActions from '../../actions/sftp-user.actions';
import {
    LoaderType, ORG_DATA_PF_EMPLOYEE_FIELDS, ORG_DATA_PF_JOB_FIELDS, ORG_DATA_PF_PAYMARKET_FIELDS, ORG_DATA_PF_STRUCTURE_FIELDS,
    ORG_DATA_PF_STRUCTURE_MAPPING_FIELDS
} from '../../constants';
import { OrgDataFilenamePatternSet } from '../../models';
import { ACCEPTED_FILE_EXTENSIONS } from '../../constants/public-key-filename-constants';


@Component({
  selector: 'pf-autoloader-field-mapping-page',
  templateUrl: './manage-field-mappings.page.html',
  styleUrls: ['./manage-field-mappings.page.scss']
})
export class ManageFieldMappingsPageComponent implements OnInit, OnDestroy {
  @ViewChild('companySelector') companySelector: CompanySelectorComponent;
  env = environment;
  payfactorsPaymarketDataFields: string[];
  payfactorsJobDataFields: string[];
  payfactorsStructureDataFields: string[];
  payfactorsStructureMappingDataFields: string[];
  payfactorsEmployeeDataFields: string[];
  paymarketMappingComplete: boolean;
  jobMappingComplete: boolean;
  structureMappingComplete: boolean;
  structureMappingMappingComplete: boolean;
  employeeMappingComplete: boolean;
  companies$: Observable<CompanySelectorItem[]>;
  selectedCompany$: Observable<CompanySelectorItem>;
  selectedCompany: CompanySelectorItem = null;
  mappings: MappingModel[];
  companyMappings$: Observable<LoaderFieldSet[]>;
  companyMappingsLoading$: Observable<boolean>;
  emailRecipients$: Observable<EmailRecipientModel[]>;
  isActive: boolean;
  isCompanyOnAutoloader: boolean;
  delimiter: string;
  dateFormat: string;
  isEmployeesLoadEnabled: boolean;
  isJobsLoadEnabled: boolean;
  isPaymarketsLoadEnabled: boolean;
  isStructuresLoadEnabled: boolean;
  isStructureMappingsLoadEnabled: boolean;
  isEmployeesFullReplace: boolean;
  isStructureMappingsFullReplace: boolean;
  loaderSettings$: Observable<LoaderSetting[]>;
  loaderSettingsLoading$: Observable<boolean>;
  existingCompanyLoaderSettings: LoaderSetting[];
  orgDataFilenamePatternSet$: Observable<OrgDataFilenamePatternSet>;
  templateReferenceConstants = {
    LoaderType,
  };
  sftpDomainConfig$: Observable<ConfigSetting>;
  sftpPortConfig$: Observable<ConfigSetting>;
  visibleLoaderOptions: VisibleLoaderOptionModel;
  emailRecipientsSavingError$: Observable<boolean>;
  emailRecipientsRemovingError$: Observable<boolean>;
  emailRecipientsModalOpen$: Observable<boolean>;
  private configurationGroups$: Observable<ConfigurationGroup[]>;
  selectedConfigGroup: ConfigurationGroup;
  private unsubscribe$ = new Subject();
  loadType = LoadTypes.Sftp;
  primaryCompositeDataLoadType = CompositeDataLoadTypes.OrgData;
  sftpUserName$: Observable<string>;
  sftpPublicKey$: Observable<File>;
  private sftpUserName: string;
  private sftpPublicKey: File;
  private publicKeyFileName: string;
  saveConfigurationSuccess$: Observable<boolean>;
  saveConfigurationError$: Observable<boolean>;
  sftpUser$: Observable<SftpUserModel>;
  sftpUser: SftpUserModel;
  sftpUserNameIsValid$: Observable<boolean>;
  private emailRecipients: EmailRecipientModel[];
  private sftpUserNameIsValid: boolean;

  private toastOptions: NotificationSettings = {
    animation: {
      type: 'slide',
      duration: 400,
    },
    closable: true,
    content: '',
    cssClass: '',
    hideAfter: 5000,
    position: {
      horizontal: 'center',
      vertical: 'bottom',
    },
    type: {
      style: 'success',
      icon: true,
    },
  };
  private acceptedFileExtensions = ACCEPTED_FILE_EXTENSIONS;
  private saveConfiguration$: Observable<boolean>;
  private loaderSettingsLoading: boolean;
  private fieldMappingsLoading: boolean;
  private savingConfiguration: boolean;


  private get toastSuccessOptions(): NotificationSettings {
    return {
      ...this.toastOptions,
      content: 'Configuration has been saved and autoloader will begin processing this client\'s files when they become available.',
      cssClass: 'alert-success',
    };
  }

  private get toastErrorOptions(): NotificationSettings {
    return {
      ...this.toastOptions,
      content: 'Error saving configuration.',
      cssClass: 'alert-error',
      type: {
        ...this.toastOptions.type,
        style: 'error',
      }
    };
  }

  private toastReference: NotificationRef;
  private get toastClosePaddingMs(): number {
    // need to provide some padding around the closing of toast notifications before opening a new one
    // should be longer than the animation duration of the toast
    const baseAnimationDuration = isNumber(this.toastOptions.animation.duration) ? this.toastOptions.animation.duration : 0;
    return baseAnimationDuration + 100;
  }

  private loaderSaveCoordination: LoaderSaveCoordination;

  constructor(
    private store: Store<fromOrgDataAutoloaderReducer.State>,
    private orgDataAutoloaderApi: LoaderFieldMappingsApiService,
    private notificationService: NotificationService,
    private configSettingsSelectorFactory: ConfigSettingsSelectorFactory,
    private cdr: ChangeDetectorRef,
  ) {
    this.payfactorsPaymarketDataFields = ORG_DATA_PF_PAYMARKET_FIELDS;
    this.payfactorsJobDataFields = ORG_DATA_PF_JOB_FIELDS;
    this.payfactorsStructureDataFields = ORG_DATA_PF_STRUCTURE_FIELDS;
    this.payfactorsStructureMappingDataFields = ORG_DATA_PF_STRUCTURE_MAPPING_FIELDS;
    this.payfactorsEmployeeDataFields = ORG_DATA_PF_EMPLOYEE_FIELDS;

    this.paymarketMappingComplete = true;
    this.jobMappingComplete = true;
    this.structureMappingComplete = true;
    this.structureMappingMappingComplete = true;
    this.employeeMappingComplete = true;

    this.companies$ = this.store.select(fromCompanyReducer.getCompanies);
    this.selectedCompany$ = this.store.select(fromCompanyReducer.getSelectedCompany);
    this.companyMappings$ = this.store.select(fromOrgDataAutoloaderReducer.getFieldMappings);
    this.companyMappingsLoading$ = this.store.select(fromOrgDataAutoloaderReducer.getLoadingFieldMappings);
    this.emailRecipients$ = this.store.select(fromOrgDataAutoloaderReducer.getEmailRecipients);
    this.emailRecipientsSavingError$ = this.store.select(fromOrgDataAutoloaderReducer.getSavingRecipientError);
    this.emailRecipientsRemovingError$ = this.store.select(fromOrgDataAutoloaderReducer.getRemovingRecipientError);
    this.emailRecipientsModalOpen$ = this.store.select(fromOrgDataAutoloaderReducer.getEmailRecipientsModalOpen);
    this.loaderSettings$ = this.store.select(fromOrgDataAutoloaderReducer.getLoaderSettings);
    this.loaderSettingsLoading$ = this.store.select(fromOrgDataAutoloaderReducer.getLoadingLoaderSettings);
    this.orgDataFilenamePatternSet$ = this.store.select(fromOrgDataAutoloaderReducer.getOrgDataFilenamePatternSet);
    this.configurationGroups$ = this.store.select(fromOrgDataAutoloaderReducer.getConfigurationGroups);
    this.sftpUserName$ = this.store.select(fromOrgDataAutoloaderReducer.getSftpUserName);
    this.sftpPublicKey$ = this.store.select(fromOrgDataAutoloaderReducer.getSftpPublicKey);
    this.saveConfiguration$ = this.store.select(fromOrgDataAutoloaderReducer.getSavingConfiguration);
    this.saveConfigurationSuccess$ = this.store.select(fromOrgDataAutoloaderReducer.getSavingConfigurationSuccess);
    this.saveConfigurationError$ = this.store.select(fromOrgDataAutoloaderReducer.getSavingConfigurationError);
    this.sftpUser$ = this.store.select(fromOrgDataAutoloaderReducer.getSftpUser);

    const sftpDomainConfigSelector = this.configSettingsSelectorFactory.getConfigSettingsSelector('SftpDomain');
    const sftpPortConfigSelector = this.configSettingsSelectorFactory.getConfigSettingsSelector('SftpPort');
    this.sftpDomainConfig$ = this.store.select(sftpDomainConfigSelector);
    this.sftpPortConfig$ = this.store.select(sftpPortConfigSelector);
    this.sftpUserNameIsValid$ = this.store.select(fromOrgDataAutoloaderReducer.getIsUserNameValid);

    this.mappings = [];
    this.isActive = true;
    this.delimiter = ',';
    this.isEmployeesLoadEnabled = false;
    this.isJobsLoadEnabled = false;
    this.isPaymarketsLoadEnabled = false;
    this.isStructuresLoadEnabled = false;
    this.isStructureMappingsLoadEnabled = false;
    this.isEmployeesFullReplace = true;
    this.isStructureMappingsFullReplace = true;
    this.existingCompanyLoaderSettings = [];
    this.visibleLoaderOptions = {
      clientFileName: true,
      selectFile: true
    };

    this.loaderSettingsLoading$.pipe(
      takeUntil(this.unsubscribe$)
    ).subscribe(f => {
      this.loaderSettingsLoading = f;
    });

    this.companyMappingsLoading$.pipe(
      takeUntil(this.unsubscribe$)
    ).subscribe(f => {
      this.fieldMappingsLoading = f;
    });

    this.saveConfiguration$.pipe(
      takeUntil(this.unsubscribe$)
    ).subscribe(f => {
      this.savingConfiguration = f;
    });

    this.selectedCompany$.pipe(
      takeUntil(this.unsubscribe$),
    ).subscribe(f => {
      this.selectedCompany = f;
      if (f) {
        this.companySelector.isDisabled = true;
        this.CompanySelected();
        this.cdr.detectChanges();
      }
    });

    this.companies$.pipe(
      filter(uc => !!uc),
      take(1),
      takeUntil(this.unsubscribe$)
    ).subscribe(f => {
      this.store.dispatch(new fromCompanySelectorActions.SetSelectedCompany(null));
    });

    this.loaderSettings$
      .pipe(
        filter(settings => settings.length > 0),
      )
      .subscribe(settings => {
        this.existingCompanyLoaderSettings = settings;


        const resp = OrgDataLoadHelper.parseSettingResponse(settings);

        this.isActive = resp.isActive;
        this.isCompanyOnAutoloader = resp.isCompanyOnAutoloader;

        this.delimiter = resp.delimiter;
        this.dateFormat = resp.dateFormat;
        this.isEmployeesLoadEnabled = resp.isEmployeesLoadEnabled;
        this.isJobsLoadEnabled = resp.isJobsLoadEnabled;
        this.isPaymarketsLoadEnabled = resp.isPaymarketsLoadEnabled;
        this.isStructuresLoadEnabled = resp.isStructuresLoadEnabled;
        this.isStructureMappingsLoadEnabled = resp.isStructureMappingsLoadEnabled;
        this.isEmployeesFullReplace = resp.isEmployeesFullReplace;
        this.isStructureMappingsFullReplace = resp.isStructureMappingsFullReplace;
      });

    this.configurationGroups$
      .pipe(
        filter(configGroups => !!configGroups)
      )
      .subscribe(configGroups => {
        if (configGroups.length > 0) {
          // For now we only save one config group per company per loadType, so the array only contains one item
          this.selectedConfigGroup = configGroups[0];
          this.reloadLoaderSettings();
          this.reloadFieldMappings();
        }
        if (this.selectedCompany) {
          this.store.dispatch(new fromEmailRecipientsActions.LoadEmailRecipients({
            companyId: this.selectedCompany.CompanyId,
            loaderType: 'Organizational Data',
            loaderConfigurationGroupId: this.selectedConfigGroup ? this.selectedConfigGroup.LoaderConfigurationGroupId : undefined
          }));
        }
      });

    this.sftpUserName$.pipe(
      takeUntil(this.unsubscribe$)
    ).subscribe(userName => {
      this.sftpUserName = userName;
    });

    this.sftpPublicKey$.pipe(
      takeUntil(this.unsubscribe$)
    ).subscribe(key => {
      this.publicKeyFileName = key ? key.name : null;
      this.sftpPublicKey = key;
    });

    this.saveConfigurationSuccess$.pipe(
      takeUntil(this.unsubscribe$),
      filter(success => success)
    ).subscribe(() => {
      this.mappings = [];
      this.getConfigurationGroups();
      this.showSaveSuccessToast();
    });

    this.saveConfigurationError$.pipe(
      takeUntil(this.unsubscribe$),
      filter(error => error)
    ).subscribe(this.showSaveErrorToast);

    this.sftpUser$.pipe(
      takeUntil(this.unsubscribe$),
      filter(user => !!user)
    ).subscribe(user => {
      this.store.dispatch(new fromSftpUserActions.SetSftpUsername(user.UserName));
      this.publicKeyFileName = user.FileName;
      this.sftpUser = user;
    });

    this.emailRecipients$.pipe(
      takeUntil(this.unsubscribe$),
      filter(recipients => !!recipients)
    ).subscribe(recipients => {
      this.emailRecipients = recipients;
    });

    this.sftpUserNameIsValid$.pipe(
      takeUntil(this.unsubscribe$),
      filter(isValid => !!isValid)
    ).subscribe(isValid => {
      this.sftpUserNameIsValid = isValid;
    });
  } // end constructor

  ngOnInit() {
    this.store.dispatch(new fromCompanySelectorActions.GetCompanies());
  }
  ngOnDestroy(): void {
    this.unsubscribe$.next(true);
  }

  onPaymarketMappingComplete($event: LoaderEntityStatus) {
    this.paymarketMappingComplete = $event.complete;
    this.isPaymarketsLoadEnabled = $event.loadEnabled;
    if (this.paymarketMappingComplete) {
      this.addOrReplaceMappings('PayMarkets', $event.mappings);
    }
  }

  onJobMappingComplete($event: LoaderEntityStatus) {
    this.jobMappingComplete = $event.complete;
    this.isJobsLoadEnabled = $event.loadEnabled;
    if (this.jobMappingComplete) {
      this.addOrReplaceMappings('Jobs', $event.mappings);
    }
  }

  onStructureMappingComplete($event: LoaderEntityStatus) {
    this.structureMappingComplete = $event.complete;
    this.isStructuresLoadEnabled = $event.loadEnabled;
    if (this.structureMappingComplete) {
      this.addOrReplaceMappings('Structures', $event.mappings);
    }
  }

  onStructureMappingMappingComplete($event: LoaderEntityStatus) {
    this.structureMappingMappingComplete = $event.complete;
    this.isStructureMappingsLoadEnabled = $event.loadEnabled;
    if (this.structureMappingMappingComplete) {
      this.addOrReplaceMappings('StructureMapping', $event.mappings);
    }
    this.isStructureMappingsFullReplace = $event.isFullReplace;
  }

  onEmployeeMappingComplete($event: LoaderEntityStatus) {
    this.employeeMappingComplete = $event.complete;
    this.isEmployeesLoadEnabled = $event.loadEnabled;
    if (this.employeeMappingComplete) {
      this.addOrReplaceMappings('Employees', $event.mappings);
    }
    if ($event.dateFormat) {
      this.dateFormat = $event.dateFormat;
    }
    this.isEmployeesFullReplace = $event.isFullReplace;
  }

  CompanySelected() {
    this.orgDataAutoloaderApi.getCustomJobFields(this.selectedCompany.CompanyId).subscribe(res => {
      res.forEach((udf) => {
        this.payfactorsJobDataFields.push(udf.Value);
      });
    });

    this.orgDataAutoloaderApi.getCustomEmployeeFields(this.selectedCompany.CompanyId).subscribe(res => {
      res.forEach((udf) => {
        this.payfactorsEmployeeDataFields.push(udf.Value);
      });
    });

    this.getConfigurationGroups();

    this.store.dispatch(new fromSftpUserActions.GetSftpUser(this.selectedCompany.CompanyId));
  }

  private getConfigurationGroups() {
    this.store.dispatch(new fromConfigurationGroupsActions.LoadingConfigurationGroups({
      CompanyId: this.selectedCompany.CompanyId,
      LoadType: this.loadType,
      PrimaryCompositeDataLoadType: this.primaryCompositeDataLoadType
    }));
  }

  SaveConfiguration() {
      const loaderSettingsToSave = this.getLoaderSettingsToSave();
      const sftpUser = this.getSftpUserToSave();

      const request: OrgDataLoaderConfigurationSaveRequest = {
        LoaderSettings: loaderSettingsToSave,
        LoaderFieldMappings: this.mappings,
        SftpUser: sftpUser,
        LoaderConfigurationGroupId: this.selectedConfigGroup ? this.selectedConfigGroup.LoaderConfigurationGroupId : null,
        CompanyId: this.selectedCompany.CompanyId,
        LoadType: LoadTypes.Sftp
      };
      if ((this.sftpPublicKey && this.userConfirmation()) || !this.sftpPublicKey) {
        this.store.dispatch(new fromOrgDataConfigurationActions.SaveConfiguration({request: request, publicKey: this.sftpPublicKey}));
      }
  }

  private userConfirmation() {
    return confirm('You are about to upload ' + this.sftpPublicKey.name + ' as the public key for ' + this.selectedCompany.CompanyName + '. Are you sure?');
  }

  private isValidExtension(file: File) {
    if (file) {
      return (new RegExp('(' + this.acceptedFileExtensions.join('|').replace(/\./g, '\\.') + ')$', 'i')).test(file.name);
    }

    return true;
  }

  private reloadLoaderSettings() {
    this.store.dispatch(
      new fromLoaderSettingsActions.LoadingLoaderSettings(this.selectedCompany.CompanyId, this.selectedConfigGroup.LoaderConfigurationGroupId));
  }

  private reloadFieldMappings() {
    this.store.dispatch(
      new fromOrgDataFieldMappingsActions.LoadingFieldMappings(this.selectedCompany.CompanyId, this.selectedConfigGroup.LoaderConfigurationGroupId));
  }

  private addOrReplaceMappings(loaderType: string, mappings: string[]) {
    const mappingsModel: MappingModel = {
      LoaderType: loaderType,
      Mappings: mappings
    };

    this.mappings = this.mappings.filter(mapping => mapping.LoaderType !== loaderType);
    this.mappings.push(mappingsModel);
  }



  private getLoaderSettingsToSave() {
    const newLoaderSettings = new LoaderSettings();

    newLoaderSettings.isActive = this.isActive;
    newLoaderSettings.isCompanyOnAutoloader = this.isCompanyOnAutoloader;
    newLoaderSettings.delimiter = this.delimiter;
    newLoaderSettings.dateFormat = this.dateFormat;
    newLoaderSettings.isEmployeesLoadEnabled = this.isEmployeesLoadEnabled;
    newLoaderSettings.isJobsLoadEnabled = this.isJobsLoadEnabled;
    newLoaderSettings.isPaymarketsLoadEnabled = this.isPaymarketsLoadEnabled;
    newLoaderSettings.isStructuresLoadEnabled = this.isStructuresLoadEnabled;
    newLoaderSettings.isStructureMappingsLoadEnabled = this.isStructureMappingsLoadEnabled;
    newLoaderSettings.isEmployeesFullReplace = this.isEmployeesFullReplace;
    newLoaderSettings.isStructureMappingsFullReplace = this.isStructureMappingsFullReplace;
    newLoaderSettings.fileFormat = LoaderFileFormat.CSV;

    return OrgDataLoadHelper.getLoaderSettingsToSave(newLoaderSettings, this.existingCompanyLoaderSettings);
  }

  private showSaveSuccessToast = () => {
    this.showToast(this.toastSuccessOptions);
  }

  private showSaveErrorToast = () => {
    this.showToast(this.toastErrorOptions);
  }

  private showToast(options: NotificationSettings) {
    if (isObject(this.toastReference)) {
      try {
        /**
         * smh... Kendo Notifications throw an error if you try to hide a notification that is already hidden,
         * but also don't provide a way to detect whether the notification is visible or not
         * wrap in try-catch block to swallow the error and get around this nonsense
         */
        this.toastReference.hide();
      } catch (e) { }
    }

    // delay to emphasize that this is a new toast message in the event that the text content is the same
    delay(
      () => this.toastReference = this.notificationService.show(options),
      this.toastClosePaddingMs,
    );
  }

  openEmailRecipientsModal() {
    this.store.dispatch(new fromEmailRecipientsActions.OpenEmailRecipientsModal());
  }

  private getSftpUserToSave() {
    let sftpUser: SftpUserModel = null;

    if (this.sftpUserName || this.sftpPublicKey) {
      const userName = this.sftpUserName ? this.sftpUserName.trim() : this.sftpUser ? this.sftpUser.UserName : null;
      const fileName = this.sftpPublicKey ? this.sftpPublicKey.name : this.sftpUser ? this.sftpUser.FileName : null;

      sftpUser = {
        CompanyId: this.selectedCompany.CompanyId,
        UserName: userName,
        FileName: fileName,
        UserId: null
      };
    }
    return sftpUser;
  }

  isPublicKeyAuthInfoComplete() {
    if (this.sftpUserName || this.publicKeyFileName) {
      return this.sftpUserName && (this.publicKeyFileName || (!isEmpty(this.sftpUser) && this.sftpUser.FileName));
    } else if (this.sftpUserName === '') {
      return false;
    } else {
      return true;
    }
  }

  shouldDisableBtn() {
    let part1 = (!this.paymarketMappingComplete
      || !this.jobMappingComplete
      || !this.structureMappingComplete
      || !this.structureMappingMappingComplete
      || !this.employeeMappingComplete);
    let part2 = this.delimiter === '';
    let part3 = this.emailRecipients.length === 0;
    let part4 = !this.isValidExtension(this.sftpPublicKey);
    let part5 = this.sftpUserNameIsValid === false;
    let part6 = !this.isPublicKeyAuthInfoComplete();
    let part7 = (this.savingConfiguration || this.loaderSettingsLoading || this.fieldMappingsLoading);

    return part1 || part2 || part3 || part4 || part5 || part6 || part7;
  }
}
