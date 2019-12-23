import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';

import { KeyValue } from '@angular/common';

import { Store } from '@ngrx/store';
import { forkJoin, Observable, Subject } from 'rxjs';
import { filter, take, takeUntil } from 'rxjs/operators';

import { environment } from 'environments/environment';
import * as fromAppNotificationsActions from 'libs/features/app-notifications/actions/app-notifications.actions';
import { AppNotification, NotificationLevel, NotificationPayload, NotificationType } from 'libs/features/app-notifications/models';
import * as fromAppNotificationsMainReducer from 'libs/features/app-notifications/reducers';
import * as fromCompanySelectorActions from 'libs/features/company/actions';
import { CompanySelectorItem } from 'libs/features/company/models';
import * as fromCompanyReducer from 'libs/features/company/reducers';
import { LoaderSettingsKeys, LoaderType } from 'libs/features/org-data-loader/constants';
import { LoaderSettings, OrgDataLoadHelper } from 'libs/features/org-data-loader/helpers';
import { ILoadSettings } from 'libs/features/org-data-loader/helpers/org-data-load-helper';
import { FileUploadDataRequestModel, LoaderEntityStatus } from 'libs/features/org-data-loader/models';
import * as fromLoaderSettingsActions from 'libs/features/org-data-loader/state/actions/loader-settings.actions';
import { LoaderSaveCoordination, LoaderSetting, MappingModel } from 'libs/models/data-loads';
import { UserContext } from 'libs/models/security';
import * as fromRootState from 'libs/state/state';

import * as fromDataManagementMainReducer from '../../../reducers';
import * as fromOrganizationalDataActions from '../../../actions/organizational-data-page.action';
import * as fromCustomFieldsActions from '../../../actions/custom-fields.actions';
import * as fromOrgDataFieldMappingsActions from '../../../actions/organizational-data-field-mapping.actions';
import { EntityUploadComponent } from '../../../components';
import { ConfigurationGroup, EntityChoice, FileUploadDataModel, getEntityChoicesForOrgLoader, OrgUploadStep } from '../../../models';

@Component({
  selector: 'pf-org-data-load',
  templateUrl: './org-data-load.component.html',
  styleUrls: ['./org-data-load.component.scss']
})

export class OrgDataLoadComponent implements OnInit, OnDestroy {

  @ViewChild('entityUpload', { static: false }) uploadComponent: EntityUploadComponent;
  private defaultDelimiter = ',';

  loadOptions: EntityChoice[];
  userMappings: KeyValue<number, string>[];

  private unsubscribe$ = new Subject();
  private companies$: Observable<CompanySelectorItem[]>;
  private selectedCompany$: Observable<CompanySelectorItem>;
  private organizationalDataTemplateLink$: Observable<string>;
  private configGroup$: Observable<ConfigurationGroup>;
  private customJobFields$: Observable<any>;
  private customEmployeeFields$: Observable<any>;
  private fileUploadData$: Observable<any>;
  private fileUploadDataFailed$: Observable<any>;
  private savedConfigurationGroup$: Observable<ConfigurationGroup>;
  public isModalOpen$: Observable<boolean>;
  public isProcessingMapping$: Observable<boolean>;
  private gettingColumnNames$: Observable<boolean>;

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
  hasError = false;
  env = environment;
  organizationalDataTemplateLink: string;
  selectedDelimiter = this.defaultDelimiter;
  userContext: UserContext;
  loaderSetting: ILoadSettings;
  loaderConfigGroup: ConfigurationGroup;

  existingLoaderSettings: LoaderSetting[];
  private configGroupSeed: ConfigurationGroup = {
    LoaderConfigurationGroupId: -1, GroupName: 'Add New Mapping', CompanyId: -1
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
    'Please fully map each selected Entity'
  ];
  private paymarketMappingComplete: boolean;
  private isPaymarketsLoadEnabled: boolean;
  private jobMappingComplete: boolean;
  private isJobsLoadEnabled: boolean;
  private structureMappingComplete: boolean;
  private isStructuresLoadEnabled: boolean;
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

  notification: { success: AppNotification<NotificationPayload>, error: AppNotification<NotificationPayload> } = {
    success: {
      NotificationId: '',
      Level: NotificationLevel.Info,
      From: 'Organizational Data Loader',
      Payload: {
        Title: 'Organizational Data Loader',
        Message: 'The organization load has been successfully queued for processing. Please check your email for updates.'
      },
      EnableHtml: true,
      Type: NotificationType.Event
    },
    error: {
      NotificationId: '',
      Level: NotificationLevel.Error,
      From: 'Organizational Data Loader',
      Payload: {
        Title: 'Organizational Data Loader',
        Message: 'Your file upload has failed. Please contact free@payfactors.com'
      },
      EnableHtml: true,
      Type: NotificationType.Event
    }
  };
  private gettingColumnNames: boolean;

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
    this.configGroup$ = this.mainStore.select(fromDataManagementMainReducer.getConfigurationGroup);
    this.customJobFields$ = this.mainStore.select(fromDataManagementMainReducer.getCustomJobField);
    this.customEmployeeFields$ = this.mainStore.select(fromDataManagementMainReducer.getCustomEmployeeField);
    this.fileUploadData$ = this.mainStore.select(fromDataManagementMainReducer.fileUploadData);
    this.fileUploadDataFailed$ = this.mainStore.select(fromDataManagementMainReducer.fileUploadDataFailed);
    this.isProcessingMapping$ = this.mainStore.select(fromDataManagementMainReducer.isProcessingMapping);
    this.savedConfigurationGroup$ = this.mainStore.select(fromDataManagementMainReducer.getSavedConfigurationGroup);
    this.gettingColumnNames$ = this.mainStore.select(fromDataManagementMainReducer.getGettingColumnNames);
    this.selectedCompany$.pipe(
      takeUntil(this.unsubscribe$)
    ).subscribe(f => {
      this.selectedCompany = f;
      this.clearSelections();
      if (f) {
        this.mainStore.dispatch(new fromOrganizationalDataActions.GetConfigGroup(f.CompanyId));
        this.getPayfactorCustomFields(f.CompanyId);
      }
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
      this.isStructureMappingsLoadEnabled = resp.isStructureMappingsLoadEnabled;
      this.isEmployeesFullReplace = resp.isEmployeesFullReplace;
      this.isStructureMappingsFullReplace = resp.isStructureMappingsFullReplace;

      this.getEntityChoice(LoaderType.Employees).dateFormat = resp.dateFormat;
      this.getEntityChoice(LoaderType.Employees).isFullReplace = resp.isEmployeesFullReplace;
      this.getEntityChoice(LoaderType.StructureMapping).isFullReplace = resp.isStructureMappingsFullReplace;

    });


    const organizationalDataTemplateSubscription = this.organizationalDataTemplateLink$.pipe(
      filter(uc => !!uc),
      take(1),
      takeUntil(this.unsubscribe$)).subscribe(f => this.organizationalDataTemplateLink = f);

    this.configGroup$.pipe(
      filter(uc => !!uc),
      takeUntil(this.unsubscribe$)
    ).subscribe(f => {
      this.getSettings(f);
      this.loaderConfigGroup = f;
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

    forkJoin({ user: userSubscription, company: companiesSubscription })
      .subscribe(f => {
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
    if (this.userContext.AccessLevel === 'Admin') {
      this.selectedCompany = null;
      this.stepIndex = OrgUploadStep.Company;
    } else {
      this.selectedCompany = this.companies.find(f => f.CompanyId === this.userContext.CompanyId);
      this.mainStore.dispatch(new fromCompanySelectorActions.SetSelectedCompany(this.selectedCompany));
      this.stepIndex = OrgUploadStep.Entity;
    }
    // reset any checked loads
    this.loadOptions = getEntityChoicesForOrgLoader();
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
        const existingDateFormatValue = this.existingLoaderSettings.find(setting => setting.KeyName === LoaderSettingsKeys.DateFormat).KeyValue;
        const existingIsEmpFullReplaceValue =
          this.existingLoaderSettings.find(setting => setting.KeyName === LoaderSettingsKeys.IsEmployeesFullReplace).KeyValue;
        const existingIsStructureMappingFullReplaceValue =
          this.existingLoaderSettings.find(setting => setting.KeyName === LoaderSettingsKeys.IsStructureMappingsFullReplace).KeyValue;

        this.getEntityChoice(LoaderType.Employees).dateFormat = existingDateFormatValue;
        this.getEntityChoice(LoaderType.Employees).isFullReplace = existingIsEmpFullReplaceValue === 'true';
        this.getEntityChoice(LoaderType.StructureMapping).isFullReplace = existingIsStructureMappingFullReplaceValue === 'true';
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

    if (this.stepIndex === OrgUploadStep.FieldMapping && !this.showFieldMapperTooltip) {
      return true;
    }

    return false;
  }

  nextBtnClick() {
    if (this.areStepsValid()) {
      if (this.stepIndex !== OrgUploadStep.FieldMapping) {
        this.stepIndex += 1;
      }
    }
  }

  orgDataExportAction() {
    if (this.selectedCompany) {
      return `/odata/OrganizationalData/GetOrganizationalDataCsv?companyId=${this.selectedCompany.CompanyId}`;
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

  download(event) {
    if (event.target.id === 'data') {
      document.forms['OrgDataExportForm'].submit();
    }
    event.preventDefault();
  }


  processBtnClick() {
    if (this.showFieldMapperTooltip) {
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
        LoaderConfigurationGroupId: null
      };
      this.mainStore.dispatch(new fromOrganizationalDataActions.SaveConfigGroup(newConfigGroup));
    }
  }

  private uploadFiles(loaderConfigurationGroupId: number) {
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
    newLoaderSettings.isStructureMappingsLoadEnabled = this.isStructureMappingsLoadEnabled;
    newLoaderSettings.isEmployeesFullReplace = this.isEmployeesFullReplace;
    newLoaderSettings.isStructureMappingsFullReplace = this.isStructureMappingsFullReplace;

    return OrgDataLoadHelper.getLoaderSettingsToSave(newLoaderSettings, this.existingLoaderSettings);
  }

  shouldNextButtonBeDisabled() {
    return this.stepIndex === OrgUploadStep.FieldMapping && this.mappingsAreNotComplete();
  }

  private mappingsAreNotComplete() {
    return !this.paymarketMappingComplete || !this.jobMappingComplete || !this.structureMappingComplete ||
      !this.structureMappingMappingComplete || !this.employeeMappingComplete;
  }
}
