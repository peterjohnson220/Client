import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';

import { KeyValue } from '@angular/common';

import { Store } from '@ngrx/store';
import { forkJoin, Observable, Subject } from 'rxjs';
import { filter, take, takeUntil } from 'rxjs/operators';

import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';

import { environment } from 'environments/environment';
import { CompositeDataLoadTypes, LoadTypes } from 'libs/constants';
import { FeatureFlags, RealTimeFlag } from 'libs/core';
import { AbstractFeatureFlagService } from 'libs/core/services/feature-flags';
import * as fromAppNotificationsActions from 'libs/features/app-notifications/actions/app-notifications.actions';
import {
  AppNotification,
  NotificationLevel,
  NotificationPayload,
  NotificationSource,
  NotificationType
} from 'libs/features/app-notifications/models';
import * as fromAppNotificationsMainReducer from 'libs/features/app-notifications/reducers';
import * as fromCompanySelectorActions from 'libs/features/company/company-selector/actions';
import { CompanySelectorItem } from 'libs/features/company/company-selector/models';
import * as fromCompanyReducer from 'libs/features/company/company-selector/reducers';
import * as fromCustomFieldsActions from 'libs/features/company/custom-fields/actions/';
import * as fromEntityIdentifierActions from 'libs/features/company/entity-identifier/actions/';
import * as fromEmailRecipientsActions from 'libs/features/loader-email-reipients/state/actions/email-recipients.actions';
import {
    DEFAULT_DATE_FORMAT, LoaderFileFormat, LoaderSettingsKeys, LoaderType, ORG_DATA_PF_EMPLOYEE_TAG_FIELDS
} from 'libs/features/org-data-loader/constants';
import { LoaderSettings, OrgDataLoadHelper } from 'libs/features/org-data-loader/helpers';
import { ILoadSettings } from 'libs/features/org-data-loader/helpers/org-data-load-helper';
import { FieldMapping, FileUploadDataRequestModel, LoaderEntityStatus } from 'libs/features/org-data-loader/models';
import * as fromLoaderSettingsActions from 'libs/features/org-data-loader/state/actions/loader-settings.actions';
import * as fromFileUploadReducer from 'libs/features/org-data-loader/state/reducers';
import { CompanySetting, CompanySettingsEnum } from 'libs/models/company';
import { ConfigurationGroup, EmailRecipientModel, LoaderSaveCoordination, LoaderSetting, MappingModel } from 'libs/models/data-loads';
import { UserContext } from 'libs/models/security';
import * as fromRootState from 'libs/state/state';
import { LoadingProgressBarModel } from 'libs/ui/common/loading/models';
import { EntityKeyValidationService } from 'libs/core/services';
import { EntityIdentifierViewModel } from 'libs/features/company/entity-identifier/models';

import * as fromDataManagementMainReducer from '../../../reducers';
import * as fromOrganizationalDataActions from '../../../actions/organizational-data-page.action';
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

  loadOptions: EntityChoice[] = [];
  userMappings: KeyValue<number, string>[];

  benefitsLoaderFeatureFlag: RealTimeFlag = { key: FeatureFlags.BenefitsLoaderConfiguration, value: false };
  empTagsLoaderFeatureFlag: RealTimeFlag = { key: FeatureFlags.EmployeeTagsLoaderConfiguration, value: false };
  private totalTypesToLoad = 0;
  private unsubscribe$ = new Subject<void>();
  private companies$: Observable<CompanySelectorItem[]>;
  private selectedCompany$: Observable<CompanySelectorItem>;
  private companyHasBenefits$: Observable<boolean>;
  private organizationalDataTemplateLink$: Observable<string>;
  private configGroups$: Observable<ConfigurationGroup[]>;
  private customJobFields$: Observable<any>;
  private customEmployeeFields$: Observable<any>;
  private employeeIdentifiers$: Observable<any>;

  private empoyeeTagCategories$: Observable<any>;
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
    'Please choose a file for each entity type and select a delimiter and date format (if applicable)',
    'Please fully map each field and select the date format if applicable'
  ];

  private isPaymarketsLoadEnabled: boolean;
  private isJobsLoadEnabled: boolean;
  private isStructuresLoadEnabled: boolean;
  private isSubsidiariesLoadEnabled: boolean;
  private isBenefitsLoadEnabled: boolean;
  private isStructureMappingsLoadEnabled: boolean;
  private isEmployeesLoadEnabled: boolean;
  private isEmployeeTagsLoadEnabled: boolean;
  mappings: MappingModel[];
  private isStructureMappingsFullReplace: boolean;
  dateFormat: string = DEFAULT_DATE_FORMAT;
  private isEmployeesFullReplace: boolean;
  private isEmployeeTagsFullReplace: boolean;
  private isBenefitsFullReplace: boolean;
  private isActive: boolean;
  private isCompanyOnAutoloader: boolean;
  private loaderSaveCoordination: LoaderSaveCoordination;
  configGroupId = undefined;
  showFieldMapperTooltip = false;

  private completedMappings = [];
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

  private entityKeyValidationMessage: string;
  employeeEntityKeys: EntityIdentifierViewModel[];
  constructor(private mainStore: Store<fromDataManagementMainReducer.State>,
    private notificationStore: Store<fromAppNotificationsMainReducer.State>,
    private cdr: ChangeDetectorRef,
    private featureFlagService: AbstractFeatureFlagService,
    private entityKeyValidatorService: EntityKeyValidationService) {

    this.userContext$ = this.mainStore.select(fromRootState.getUserContext);
    this.companies$ = this.mainStore.select(fromCompanyReducer.getCompanies);
    this.selectedCompany$ = this.mainStore.select(fromCompanyReducer.getSelectedCompany);
    this.organizationalDataTemplateLink$ = this.mainStore.select(fromDataManagementMainReducer.getOrganizationalHeadersLink);
    this.isModalOpen$ = this.mainStore.select(fromDataManagementMainReducer.getModalStateOpen);
    this.loaderSettings$ = this.mainStore.select(fromDataManagementMainReducer.getLoaderSettings);
    this.configGroups$ = this.mainStore.select(fromDataManagementMainReducer.getConfigurationGroups);
    this.customJobFields$ = this.mainStore.select(fromDataManagementMainReducer.getCustomJobField);
    this.customEmployeeFields$ = this.mainStore.select(fromDataManagementMainReducer.getCustomEmployeeField);
    this.empoyeeTagCategories$ = this.mainStore.select(fromDataManagementMainReducer.getTagCategories);
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
    this.companyHasBenefits$ = this.mainStore.select(fromCompanyReducer.companyHasBenefits);
    this.employeeIdentifiers$ = this.mainStore.select(fromDataManagementMainReducer.getEmployeeIdentifiers);

    this.featureFlagService.bindEnabled(this.benefitsLoaderFeatureFlag, this.unsubscribe$);
    this.featureFlagService.bindEnabled(this.empTagsLoaderFeatureFlag, this.unsubscribe$);


    this.selectedCompany$.pipe(
      takeUntil(this.unsubscribe$)
    ).subscribe(f => {
      this.selectedCompany = f;
      this.clearSelections();
      if (f) {

        this.mainStore.dispatch(new fromCompanySelectorActions.CompanyHasBenefits());
        this.mainStore.dispatch(new fromOrganizationalDataActions.GetConfigGroups(f.CompanyId, this.loadType, this.primaryCompositeDataLoadType));

        // reset any checked loads
        this.getPayfactorCustomFields(this.selectedCompany.CompanyId);
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
      this.isEmployeesLoadEnabled = resp.isEmployeesLoadEnabled;
      this.isEmployeeTagsLoadEnabled = resp.isEmployeeTagsLoadEnabled;
      this.isJobsLoadEnabled = resp.isJobsLoadEnabled;
      this.isPaymarketsLoadEnabled = resp.isPaymarketsLoadEnabled;
      this.isStructuresLoadEnabled = resp.isStructuresLoadEnabled;
      this.isSubsidiariesLoadEnabled = resp.isSubsidiariesLoadEnabled;
      this.isBenefitsLoadEnabled = resp.isBenefitsLoadEnabled;
      this.isStructureMappingsLoadEnabled = resp.isStructureMappingsLoadEnabled;
      this.isEmployeesFullReplace = resp.isEmployeesFullReplace;
      this.isStructureMappingsFullReplace = resp.isStructureMappingsFullReplace;
      this.isValidateOnly = resp.validateOnly;

      this.dateFormat = resp.dateFormat;
      this.getEntityChoice(LoaderType.Employees).isFullReplace = resp.isEmployeesFullReplace;
      this.getEntityChoice(LoaderType.StructureMapping).isFullReplace = resp.isStructureMappingsFullReplace;

      // benefitsIsFullReplace setting might not exist and the existing parseSettingResponse method has defaults applicable to autoloader config
      // we need a different default for benefitsIsFullReplace here.
      const responseBenefitSetting =
        f.find(setting => setting.KeyName === LoaderSettingsKeys.IsBenefitsFullReplace);
      let fullReplace = responseBenefitSetting ? responseBenefitSetting.KeyValue === 'true' : false;
      this.getEntityChoice(LoaderType.Benefits).isFullReplace = fullReplace;
      this.isBenefitsFullReplace = fullReplace;

      // same for employeeTags
      const responseEmpTagsSetting =
        f.find(setting => setting.KeyName === LoaderSettingsKeys.IsEmployeeTagsFullReplace);
      fullReplace = responseEmpTagsSetting ? responseEmpTagsSetting.KeyValue === 'true' : false;
      this.getEntityChoice(LoaderType.EmployeeTags).isFullReplace = fullReplace;
      this.isBenefitsFullReplace = fullReplace;
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
        this.AddAndSetSelectedConfig(f[0]);
        this.mainStore.dispatch(
          new fromLoaderSettingsActions.LoadingLoaderSettings(this.selectedCompany.CompanyId, this.selectedMapping.LoaderConfigurationGroupId)
        );
        this.configGroupId = f[0].LoaderConfigurationGroupId;
      } else {
        this.AddAndSetSelectedConfig(this.configGroupSeed);
        this.SetDefaultValuesForNullConfig();
      }

      this.mainStore.dispatch(new fromEmailRecipientsActions.LoadEmailRecipients({
        companyId: this.selectedCompany.CompanyId,
        loaderType: 'Organizational Data',
        loaderConfigurationGroupId: this.configGroupId
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
        this.mainStore.dispatch(new fromEntityIdentifierActions.GetEmployeeIdentifiers(this.selectedCompany.CompanyId, employees));
      });

    this.empoyeeTagCategories$.pipe(
      filter(uc => !!uc),
      takeUntil(this.unsubscribe$)).subscribe(employeetags => {

        const empTags = this.loadOptions.find(l => l.templateReferenceConstants === LoaderType.EmployeeTags).customFields.EmployeeTags;
        this.loadOptions.find(l => l.templateReferenceConstants === LoaderType.EmployeeTags).customFields.EmployeeTags = empTags.concat(employeetags);
      });

    this.employeeIdentifiers$.pipe(
      filter(uc => !!uc),
      takeUntil(this.unsubscribe$)
    ).subscribe(r => {
      const selected = r.filter(a => a.isChecked);
      this.employeeEntityKeys = selected;
      const selectedWithoutEmployeeId = selected.filter( a => a.Field !== 'Employee_ID');

      if (selectedWithoutEmployeeId?.length >= 0) {
        const empTags = this.loadOptions.find(l => l.templateReferenceConstants === LoaderType.EmployeeTags).customFields.EmployeeTags;
        this.loadOptions.find(l => l.templateReferenceConstants === LoaderType.EmployeeTags)
          .customFields.EmployeeTags = empTags.concat(selectedWithoutEmployeeId.map(a => a.Field));
      }
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
      this.AddAndSetSelectedConfig(configurationGroup);
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

    this.companyHasBenefits$
      .pipe(
        filter(f => f !== null),
        takeUntil(this.unsubscribe$)
      ).subscribe(f => {
        const benefitsLoaderFeatureFlagEnabled = this.featureFlagService.enabled(FeatureFlags.BenefitsLoaderConfiguration, false);

        this.loadOptions.find(a => a.dbName === 'Benefits').isEnabled = f && benefitsLoaderFeatureFlagEnabled;
      });

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

    // mark all complete until something changes
    for (const item in LoaderType) {
      if (isNaN(Number(item))) {
        this.completedMappings.push(item);
      }
    }

    this.totalTypesToLoad = this.completedMappings.length;
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
    this.unsubscribe$.next();
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

    this.loadOptions.find(l => l.templateReferenceConstants === LoaderType.EmployeeTags).customFields.EmployeeTags = ORG_DATA_PF_EMPLOYEE_TAG_FIELDS;

    this.mainStore.dispatch(new fromCustomFieldsActions.GetCustomJobFields(companyId));
    this.mainStore.dispatch(new fromCustomFieldsActions.GetCustomEmployeeFields(companyId));
    this.mainStore.dispatch(new fromCustomFieldsActions.GetTagCategories(companyId));
  }

  private SetDefaultValuesForNullConfig() {
    this.selectedDelimiter = this.defaultDelimiter;
    this.dateFormat = DEFAULT_DATE_FORMAT;
    this.getEntityChoice(LoaderType.Employees).isFullReplace = false;
    this.getEntityChoice(LoaderType.StructureMapping).isFullReplace = false;
    this.getEntityChoice(LoaderType.Benefits).isFullReplace = false;
    this.getEntityChoice(LoaderType.EmployeeTags).isFullReplace = false;

    this.selectedMapping = this.mappingOptions.find(f => f.LoaderConfigurationGroupId === this.configGroupSeed.LoaderConfigurationGroupId);

  }

  public AddAndSetSelectedConfig(configGroup: ConfigurationGroup) {
    if (!configGroup) { return; }

    const existing = this.mappingOptions.find(f => f.LoaderConfigurationGroupId === configGroup.LoaderConfigurationGroupId);

    if (!existing) {
      this.mappingOptions.push(configGroup);
      this.selectedMapping = configGroup;
    } else {
      this.selectedMapping = existing;
    }
  }


  selectedConfigChange($event: ConfigurationGroup) {

    if ($event.LoaderConfigurationGroupId <= 0) {
      this.SetDefaultValuesForNullConfig();
    } else {
      this.selectedDelimiter = this.existingLoaderSettings.find(setting => setting.KeyName === LoaderSettingsKeys.Delimiter).KeyValue;
      const existingDateFormatSetting = this.existingLoaderSettings.find(setting => setting.KeyName === LoaderSettingsKeys.DateFormat);
      const existingIsEmpFullReplaceSetting =
        this.existingLoaderSettings.find(setting => setting.KeyName === LoaderSettingsKeys.IsEmployeesFullReplace);
      const existingIsEmpTagsFullReplaceSetting =
        this.existingLoaderSettings.find(setting => setting.KeyName === LoaderSettingsKeys.IsEmployeeTagsFullReplace);
      const existingIsStructureMappingFullReplaceSetting =
        this.existingLoaderSettings.find(setting => setting.KeyName === LoaderSettingsKeys.IsStructureMappingsFullReplace);
      const existingIsBenefitFullReplaceSetting =
        this.existingLoaderSettings.find(setting => setting.KeyName === LoaderSettingsKeys.IsBenefitsFullReplace);
      this.dateFormat = existingDateFormatSetting ? existingDateFormatSetting.KeyValue : DEFAULT_DATE_FORMAT;
      this.getEntityChoice(LoaderType.Employees).isFullReplace = existingIsEmpFullReplaceSetting ? existingIsEmpFullReplaceSetting.KeyValue === 'true' : null;
      this.getEntityChoice(LoaderType.Benefits).isFullReplace =
        existingIsBenefitFullReplaceSetting ? existingIsBenefitFullReplaceSetting.KeyValue === 'true' : false;
      this.getEntityChoice(LoaderType.EmployeeTags).isFullReplace =
        existingIsEmpTagsFullReplaceSetting ? existingIsEmpTagsFullReplaceSetting.KeyValue === 'true' : false;
      this.getEntityChoice(LoaderType.StructureMapping).isFullReplace =
        existingIsStructureMappingFullReplaceSetting ? existingIsStructureMappingFullReplaceSetting.KeyValue === 'true' : null;
      this.getEntityChoice(LoaderType.StructureMapping).isFullReplace =
        existingIsStructureMappingFullReplaceSetting ? existingIsStructureMappingFullReplaceSetting.KeyValue === 'true' : null;

      this.selectedMapping = this.mappingOptions.find(f => f.LoaderConfigurationGroupId === this.configGroupId);
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

  onDateChange($event: string) {
    this.dateFormat = $event;
  }

  clearSelections() {

    if (!this.loadOptions) { return; }

    if (this.stepIndex === 1) {
      this.mappingOptions = [this.configGroupSeed];
      this.selectedMapping = this.configGroupSeed;
      this.selectedDelimiter = this.defaultDelimiter;
      this.loadOptions = getEntityChoicesForOrgLoader();
      const empTagsFeatureFlagEnabled = this.featureFlagService.enabled(FeatureFlags.EmployeeTagsLoaderConfiguration, false);
      this.loadOptions.find(a => a.dbName === 'EmployeeTags').isEnabled = empTagsFeatureFlagEnabled;
    }

    if (this.stepIndex <= 2) {
      this.loadOptions.forEach(element => {
        element.isChecked = false;
      });
    }

    if (this.stepIndex <= 3) {

      this.loadOptions.forEach(element => {
        element.File = null;
        element.isSelectedTab = false;
      });

      if (this.uploadComponent) {
        this.uploadComponent.ClearAllFiles();
        this.uploadComponent.ClearAllErrorMessages();
      }

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
      if (this.selectedEntityWithDate() && this.dateFormat == null) {
        return false;
      }
      return true;
    }

    if (this.stepIndex === OrgUploadStep.FieldMapping && !this.showFieldMapperTooltip && !(this.emailRecipients.length <= 0)) {
      return true;
    }

    return false;
  }

  selectedEntityWithDate() {
    return (this.loadOptions.find(f => f.templateReferenceConstants === LoaderType.Employees).isChecked
      || this.loadOptions.find(f => f.templateReferenceConstants === LoaderType.EmployeeTags).isChecked);
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
    this.addOrReplaceMappings($event.loaderType, $event.mappings);
    this.addOrReplaceCompletedEntities($event);

    const isEnabled = $event.loadEnabled;
    switch ($event.loaderType) {
      case LoaderType.PayMarkets:
        this.isPaymarketsLoadEnabled = isEnabled;
        break;
      case LoaderType.Jobs:
        this.isJobsLoadEnabled = isEnabled;
        break;
      case LoaderType.Structures:
        this.isStructuresLoadEnabled = isEnabled;
        break;
      case LoaderType.StructureMapping:
        this.isStructureMappingsLoadEnabled = isEnabled;
        this.isStructureMappingsFullReplace = $event.isFullReplace;
        break;
      case LoaderType.Employees:
        this.isEmployeesLoadEnabled = isEnabled;
        if ($event.dateFormat) {
          this.dateFormat = $event.dateFormat;
        }
        this.isEmployeesFullReplace = $event.isFullReplace;
        break;
      case LoaderType.Subsidiaries:
        this.isSubsidiariesLoadEnabled = isEnabled;
        break;
      case LoaderType.Benefits:
        this.isBenefitsLoadEnabled = isEnabled;
        this.isBenefitsFullReplace = $event.isFullReplace;
        break;
      case LoaderType.EmployeeTags:
        this.isEmployeeTagsLoadEnabled = isEnabled;
        this.isEmployeeTagsFullReplace = $event.isFullReplace;
        if ($event.dateFormat) {
          this.dateFormat = $event.dateFormat;
        }
    }

    const shouldShowToolTip = this.completedMappings.length !== this.totalTypesToLoad;

    if (shouldShowToolTip || !this.mappings || this.mappings.length === 0) {
      this.showFieldMapperTooltip = true;
    }

    this.cdr.detectChanges();
  }

  private addOrReplaceCompletedEntities($event: LoaderEntityStatus) {
    this.completedMappings = this.completedMappings.filter(f => f !== $event.loaderType);
    if ($event.complete) {
      if ([LoaderType.Employees, LoaderType.EmployeeTags].includes($event.loaderType)) {
        const validationResult = this.entityKeyValidatorService.hasCompleteEntityKeyMappings($event.mappings, this.employeeEntityKeys);

        if (validationResult.IsValid) {
          this.completedMappings.push($event.loaderType);
          this.entityKeyValidationMessage = '';
        } else {
          this.entityKeyValidationMessage = validationResult.MissingKeyFieldsMessage;
        }
      } else {
        this.completedMappings.push($event.loaderType);
      }

    }
  }

  private addOrReplaceMappings(loaderType: string, mappings: FieldMapping[]) {

    this.mappings = this.mappings.filter(mapping => mapping.LoaderType !== loaderType);

    if (mappings && mappings.length > 0) {
      const mappingsModel: MappingModel = {
        LoaderType: loaderType,
        Mappings: mappings
      };
      this.mappings.push(mappingsModel);
    }
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
    newLoaderSettings.isEmployeeTagsLoadEnabled = this.isEmployeeTagsLoadEnabled;
    newLoaderSettings.isJobsLoadEnabled = this.isJobsLoadEnabled;
    newLoaderSettings.isPaymarketsLoadEnabled = this.isPaymarketsLoadEnabled;
    newLoaderSettings.isStructuresLoadEnabled = this.isStructuresLoadEnabled;
    newLoaderSettings.isSubsidiariesLoadEnabled = this.isSubsidiariesLoadEnabled;
    newLoaderSettings.isBenefitsLoadEnabled = this.isBenefitsLoadEnabled;
    newLoaderSettings.isStructureMappingsLoadEnabled = this.isStructureMappingsLoadEnabled;
    newLoaderSettings.isEmployeesFullReplace = this.isEmployeesFullReplace;
    newLoaderSettings.isEmployeeTagsFullReplace = this.isEmployeeTagsFullReplace;
    newLoaderSettings.isBenefitsFullReplace = this.isBenefitsFullReplace;
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
    } else if (this.entityKeyValidationMessage?.length > 0) {
      return this.entityKeyValidationMessage;
    } else if (this.showFieldMapperTooltip) {
      return this.NextBtnToolTips[this.stepIndex - 1];
    }

    return '';
  }
}
