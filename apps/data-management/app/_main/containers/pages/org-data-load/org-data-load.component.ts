import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';

import { KeyValue } from '@angular/common';

import { Store } from '@ngrx/store';
import { forkJoin, Observable, Subject } from 'rxjs';
import { filter, take, takeUntil } from 'rxjs/operators';

import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';

import { environment } from 'environments/environment';
import { CompositeDataLoadTypes, LoadTypes } from 'libs/constants';
import * as fromAppNotificationsActions from 'libs/features/app-notifications/actions/app-notifications.actions';
import {
    AppNotification, NotificationLevel, NotificationPayload, NotificationSource, NotificationType
} from 'libs/features/app-notifications/models';
import * as fromAppNotificationsMainReducer from 'libs/features/app-notifications/reducers';
import * as fromCompanySelectorActions from 'libs/features/company/company-selector/actions';
import { CompanySelectorItem } from 'libs/features/company/company-selector/models';
import * as fromCompanyReducer from 'libs/features/company/company-selector/reducers';
import * as fromEmailRecipientsActions from 'libs/features/loader-email-reipients/state/actions/email-recipients.actions';
import { LoaderFileFormat, LoaderSettingsKeys, LoaderType } from 'libs/features/org-data-loader/constants';
import { LoaderSettings, OrgDataLoadHelper } from 'libs/features/org-data-loader/helpers';
import { ILoadSettings } from 'libs/features/org-data-loader/helpers/org-data-load-helper';
import { FileUploadDataRequestModel, LoaderEntityStatus } from 'libs/features/org-data-loader/models';
import * as fromLoaderSettingsActions from 'libs/features/org-data-loader/state/actions/loader-settings.actions';
import * as fromFileUploadReducer from 'libs/features/org-data-loader/state/reducers';
import { CompanySetting, CompanySettingsEnum } from 'libs/models/company';
import { ConfigurationGroup, EmailRecipientModel, LoaderSaveCoordination, LoaderSetting, MappingModel } from 'libs/models/data-loads';
import { UserContext } from 'libs/models/security';
import * as fromRootState from 'libs/state/state';
import { LoadingProgressBarModel } from 'libs/ui/common/loading/models';

import * as fromDataManagementMainReducer from '../../../reducers';
import * as fromOrganizationalDataActions from '../../../actions/organizational-data-page.action';
import * as fromCustomFieldsActions from '../../../actions/custom-fields.actions';
import * as fromOrgDataFieldMappingsActions from '../../../actions/organizational-data-field-mapping.actions';
import { EntityUploadComponent } from '../../../components';
import { EntityChoice, FileUploadDataModel, getEntityChoicesForOrgLoader, OrgUploadStep } from '../../../models';

@Component({
  selector: 'pf-org-data-load',
  templateUrl: './org-data-load.component.html',
  styleUrls: ['./org-data-load.component.scss']
})

export class OrgDataLoadComponent implements OnInit, OnDestroy {

  @ViewChild('entityUpload') uploadComponent: EntityUploadComponent;
  @ViewChild('downloadToolTip') public tooltip: NgbTooltip;

  private defaultDelimiter = ',';

  loadOptions: EntityChoice[];
  userMappings: KeyValue<number, string>[];

  private unsubscribe$ = new Subject();
  private companies$: Observable<CompanySelectorItem[]>;
  private selectedCompany$: Observable<CompanySelectorItem>;
  private organizationalDataTemplateLink$: Observable<string>;
  private configGroups$: Observable<ConfigurationGroup[]>;
  private customJobFields$: Observable<any>;
  private customEmployeeFields$: Observable<any>;
  private fileUploadData$: Observable<any>;
  private fileUploadDataFailed$: Observable<any>;
  private savedConfigurationGroup$: Observable<ConfigurationGroup>;
  public isModalOpen$: Observable<boolean>;
  public isProcessingMapping$: Observable<boolean>;
  private gettingColumnNames$: Observable<boolean>;
  emailRecipients$: Observable<EmailRecipientModel[]>;
  emailRecipientsSavingError$: Observable<boolean>;
  emailRecipientsRemovingError$: Observable<boolean>;
  emailRecipientsModalOpen$: Observable<boolean>;

  userContext$: Observable<UserContext>;
  loaderSettings$: Observable<LoaderSetting[]>;

  public selectedMapping: ConfigurationGroup;
  public mappingOptions: ConfigurationGroup[] = [];
  // because the company selector is inside of a switch
  // the init will not fire which triggers the api call unless
  // we have rendered our index.
  stepIndex: OrgUploadStep = OrgUploadStep.Company;
  stepEnum = OrgUploadStep;
  companies: CompanySelectorItem[];
  public selectedCompany: CompanySelectorItem = null;
  env = environment;
  organizationalDataTemplateLink: string;
  selectedDelimiter = this.defaultDelimiter;
  userContext: UserContext;
  loaderSetting: ILoadSettings;
  loaderConfigGroup: ConfigurationGroup;
  isValidateOnly: boolean;
  emailRecipients: EmailRecipientModel[] = [];
  loadType = LoadTypes.Manual;
  primaryCompositeDataLoadType = CompositeDataLoadTypes.OrgData;

  existingLoaderSettings: LoaderSetting[];
  private configGroupSeed: ConfigurationGroup = {
    LoaderConfigurationGroupId: -1,
    GroupName: 'Add New Mapping',
    CompanyId: -1,
    LoadType: this.loadType,
    PrimaryCompositeDataLoadType: this.primaryCompositeDataLoadType
  };
  private fileUploadData: FileUploadDataModel;
  StepHeaders: string[] = [
    'Select a company:',
    'Select which organizational data entity you would like to load data for:',
    'Select and upload files:'
  ];

  NextBtnToolTips: string[] = [
    'You must choose a company',
    'Please select at least one entity to load data for.',
    'Please choose a file for each entity type and select a delimiter',
    'Please fully map each field and select the date format if applicable'
  ];
  private paymarketMappingComplete: boolean;
  private isPaymarketsLoadEnabled: boolean;
  private jobMappingComplete: boolean;
  private isJobsLoadEnabled: boolean;
  private structureMappingComplete: boolean;
  private isStructuresLoadEnabled: boolean;
  private isSubsidiaryLoadEnabled: boolean;
  private isSubsidiaryMappingComplete: boolean;
  private structureMappingMappingComplete: boolean;
  private isStructureMappingsLoadEnabled: boolean;
  private employeeMappingComplete: boolean;
  private isEmployeesLoadEnabled: boolean;
  mappings: MappingModel[];
  private isStructureMappingsFullReplace: boolean;
  private dateFormat: string;
  private isEmployeesFullReplace: boolean;
  private isActive: boolean;
  private isCompanyOnAutoloader: boolean;
  private loaderSaveCoordination: LoaderSaveCoordination;
  showFieldMapperTooltip = false;

  notification: { success: AppNotification<NotificationPayload>, error: AppNotification<NotificationPayload> };
  private gettingColumnNames: boolean;
  private createdConfigurationGroup$: Observable<ConfigurationGroup>;
  private companySettings$: Observable<CompanySetting[]>;
  companySettings: CompanySetting[];
  hideAccess: boolean;
  spinnerType: string;
  loadingProgress: LoadingProgressBarModel = {
    interval: 10,
    intervalValue: 10,
    animated: true,
    progressive: false,
    title: 'Uploading Files...'
  };

  constructor(private mainStore: Store<fromDataManagementMainReducer.State>,
    private notificationStore: Store<fromAppNotificationsMainReducer.State>,
    private cdr: ChangeDetectorRef) {

    this.loadOptions = getEntityChoicesForOrgLoader();
    this.AddAndSetSelectedMapping(this.configGroupSeed);

    this.userContext$ = this.mainStore.select(fromRootState.getUserContext);
    this.companies$ = this.mainStore.select(fromCompanyReducer.getCompanies);
    this.selectedCompany$ = this.mainStore.select(fromCompanyReducer.getSelectedCompany);
    this.organizationalDataTemplateLink$ = this.mainStore.select(fromDataManagementMainReducer.getOrganizationalHeadersLink);
    this.isModalOpen$ = this.mainStore.select(fromDataManagementMainReducer.getModalStateOpen);
    this.loaderSettings$ = this.mainStore.select(fromDataManagementMainReducer.getLoaderSettings);
    this.configGroups$ = this.mainStore.select(fromDataManagementMainReducer.getConfigurationGroups);
    this.customJobFields$ = this.mainStore.select(fromDataManagementMainReducer.getCustomJobField);
    this.customEmployeeFields$ = this.mainStore.select(fromDataManagementMainReducer.getCustomEmployeeField);
    this.fileUploadData$ = this.mainStore.select(fromDataManagementMainReducer.fileUploadData);
    this.fileUploadDataFailed$ = this.mainStore.select(fromDataManagementMainReducer.fileUploadDataFailed);
    this.isProcessingMapping$ = this.mainStore.select(fromDataManagementMainReducer.isProcessingMapping);
    this.savedConfigurationGroup$ = this.mainStore.select(fromDataManagementMainReducer.getSavedConfigurationGroup);
    this.gettingColumnNames$ = this.mainStore.select(fromFileUploadReducer.getGettingColumnNames);
    this.emailRecipients$ = this.mainStore.select(fromDataManagementMainReducer.getEmailRecipients);
    this.emailRecipientsSavingError$ = this.mainStore.select(fromDataManagementMainReducer.getSavingRecipientError);
    this.emailRecipientsRemovingError$ = this.mainStore.select(fromDataManagementMainReducer.getRemovingRecipientError);
    this.emailRecipientsModalOpen$ = this.mainStore.select(fromDataManagementMainReducer.getEmailRecipientsModalOpen);
    this.createdConfigurationGroup$ = this.mainStore.select(fromDataManagementMainReducer.getCreatedConfigurationGroup);
    this.companySettings$ = this.mainStore.select(fromRootState.getCompanySettings);

    this.selectedCompany$.pipe(
      takeUntil(this.unsubscribe$)
    ).subscribe(f => {
      this.selectedCompany = f;
      this.clearSelections();
      if (f) {
        this.mainStore.dispatch(new fromOrganizationalDataActions.GetConfigGroups(f.CompanyId, this.loadType, this.primaryCompositeDataLoadType));
        this.getPayfactorCustomFields(f.CompanyId);
      }
    });

    this.emailRecipients$.pipe(
      takeUntil(this.unsubscribe$)
    ).subscribe(recipients => {
      this.emailRecipients = recipients;
    });

    this.gettingColumnNames$.pipe(
      takeUntil(this.unsubscribe$)
    ).subscribe(f => {
      this.gettingColumnNames = f;
    });

    this.loaderSettings$.pipe(
      filter(uc => !!uc && uc.length > 0),
      takeUntil(this.unsubscribe$)
    ).subscribe(f => {
      const resp = OrgDataLoadHelper.parseSettingResponse(f);
      this.existingLoaderSettings = f;
      this.loaderSetting = resp;

      this.isActive = resp.isActive;
      this.isCompanyOnAutoloader = resp.isCompanyOnAutoloader;

      this.selectedDelimiter = resp.delimiter;
      this.dateFormat = resp.dateFormat;
      this.isEmployeesLoadEnabled = resp.isEmployeesLoadEnabled;
      this.isJobsLoadEnabled = resp.isJobsLoadEnabled;
      this.isPaymarketsLoadEnabled = resp.isPaymarketsLoadEnabled;
      this.isStructuresLoadEnabled = resp.isStructuresLoadEnabled;
      this.isSubsidiaryLoadEnabled = resp.isSubsidiaryLoadEnabled;
      this.isStructureMappingsLoadEnabled = resp.isStructureMappingsLoadEnabled;
      this.isEmployeesFullReplace = resp.isEmployeesFullReplace;
      this.isStructureMappingsFullReplace = resp.isStructureMappingsFullReplace;
      this.isValidateOnly = resp.validateOnly;

      this.getEntityChoice(LoaderType.Employees).dateFormat = resp.dateFormat;
      this.getEntityChoice(LoaderType.Employees).isFullReplace = resp.isEmployeesFullReplace;
      this.getEntityChoice(LoaderType.StructureMapping).isFullReplace = resp.isStructureMappingsFullReplace;

    });


    const organizationalDataTemplateSubscription = this.organizationalDataTemplateLink$.pipe(
      filter(uc => !!uc),
      take(1),
      takeUntil(this.unsubscribe$)).subscribe(f => this.organizationalDataTemplateLink = f);

    this.configGroups$.pipe(
      filter(configGroups => !!configGroups && !!this.selectedCompany),
      takeUntil(this.unsubscribe$)
    ).subscribe(f => {
      if (f.length > 0) {
        this.getSettings(f[0]);
        this.loaderConfigGroup = f[0];
      }

      this.mainStore.dispatch(new fromEmailRecipientsActions.LoadEmailRecipients({
        companyId: this.selectedCompany.CompanyId,
        loaderType: 'Organizational Data',
        loaderConfigurationGroupId: this.loaderConfigGroup ? this.loaderConfigGroup.LoaderConfigurationGroupId : undefined
      }));
    });

    this.customJobFields$.pipe(
      filter(uc => !!uc),
      takeUntil(this.unsubscribe$)).subscribe(jobs => {
        this.loadOptions.find(l => l.templateReferenceConstants === LoaderType.Jobs).customFields.Jobs = jobs;
      });

    this.customEmployeeFields$.pipe(
      filter(uc => !!uc),
      takeUntil(this.unsubscribe$)).subscribe(employees => {
        this.loadOptions.find(l => l.templateReferenceConstants === LoaderType.Employees).customFields.Employees = employees;
      });

    this.fileUploadData$.pipe(
      filter(uc => !!uc),
      takeUntil(this.unsubscribe$)
    ).subscribe(f => {
      if (f) {
        if (this.isValidateOnly) {
          this.notification.success.Payload.Message = 'Your files will be validated based on the mapping provided.  ' +
            'The results will be emailed and will include all records noting any record that would have been an error.';
        } else {
          this.notification.success.Payload.Message = 'File(s) are being uploaded, you will receive an email when processing is complete.';
        }
        this.setNewStart(this.notification.success);
      }
    });

    this.fileUploadDataFailed$.pipe(
      filter(uc => !!uc),
      takeUntil(this.unsubscribe$)
    ).subscribe(f => {
      if (f) {
        this.setNewStart(this.notification.error);
      }
    });

    this.savedConfigurationGroup$.pipe(
      filter(uc => !!uc),
      takeUntil(this.unsubscribe$)
    ).subscribe(configurationGroup => {
      this.saveSettingsAndMappings(this.getLoaderSettingsToSave(), configurationGroup.LoaderConfigurationGroupId);
      this.uploadFiles(configurationGroup.LoaderConfigurationGroupId);
    });

    this.createdConfigurationGroup$.pipe(
      filter(configurationGroup => !!configurationGroup),
      takeUntil(this.unsubscribe$)
    ).subscribe(configurationGroup => {
      this.AddAndSetSelectedMapping(configurationGroup);
    });

    const companySettingSubscription = this.companySettings$.pipe(
      filter(companySetting => !!companySetting),
      take(1),
      takeUntil(this.unsubscribe$)
    );

    const userSubscription = this.userContext$
      .pipe(
        filter(uc => !!uc),
        take(1),
        takeUntil(this.unsubscribe$)
      );

    const companiesSubscription = this.companies$.pipe(
      filter(uc => !!uc),
      take(1),
      takeUntil(this.unsubscribe$));

    forkJoin({ user: userSubscription, company: companiesSubscription, companySetting: companySettingSubscription })
      .subscribe(f => {
        this.companySettings = f.companySetting;
        this.userContext = f.user;
        this.companies = f.company;
        this.setInitValues();
      });


    this.isActive = true;
    this.mappings = [];
    this.existingLoaderSettings = [];
    this.paymarketMappingComplete = true;
    this.jobMappingComplete = true;
    this.structureMappingComplete = true;
    this.structureMappingMappingComplete = true;
    this.employeeMappingComplete = true;
  }

  private getEntityChoice(loaderType: string) {
    return this.loadOptions.find(entity => entity.templateReferenceConstants === loaderType);
  }

  ngOnInit(): void {
    this.hideAccess = true;
    this.mainStore.dispatch(new fromOrganizationalDataActions.GetOrganizationalHeadersLink());
    this.mainStore.dispatch(new fromCompanySelectorActions.GetCompanies());
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next(true);
  }

  setNewStart(notification) {
    this.notificationStore.dispatch(new fromAppNotificationsActions.AddNotification(notification));
    this.setInitValues();
  }

  setInitValues() {
    if (this.validateAccess()) {
      window.location.href = this.env.companyAdminUrl;
      return;
    }
    this.hideAccess = false;
    this.spinnerType = 'SVG';
    this.notificationMessageInit();
    this.mainStore.dispatch(new fromCompanySelectorActions.SetSelectedCompany(null));
    if (this.userContext.AccessLevel === 'Admin') {
      this.stepIndex = OrgUploadStep.Company;
    } else {
      this.selectedCompany = this.companies.find(f => f.CompanyId === this.userContext.CompanyId);
      this.mainStore.dispatch(new fromCompanySelectorActions.SetSelectedCompany(this.selectedCompany));
      this.stepIndex = OrgUploadStep.Entity;
    }
    // reset any checked loads
    this.loadOptions = getEntityChoicesForOrgLoader();
  }

  validateAccess() {
    if (this.userContext === undefined || this.companySettings === undefined) {
      return true;
    }
    return (this.userContext.AccessLevel !== 'Admin' &&
      this.companySettings.find(cs => cs.Key === CompanySettingsEnum.ManualOrgDataLoadLink).Value !== 'true');
  }

  notificationMessageInit() {
    this.notification = {
      success: {
        NotificationId: '',
        Level: NotificationLevel.Info,
        From: NotificationSource.GenericNotificationMessage,
        Payload: {
          Title: 'Organizational Data Loader',
          Message: '' // This will be populated when the 'Process' button has been clicked. See this.fileUploadData$ subscription
        },
        EnableHtml: true,
        Type: NotificationType.Event
      },
      error: {
        NotificationId: '',
        Level: NotificationLevel.Error,
        From: NotificationSource.GenericNotificationMessage,
        Payload: {
          Title: 'Organizational Data Loader',
          Message: 'Your file upload has failed. Please contact free@payfactors.com'
        },
        EnableHtml: true,
        Type: NotificationType.Event
      }
    };
  }

  getPayfactorCustomFields(companyId) {
    this.mainStore.dispatch(new fromCustomFieldsActions.GetCustomJobFields(companyId));
    this.mainStore.dispatch(new fromCustomFieldsActions.GetCustomEmployeeFields(companyId));
  }

  public AddAndSetSelectedMapping(configGroup: ConfigurationGroup) {
    if (!configGroup) { return; }

    const existing = this.mappingOptions.find(f => f.LoaderConfigurationGroupId === configGroup.LoaderConfigurationGroupId);

    if (!existing) {
      this.mappingOptions.push(configGroup);
      this.selectedMapping = configGroup;
    } else {
      this.selectedMapping = existing;
    }

    if (this.selectedMapping.LoaderConfigurationGroupId <= 0) {
      this.selectedDelimiter = this.defaultDelimiter;
      this.getEntityChoice(LoaderType.Employees).dateFormat = null;
      this.getEntityChoice(LoaderType.Employees).isFullReplace = null;
      this.getEntityChoice(LoaderType.StructureMapping).isFullReplace = null;
    } else {
      if (this.existingLoaderSettings && this.existingLoaderSettings.find(setting => setting.KeyName === LoaderSettingsKeys.Delimiter)) {
        this.selectedDelimiter = this.existingLoaderSettings.find(setting => setting.KeyName === LoaderSettingsKeys.Delimiter).KeyValue;
        const existingDateFormatSetting = this.existingLoaderSettings.find(setting => setting.KeyName === LoaderSettingsKeys.DateFormat);
        const existingIsEmpFullReplaceSetting =
          this.existingLoaderSettings.find(setting => setting.KeyName === LoaderSettingsKeys.IsEmployeesFullReplace);
        const existingIsStructureMappingFullReplaceSetting =
          this.existingLoaderSettings.find(setting => setting.KeyName === LoaderSettingsKeys.IsStructureMappingsFullReplace);

        this.getEntityChoice(LoaderType.Employees).dateFormat = existingDateFormatSetting ? existingDateFormatSetting.KeyValue : null;
        this.getEntityChoice(LoaderType.Employees).isFullReplace = existingIsEmpFullReplaceSetting ? existingIsEmpFullReplaceSetting.KeyValue === 'true' : null;
        this.getEntityChoice(LoaderType.StructureMapping).isFullReplace =
          existingIsStructureMappingFullReplaceSetting ? existingIsStructureMappingFullReplaceSetting.KeyValue === 'true' : null;
      }
    }


  }

  private getSettings(newValue: ConfigurationGroup) {
    this.AddAndSetSelectedMapping(newValue);
    if (this.selectedMapping.LoaderConfigurationGroupId > 0) {
      this.mainStore.dispatch(
        new fromLoaderSettingsActions.LoadingLoaderSettings(this.selectedCompany.CompanyId, this.selectedMapping.LoaderConfigurationGroupId)
      );
    }
  }

  goBack() {

    this.clearSelections();
    if (this.stepIndex === OrgUploadStep.Company) {
      window.location.href = this.env.siteAdminUrl;
      return;
    }

    if (this.stepIndex === OrgUploadStep.Entity && this.userContext.AccessLevel !== 'Admin') {
      window.location.href = this.env.companyAdminUrl;
      return;
    }

    this.stepIndex -= 1;
  }

  onDelimiterChange($event: string) {
    this.selectedDelimiter = $event;
  }

  clearSelections() {

    if (!this.loadOptions) { return; }

    switch (this.stepIndex) {
      case OrgUploadStep.Company:
        this.mappingOptions = [this.configGroupSeed];
        this.selectedMapping = this.configGroupSeed;
        this.selectedDelimiter = this.defaultDelimiter;
        this.loadOptions = getEntityChoicesForOrgLoader();
        break;

      case OrgUploadStep.Entity:
        this.loadOptions.forEach(element => {
          element.isChecked = false;
        });
        break;

      case OrgUploadStep.Files:
        this.loadOptions.forEach(element => {
          element.File = null;
          element.isSelectedTab = false;
        });

        this.uploadComponent.ClearAllFiles();
        this.uploadComponent.ClearAllErrorMessages();

        if (this.loaderConfigGroup) {
          this.selectedMapping = this.mappingOptions.find(f => f.LoaderConfigurationGroupId === this.loaderConfigGroup.LoaderConfigurationGroupId);
        } else {
          this.selectedMapping = this.mappingOptions.find(f => f.LoaderConfigurationGroupId === this.configGroupSeed.LoaderConfigurationGroupId);
        }
        this.selectedDelimiter = this.loaderSetting !== null && this.loaderSetting !== undefined ? this.loaderSetting.delimiter : this.defaultDelimiter;

        break;

      default:
        break;
    }
  }

  hasAtLeastOneChoice(): boolean {
    if (this.loadOptions.find(f => f.isChecked)) {
      return true;
    }
    return false;
  }

  hasUploadedFiles(): boolean {
    if (!this.loadOptions.find(f => f.isChecked && f.File === null)) {
      return true;
    }
    return false;
  }

  getNextBtnOpacity(): number {
    if (!this.areStepsValid()) {
      return .65;
    }
    return 1;
  }

  areStepsValid(): boolean {
    if (this.stepIndex === OrgUploadStep.Company && (this.selectedCompany && this.selectedCompany !== null)) {
      return true;
    }

    if (this.stepIndex === OrgUploadStep.Entity && this.hasAtLeastOneChoice()) {
      return true;
    }

    if (this.stepIndex === OrgUploadStep.Files && this.hasUploadedFiles() && this.selectedDelimiter && this.selectedDelimiter.length > 0
      && !this.gettingColumnNames) {
      return true;
    }

    if (this.stepIndex === OrgUploadStep.FieldMapping && !this.showFieldMapperTooltip && !(this.emailRecipients.length <= 0)) {
      return true;
    }

    return false;
  }

  nextBtnClick() {
    if (this.areStepsValid()) {
      if (this.stepIndex !== OrgUploadStep.FieldMapping) {
        this.stepIndex += 1;
      }

      if (this.stepIndex === OrgUploadStep.Files) {
        this.tooltip.open();
      }
    }
  }

  public orgDataExportAction() {
    if (this.tooltip) {
      this.tooltip.close();
    }

    if (this.selectedCompany) {
      this.mainStore.dispatch(new fromOrganizationalDataActions.PublishDownloadOrgDataMessage(this.selectedCompany.CompanyId));
    }
  }

  goToLink(event, url: string) {
    if (url && url.length > 0) {
      window.open(url, '_blank');
    } else {
      this.setModalOpen(true);
    }
    event.preventDefault();
  }

  public setModalOpen(isOpen: boolean) {
    this.mainStore.dispatch(new fromOrganizationalDataActions.SetModalStateOpen(isOpen));
  }


  processBtnClick() {
    if (this.showFieldMapperTooltip) {
      return;
    }

    if (this.emailRecipients.length <= 0) {
      return;
    }
    const loaderSettingsToSave = this.getLoaderSettingsToSave();
    const savedConfigurationGroups = this.mappingOptions.filter(mapping => mapping.LoaderConfigurationGroupId > 0);
    this.loaderSaveCoordination = {
      mappingsSaveComplete: false,
      mappingsSaved: this.mappings.length > 0,
      settingsSaveComplete: false,
      settingsSaved: loaderSettingsToSave.length > 0,
    };

    if (savedConfigurationGroups && savedConfigurationGroups.length > 0) {
      if (this.selectedMapping.LoaderConfigurationGroupId <= 0) {
        this.selectedMapping = this.mappingOptions.find(mapping => mapping.LoaderConfigurationGroupId > 0);
      }
      this.saveSettingsAndMappings(loaderSettingsToSave, this.selectedMapping.LoaderConfigurationGroupId);
      this.uploadFiles(this.selectedMapping.LoaderConfigurationGroupId);
    } else {
      const newConfigGroup: ConfigurationGroup = {
        CompanyId: this.selectedCompany.CompanyId,
        GroupName: 'Saved Manual Mappings',
        LoaderConfigurationGroupId: null,
        LoadType: this.loadType,
        PrimaryCompositeDataLoadType: this.primaryCompositeDataLoadType
      };
      this.mainStore.dispatch(new fromOrganizationalDataActions.SaveConfigGroup(newConfigGroup));
    }
  }

  private uploadFiles(loaderConfigurationGroupId: number) {
    this.spinnerType = 'PROGRESS';
    const files: File[] = [];
    let filesDataRequest: FileUploadDataRequestModel;
    this.loadOptions.forEach((l) => {
      if (l.isChecked) {
        files.push(l.File);
      }
    });

    filesDataRequest = { loaderConfigurationGroupId: loaderConfigurationGroupId, files: files };
    this.fileUploadData = { companyId: this.selectedCompany.CompanyId, userContext: this.userContext, fileUpload: filesDataRequest };
    this.mainStore.dispatch(new fromOrganizationalDataActions.UploadData(this.fileUploadData));
  }

  onMappingComplete($event: LoaderEntityStatus) {
    this.showFieldMapperTooltip = false;

    switch ($event.loaderType) {
      case LoaderType.PayMarkets:
        this.onPaymarketMappingComplete($event);
        break;
      case LoaderType.Jobs:
        this.onJobMappingComplete($event);
        break;
      case LoaderType.Structures:
        this.onStructureMappingComplete($event);
        break;
      case LoaderType.StructureMapping:
        this.onStructureMappingMappingComplete($event);
        break;
      case LoaderType.Employees:
        this.onEmployeeMappingComplete($event);
        break;
    }

    if (!this.paymarketMappingComplete || !this.jobMappingComplete || !this.structureMappingComplete ||
      !this.structureMappingMappingComplete || !this.employeeMappingComplete) {
      this.showFieldMapperTooltip = true;
    }

    this.cdr.detectChanges();
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

  onSubsidiaryMappingComplete($event: LoaderEntityStatus) {
    this.isSubsidiaryMappingComplete = $event.complete;
    this.isSubsidiaryLoadEnabled = $event.loadEnabled;
    if (this.isSubsidiaryMappingComplete) {
      this.addOrReplaceMappings('Subsidiary', $event.mappings);
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

  private addOrReplaceMappings(loaderType: string, mappings: string[]) {
    const mappingsModel: MappingModel = {
      LoaderType: loaderType,
      Mappings: mappings
    };

    this.mappings = this.mappings.filter(mapping => mapping.LoaderType !== loaderType);
    this.mappings.push(mappingsModel);
  }

  private saveSettingsAndMappings(loaderSettingsToSave, loaderConfigurationGroup) {
    if (this.loaderSaveCoordination.settingsSaved) {
      this.mainStore.dispatch(new fromLoaderSettingsActions.SavingLoaderSettings({
        companyId: this.selectedCompany.CompanyId,
        settings: loaderSettingsToSave,
        loaderConfigurationGroupId: loaderConfigurationGroup
      }));
    }

    if (this.loaderSaveCoordination.mappingsSaved) {
      this.mainStore.dispatch(new fromOrgDataFieldMappingsActions.SavingFieldMappings({
        companyId: this.selectedCompany.CompanyId,
        mappings: this.mappings,
        loaderConfigurationGroupId: loaderConfigurationGroup
      }));
    }
  }

  private getLoaderSettingsToSave() {
    const newLoaderSettings = new LoaderSettings();

    newLoaderSettings.isActive = this.isActive;
    newLoaderSettings.isCompanyOnAutoloader = this.isCompanyOnAutoloader;
    newLoaderSettings.delimiter = this.selectedDelimiter;
    newLoaderSettings.dateFormat = this.dateFormat;
    newLoaderSettings.isEmployeesLoadEnabled = this.isEmployeesLoadEnabled;
    newLoaderSettings.isJobsLoadEnabled = this.isJobsLoadEnabled;
    newLoaderSettings.isPaymarketsLoadEnabled = this.isPaymarketsLoadEnabled;
    newLoaderSettings.isStructuresLoadEnabled = this.isStructuresLoadEnabled;
    newLoaderSettings.isSubsidiaryLoadEnabled = this.isSubsidiaryLoadEnabled;
    newLoaderSettings.isStructureMappingsLoadEnabled = this.isStructureMappingsLoadEnabled;
    newLoaderSettings.isEmployeesFullReplace = this.isEmployeesFullReplace;
    newLoaderSettings.isStructureMappingsFullReplace = this.isStructureMappingsFullReplace;
    newLoaderSettings.fileFormat = LoaderFileFormat.CSV;
    newLoaderSettings.validateOnly = this.isValidateOnly;

    return OrgDataLoadHelper.getLoaderSettingsToSave(newLoaderSettings, this.existingLoaderSettings);
  }

  openEmailRecipientsModal() {
    this.mainStore.dispatch(new fromEmailRecipientsActions.OpenEmailRecipientsModal());
  }

  disabledClear() {
    return this.loadOptions.filter(l => l.isLoadingFinish === false).length > 0;
  }

  getFieldMapperTooltip() {
    if (this.emailRecipients.length <= 0) {
      return 'Please enter an email recipient to receive the results of this load.';
    }

    return this.showFieldMapperTooltip ? this.NextBtnToolTips[this.stepIndex - 1] : '';
  }
}
