import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';

import delay from 'lodash/delay';
import isEmpty from 'lodash/isEmpty';
import isNumber from 'lodash/isNumber';
import isObject from 'lodash/isObject';

import { Store } from '@ngrx/store';
import { forkJoin, Observable, Subject } from 'rxjs';
import { filter, take, takeUntil } from 'rxjs/operators';

import { NotificationRef, NotificationService, NotificationSettings } from '@progress/kendo-angular-notification';

import { environment } from 'environments/environment';
import { LoadTypes } from 'libs/constants';
import { CompositeDataLoadTypes } from 'libs/constants/composite-data-load-types';
import { AbstractFeatureFlagService, FeatureFlags, RealTimeFlag } from 'libs/core/services/feature-flags';
import { CompanySettingsApiService } from 'libs/data/payfactors-api';
import { LoaderFieldMappingsApiService } from 'libs/data/payfactors-api/data-loads/index';
import * as fromCompanySelectorActions from 'libs/features/company/company-selector/actions';
import { CompanySelectorComponent } from 'libs/features/company/company-selector/components';
import { CompanySelectorItem } from 'libs/features/company/company-selector/models';
import * as fromCompanyReducer from 'libs/features/company/company-selector/reducers';
import * as fromCustomFieldsActions from 'libs/features/company/custom-fields/actions/custom-fields.actions';
import * as fromEntityIdentifierActions from 'libs/features/company/entity-identifier/actions/entity-identifier.actions';
import * as fromEmailRecipientsActions from 'libs/features/loader-email-reipients/state/actions/email-recipients.actions';
import { DATE_FORMATS, LoaderFileFormat, ORG_DATA_PF_EMPLOYEE_TAG_FIELDS } from 'libs/features/org-data-loader/constants';
import { LoaderSettings, OrgDataLoadHelper } from 'libs/features/org-data-loader/helpers';
import {
  DateFormatItem,
  FieldMapping,
  InternalField,
  LoaderEntityStatus,
  VisibleLoaderOptionModel
} from 'libs/features/org-data-loader/models';
import * as fromLoaderSettingsActions from 'libs/features/org-data-loader/state/actions/loader-settings.actions';
import { CompanySetting, CompanySettingsEnum } from 'libs/models';
import {
    ConfigurationGroup, EmailRecipientModel, LoaderFieldSet, LoaderSaveCoordination, LoaderSetting, MappingModel
} from 'libs/models/data-loads';
import { OrgDataLoaderConfigurationSaveRequest } from 'libs/models/data-loads/request';
import { ConfigSetting } from 'libs/models/security';
import { SftpUserModel } from 'libs/models/Sftp';
import { ConfigSettingsSelectorFactory } from 'libs/state/app-context/services';

import * as fromOrgDataAutoloaderReducer from '../../reducers';
import * as fromOrgDataFieldMappingsActions from '../../actions/org-data-field-mappings.actions';
import * as fromConfigurationGroupsActions from '../../actions/configuration-groups.actions';
import * as fromOrgDataConfigurationActions from '../../actions/org-data-loader-configuration.actions';
import * as fromSftpUserActions from '../../actions/sftp-user.actions';
import {
    LoaderType, ORG_DATA_PF_BENEFITS_MAPPING_FIELDS, ORG_DATA_PF_EMPLOYEE_FIELDS, ORG_DATA_PF_JOB_FIELDS,
    ORG_DATA_PF_JOB_RANGE_STRUCTURE_FIELDS, ORG_DATA_PF_PAYMARKET_FIELDS, ORG_DATA_PF_STRUCTURE_FIELDS,
    ORG_DATA_PF_STRUCTURE_MAPPING_FIELDS, ORG_DATA_PF_SUBSIDIARIES_MAPPING_FIELDS
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

  benefitsLoaderFeatureFlag: RealTimeFlag = { key: FeatureFlags.BenefitsLoaderConfiguration, value: false };
  employeeTagsLoaderFeatureFlag: RealTimeFlag = { key: FeatureFlags.EmployeeTagsLoaderConfiguration, value: false };

  dateFormats: Array<{ text: string, value: string }> = DATE_FORMATS;
  dateFormatsFilteredData: Array<{ text: string, value: string }>;

  env = environment;
  payfactorsPaymarketDataFields: InternalField[];
  payfactorsJobDataFields: InternalField[];
  payfactorsStructureDataFields: InternalField[];
  payfactorsStructureMappingDataFields: InternalField[];
  payfactorsEmployeeDataFields: InternalField[];
  payfactorsEmployeeTagsDataFields: InternalField[];
  payfactorsSubsidiariesDataFields: InternalField[];
  payfactorsBenefitsDataFields: InternalField[];
  paymarketMappingComplete: boolean;
  jobMappingComplete: boolean;
  subsidiariesMappingComplete: boolean;
  benefitMappingComplete: boolean;
  structureMappingComplete: boolean;
  structureMappingMappingComplete: boolean;
  employeeMappingComplete: boolean;
  employeeTagsMappingComplete: boolean;
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
  isEmployeeTagsLoadEnabled: boolean;
  isJobsLoadEnabled: boolean;
  isPaymarketsLoadEnabled: boolean;
  isStructuresLoadEnabled: boolean;
  isStructureMappingsLoadEnabled: boolean;
  isEmployeesFullReplace: boolean;
  isEmployeeTagsFullReplace: boolean;
  isBenefitsFullReplace: boolean;
  isStructureMappingsFullReplace: boolean;
  isSubsidiariesLoadEnabled: boolean;
  isBenefitsLoadEnabled: boolean;
  loaderSettings$: Observable<LoaderSetting[]>;
  loaderSettingsLoading$: Observable<boolean>;
  employeeIdentifiers$: Observable<any>;
  customEmployeeFields$: Observable<any>;
  customJobsfields$: Observable<any>;
  tagCategories$: Observable<string[]>;
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
  private unsubscribe$ = new Subject<void>();
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
  private selectedCompanySetting$: Observable<CompanySetting[]>;
  public hasBenefitsAccess = false;
  selectedCompanyBenefits$: Observable<boolean>;

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
    private companySettingsApiService: CompanySettingsApiService,
    private cdr: ChangeDetectorRef,
    private featureFlagService: AbstractFeatureFlagService
  ) {
    this.dateFormatsFilteredData = this.dateFormats.slice();
    this.payfactorsPaymarketDataFields = this.buildInternalFields(ORG_DATA_PF_PAYMARKET_FIELDS, false);
    this.payfactorsJobDataFields = this.buildInternalFields(ORG_DATA_PF_JOB_FIELDS, false);
    this.payfactorsStructureDataFields = this.buildInternalFields(ORG_DATA_PF_STRUCTURE_FIELDS, false);
    this.payfactorsStructureMappingDataFields = this.buildInternalFields(ORG_DATA_PF_STRUCTURE_MAPPING_FIELDS, false);
    this.payfactorsEmployeeDataFields = this.buildInternalFields(ORG_DATA_PF_EMPLOYEE_FIELDS, false);
    this.payfactorsEmployeeTagsDataFields = this.buildInternalFields(ORG_DATA_PF_EMPLOYEE_TAG_FIELDS, false);
    this.payfactorsSubsidiariesDataFields = this.buildInternalFields(ORG_DATA_PF_SUBSIDIARIES_MAPPING_FIELDS, false);
    this.payfactorsBenefitsDataFields = this.buildInternalFields(ORG_DATA_PF_BENEFITS_MAPPING_FIELDS, false);

    this.paymarketMappingComplete = true;
    this.jobMappingComplete = true;
    this.subsidiariesMappingComplete = true;
    this.structureMappingComplete = true;
    this.structureMappingMappingComplete = true;
    this.employeeMappingComplete = true;
    this.employeeTagsMappingComplete = true;
    this.benefitMappingComplete = true;

    this.companies$ = this.store.select(fromCompanyReducer.getCompanies);
    this.selectedCompany$ = this.store.select(fromCompanyReducer.getSelectedCompany);
    this.selectedCompanyBenefits$ = this.store.select(fromCompanyReducer.companyHasBenefits);
    this.companyMappings$ = this.store.select(fromOrgDataAutoloaderReducer.getFieldMappings);
    this.companyMappingsLoading$ = this.store.select(fromOrgDataAutoloaderReducer.getLoadingFieldMappings);
    this.employeeIdentifiers$ = this.store.select(fromOrgDataAutoloaderReducer.getEntityIdentifiers);
    this.customJobsfields$ = this.store.select(fromOrgDataAutoloaderReducer.getCustomJobFields);
    this.customEmployeeFields$ = this.store.select(fromOrgDataAutoloaderReducer.getCustomEmployeeFields);
    this.tagCategories$ = this.store.select(fromOrgDataAutoloaderReducer.getTagCategories);
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
    this.isBenefitsFullReplace = true;
    this.isStructureMappingsFullReplace = true;
    this.isSubsidiariesLoadEnabled = false;
    this.isBenefitsLoadEnabled = false;
    this.isEmployeeTagsLoadEnabled = false;
    this.isEmployeeTagsFullReplace = true;
    this.existingCompanyLoaderSettings = [];
    this.visibleLoaderOptions = {
      clientFileName: true,
      selectFile: true
    };

    this.featureFlagService.bindEnabled(this.benefitsLoaderFeatureFlag, this.unsubscribe$);
    this.featureFlagService.bindEnabled(this.employeeTagsLoaderFeatureFlag, this.unsubscribe$);

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
        this.store.dispatch(new fromCompanySelectorActions.CompanyHasBenefits());
        this.companySelector.isDisabled = true;
        this.getSelectedCompanySetting();
        this.CompanySelected();
        this.cdr.detectChanges();
      }
    });

    this.selectedCompanyBenefits$.pipe(
      filter(uc => !!uc),
      takeUntil(this.unsubscribe$)
    ).subscribe(f => {
      this.hasBenefitsAccess = f;
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
        this.isEmployeeTagsFullReplace = resp.isEmployeeTagsFullReplace;
        this.isBenefitsFullReplace = resp.isBenefitsFullReplace;
        this.isStructureMappingsFullReplace = resp.isStructureMappingsFullReplace;
        this.isSubsidiariesLoadEnabled = resp.isSubsidiariesLoadEnabled;
        this.isBenefitsLoadEnabled = resp.isBenefitsLoadEnabled;
        this.isEmployeeTagsLoadEnabled = resp.isEmployeeTagsLoadEnabled;
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

    const employeeIdentifiersSubscription = this.employeeIdentifiers$.pipe(
      filter(x => !!x),
      take(1),
      takeUntil(this.unsubscribe$)
    );

    this.customEmployeeFields$.pipe(
      filter(uc => !!uc),
      takeUntil(this.unsubscribe$)
    ).subscribe(res => {
      const customEmployeeDisplayNames = res.map(udf => udf.Value);
      this.payfactorsEmployeeDataFields.push.apply(this.payfactorsEmployeeDataFields, this.buildInternalFields(customEmployeeDisplayNames, false));

      this.store.dispatch(new fromEntityIdentifierActions.GetEmployeeIdentifiers(this.selectedCompany.CompanyId, res));
    });

    this.customJobsfields$.pipe(
      filter(uc => !!uc),
      takeUntil(this.unsubscribe$)
    ).subscribe(res => {
      const customJobDisplayNames = res.map(udf => udf.Value);
      this.payfactorsJobDataFields.push.apply(this.payfactorsJobDataFields, this.buildInternalFields(customJobDisplayNames, false));
      res.forEach((udf) => {
        this.payfactorsJobDataFields.push(udf.Value);
      });
    });

    const tagCategoriesSubscription = this.tagCategories$.pipe(
      filter(uc => !!uc),
      take(1),
      takeUntil(this.unsubscribe$));

    forkJoin({tagCategories: tagCategoriesSubscription, employeeIdentifiers: employeeIdentifiersSubscription})
      .subscribe(result => {
        const selected = result.employeeIdentifiers.filter(a => a.isChecked);

        if (!selected || selected.length === 0) {
          const empIdField: InternalField = {FieldName: 'Employee_ID', IsDataElementName: false};
          this.payfactorsEmployeeTagsDataFields.push(empIdField);
        } else {
          this.payfactorsEmployeeTagsDataFields.push(...selected.map(a => {
            return {
              FieldName: a.Field,
              IsDataElementName: false
            };
          }));
        }

        this.payfactorsEmployeeTagsDataFields.push(...result.tagCategories.map(tagName => {
          return {
            FieldName: tagName,
            IsDataElementName: true
          };
        }));
      });
  } // end constructor

  ngOnInit() {
    this.store.dispatch(new fromCompanySelectorActions.GetCompanies());
  }
  ngOnDestroy(): void {
    this.unsubscribe$.next();
  }

  selectionChange(dateFormat: DateFormatItem) {
    if (dateFormat) {
      this.dateFormat = dateFormat.value;
    } else {
      this.dateFormat = null;
    }
  }

  filterChange(filter: string) {
    this.dateFormatsFilteredData = this.dateFormats.filter((s) => s.value.indexOf(filter) !== -1);
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

  onSubsidiariesMappingComplete($event: LoaderEntityStatus) {
    this.subsidiariesMappingComplete = $event.complete;
    this.isSubsidiariesLoadEnabled = $event.loadEnabled;
    if (this.subsidiariesMappingComplete) {
      this.addOrReplaceMappings('Subsidiaries', $event.mappings);
    }
  }

  onStructureMappingComplete($event: LoaderEntityStatus) {
    this.structureMappingComplete = $event.complete;
    this.isStructuresLoadEnabled = $event.loadEnabled;
    if (this.structureMappingComplete) {
      this.addOrReplaceMappings('Structures', $event.mappings);
    }
  }

  onBenefitsMappingComplete($event: LoaderEntityStatus) {
    this.benefitMappingComplete = $event.complete;
    this.isBenefitsLoadEnabled = $event.loadEnabled;
    if (this.benefitMappingComplete) {
      this.addOrReplaceMappings('Benefits', $event.mappings);
    }

    this.isBenefitsFullReplace = $event.isFullReplace;
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
    this.isEmployeesFullReplace = $event.isFullReplace;
  }

  onEmployeeTagsMappingComplete($event: LoaderEntityStatus) {
    this.employeeTagsMappingComplete = $event.complete;
    this.isEmployeeTagsLoadEnabled = $event.loadEnabled;
    if (this.employeeTagsMappingComplete) {
      this.addOrReplaceMappings('EmployeeTags', $event.mappings);
    }
    this.isEmployeeTagsFullReplace = $event.isFullReplace;
  }

  private getSelectedCompanySetting() {
    this.selectedCompanySetting$ = this.companySettingsApiService.getCompanySettings(this.selectedCompany.CompanyId);

    this.selectedCompanySetting$.pipe(
      takeUntil(this.unsubscribe$),
      filter(companySetting => !!companySetting)
    ).subscribe(setting => {
      const jobRangeStruct = setting.find(s => s.Key === CompanySettingsEnum.EnableJobRangeStructureRangeTypes);
      if (jobRangeStruct.Value === 'true') {
        const internalJobRangeStructureFields = this.buildInternalFields(ORG_DATA_PF_JOB_RANGE_STRUCTURE_FIELDS, false);
        this.payfactorsStructureDataFields = this.payfactorsStructureDataFields.concat(internalJobRangeStructureFields);
      }
    });
  }

  CompanySelected() {

    this.store.dispatch(new fromCustomFieldsActions.GetCustomEmployeeFields(this.selectedCompany.CompanyId));
    this.store.dispatch(new fromCustomFieldsActions.GetCustomJobFields(this.selectedCompany.CompanyId));
    this.store.dispatch(new fromCustomFieldsActions.GetTagCategories);

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
      this.store.dispatch(new fromOrgDataConfigurationActions.SaveConfiguration({ request: request, publicKey: this.sftpPublicKey }));
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

  private addOrReplaceMappings(loaderType: string, mappings: FieldMapping[]) {
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
    newLoaderSettings.isSubsidiariesLoadEnabled = this.isSubsidiariesLoadEnabled;
    newLoaderSettings.isBenefitsLoadEnabled = this.isBenefitsLoadEnabled;
    newLoaderSettings.isStructureMappingsLoadEnabled = this.isStructureMappingsLoadEnabled;
    newLoaderSettings.isEmployeesFullReplace = this.isEmployeesFullReplace;
    newLoaderSettings.isEmployeeTagsFullReplace = this.isEmployeeTagsFullReplace;
    newLoaderSettings.isEmployeeTagsLoadEnabled = this.isEmployeeTagsLoadEnabled;
    newLoaderSettings.isBenefitsFullReplace = this.isBenefitsFullReplace;
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
    const part1 = (!this.paymarketMappingComplete
      || !this.jobMappingComplete
      || !this.structureMappingComplete
      || !this.structureMappingMappingComplete
      || !this.employeeMappingComplete
      || !this.subsidiariesMappingComplete
      || ((this.hasBenefitsAccess && this.benefitsLoaderFeatureFlag.value) && !this.benefitMappingComplete)
      || (this.employeeTagsLoaderFeatureFlag.value && !this.employeeTagsMappingComplete)
    );

    const part2 = this.delimiter === '';
    const part3 = this.emailRecipients.length === 0;
    const part4 = !this.isValidExtension(this.sftpPublicKey);
    const part5 = this.sftpUserNameIsValid === false;
    const part6 = !this.isPublicKeyAuthInfoComplete();
    const part7 = (this.savingConfiguration || this.loaderSettingsLoading || this.fieldMappingsLoading);
    const part8 = (!this.dateFormat || this.dateFormat === null);


    return part1 || part2 || part3 || part4 || part5 || part6 || part7 || part8;
  }

  private buildInternalFields(fieldNames: string[], areDataElementNames: boolean) {
    const internalFields: InternalField[] = [];
    fieldNames.forEach(fieldName => {
      internalFields.push({FieldName: fieldName, IsDataElementName: areDataElementNames});
    });
    return internalFields;
  }
}
