import {ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';

import { delay, isNumber, isObject } from 'lodash';

import { Store } from '@ngrx/store';
import {Observable, Subject} from 'rxjs';
import {filter, take, takeUntil} from 'rxjs/operators';

import { NotificationRef, NotificationService, NotificationSettings } from '@progress/kendo-angular-notification';

import { environment } from 'environments/environment';
import { LoaderTypes } from 'libs/constants/loader-types';
import { LoaderFieldMappingsApiService } from 'libs/data/payfactors-api/data-loads/index';
import { LoaderSettings, OrgDataLoadHelper } from 'libs/features/org-data-loader/helpers';
import { LoaderEntityStatus, VisibleLoaderOptionModel } from 'libs/features/org-data-loader/models';
import * as fromLoaderSettingsActions from 'libs/features/org-data-loader/state/actions/loader-settings.actions';
import { ConfigSetting } from 'libs/models/security';
import { ConfigSettingsSelectorFactory } from 'libs/state/app-context/services';
import * as fromEmailRecipientsActions from 'libs/features/loader-email-reipients/state/actions/email-recipients.actions';
import {
  ConfigurationGroup,
  EmailRecipientModel,
  LoaderFieldSet,
  LoaderSaveCoordination,
  LoaderSetting,
  MappingModel
} from 'libs/models/data-loads';
import { LoadTypes } from 'libs/constants';
import * as fromCompanySelectorActions from 'libs/features/company/actions';
import { CompanySelectorItem } from 'libs/features/company/models';
import * as fromCompanyReducer from 'libs/features/company/reducers';
import {CompanySelectorComponent} from 'libs/features/company/components';

import * as fromOrgDataAutoloaderReducer from '../../reducers';
import * as fromOrgDataFieldMappingsActions from '../../actions/org-data-field-mappings.actions';
import * as fromConfigurationGroupsActions from '../../actions/configuration-groups.actions';
import {
    LoaderType, ORG_DATA_PF_EMPLOYEE_FIELDS, ORG_DATA_PF_JOB_FIELDS, ORG_DATA_PF_PAYMARKET_FIELDS, ORG_DATA_PF_STRUCTURE_FIELDS,
    ORG_DATA_PF_STRUCTURE_MAPPING_FIELDS
} from '../../constants';
import { OrgDataFilenamePatternSet } from '../../models';


@Component({
  selector: 'pf-autoloader-field-mapping-page',
  templateUrl: './manage-field-mappings.page.html',
  styleUrls: ['./manage-field-mappings.page.scss']
})
export class ManageFieldMappingsPageComponent implements OnInit, OnDestroy {
  @ViewChild('companySelector', {static: false}) companySelector: CompanySelectorComponent;
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
  saveMappingsSuccess$: Observable<boolean>;
  saveMappingsError$: Observable<boolean>;
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
  saveLoaderSettingsSuccess$: Observable<boolean>;
  saveLoaderSettingsError$: Observable<boolean>;
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
  private savedConfigurationGroup$: Observable<ConfigurationGroup>;
  private unsubscribe$ = new Subject();


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

  private get toastSuccessOptions(): NotificationSettings {
    return {
      ...this.toastOptions,
      content: 'Mappings have been saved and autoloader will begin processing this client\'s files when they become available.',
      cssClass: 'alert-success',
    };
  }

  private get toastErrorOptions(): NotificationSettings {
    return {
      ...this.toastOptions,
      content: 'Error saving field mappings.',
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
    this.saveMappingsSuccess$ = this.store.select(fromOrgDataAutoloaderReducer.getSavingFieldMappingsSuccess);
    this.saveMappingsError$ = this.store.select(fromOrgDataAutoloaderReducer.getSavingFieldMappingsError);
    this.emailRecipients$ = this.store.select(fromOrgDataAutoloaderReducer.getEmailRecipients);
    this.emailRecipientsSavingError$ = this.store.select(fromOrgDataAutoloaderReducer.getSavingRecipientError);
    this.emailRecipientsRemovingError$ = this.store.select(fromOrgDataAutoloaderReducer.getRemovingRecipientError);
    this.emailRecipientsModalOpen$ = this.store.select(fromOrgDataAutoloaderReducer.getEmailRecipientsModalOpen);
    this.loaderSettings$ = this.store.select(fromOrgDataAutoloaderReducer.getLoaderSettings);
    this.loaderSettingsLoading$ = this.store.select(fromOrgDataAutoloaderReducer.getLoadingLoaderSettings);
    this.saveLoaderSettingsSuccess$ = this.store.select(fromOrgDataAutoloaderReducer.getLoaderSettingsSavingSuccess);
    this.saveLoaderSettingsError$ = this.store.select(fromOrgDataAutoloaderReducer.getLoadingLoaderSettingsError);
    this.orgDataFilenamePatternSet$ = this.store.select(fromOrgDataAutoloaderReducer.getOrgDataFilenamePatternSet);
    this.configurationGroups$ = this.store.select(fromOrgDataAutoloaderReducer.getConfigurationGroups);
    this.savedConfigurationGroup$ = this.store.select(fromOrgDataAutoloaderReducer.getSavedConfigurationGroup);

    const sftpDomainConfigSelector = this.configSettingsSelectorFactory.getConfigSettingsSelector('SftpDomain');
    const sftpPortConfigSelector = this.configSettingsSelectorFactory.getConfigSettingsSelector('SftpPort');
    this.sftpDomainConfig$ = this.store.select(sftpDomainConfigSelector);
    this.sftpPortConfig$ = this.store.select(sftpPortConfigSelector);

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

    this.saveMappingsSuccess$
      .pipe(
        filter(success => success),
      )
      .subscribe(success => {
        this.showLoaderMappingsSaveSuccessToast();
        this.mappings = [];
      });

    this.saveMappingsError$
      .pipe(
        filter(error => error),
      )
      .subscribe(this.showLoaderMappingsSaveErrorToast);

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

    this.saveLoaderSettingsSuccess$
      .pipe(
        filter(success => success),
      )
      .subscribe(() => {
        this.showLoaderSettingsSaveSuccessToast();
        this.reloadLoaderSettings();
      });

    this.saveLoaderSettingsError$
      .pipe(
        filter(error => error),
      )
      .subscribe(this.showLoaderSettingsSaveErrorToast);

    this.configurationGroups$
      .pipe(
        filter(configGroups => configGroups.length > 0)
      )
      .subscribe(configGroups => {
        // For now we only save one config group per company per loadType, so the array only contains one item
        this.selectedConfigGroup = configGroups[0];
        this.reloadLoaderSettings();
        this.reloadFieldMappings();
      });

    this.savedConfigurationGroup$
      .pipe(
        filter(configGroup => !!configGroup)
      ).subscribe(configGroup => {
        this.selectedConfigGroup = configGroup;

        this.saveLoaderSettings();
        this.saveFieldMappings();
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

    this.store.dispatch(new fromEmailRecipientsActions.LoadEmailRecipients({
      companyId: this.selectedCompany.CompanyId,
      loaderType: LoaderTypes.OrgData
    }));

    this.store.dispatch(new fromConfigurationGroupsActions.LoadingConfigurationGroups({
      CompanyId: this.selectedCompany.CompanyId,
      LoadType: LoadTypes.Sftp
    }));
  }

  SaveMappings() {
    const loaderSettingsToSave = this.getLoaderSettingsToSave();

    this.loaderSaveCoordination = {
      mappingsSaveComplete: false,
      mappingsSaved: this.mappings.length > 0,
      settingsSaveComplete: false,
      settingsSaved: loaderSettingsToSave.length > 0,
    };

    if (!this.selectedConfigGroup && (this.loaderSaveCoordination.settingsSaved || this.loaderSaveCoordination.mappingsSaved)) {
      const newConfigurationGroup: ConfigurationGroup = {
        LoaderConfigurationGroupId: null,
        CompanyId: this.selectedCompany.CompanyId,
        GroupName: 'Sftp Saved Mappings',
        LoadType: LoadTypes.Sftp
      };

      this.store.dispatch(new fromConfigurationGroupsActions.SavingConfigurationGroup(newConfigurationGroup));
    } else {
      this.saveLoaderSettings();
      this.saveFieldMappings();
    }
  }

  private saveFieldMappings() {
    if (this.loaderSaveCoordination.mappingsSaved) {
      this.store.dispatch(new fromOrgDataFieldMappingsActions.SavingFieldMappings({
        companyId: this.selectedCompany.CompanyId,
        mappings: this.mappings,
        loaderConfigurationGroupId: this.selectedConfigGroup.LoaderConfigurationGroupId
      }));
    }
  }

  private saveLoaderSettings() {
    const loaderSettingsToSave = this.getLoaderSettingsToSave();

    if (this.loaderSaveCoordination.settingsSaved) {
      this.store.dispatch(new fromLoaderSettingsActions.SavingLoaderSettings({
        companyId: this.selectedCompany.CompanyId,
        settings: loaderSettingsToSave,
        loaderConfigurationGroupId: this.selectedConfigGroup.LoaderConfigurationGroupId
      }));
    }
  }

  private reloadLoaderSettings() {
    this.store.dispatch(new fromLoaderSettingsActions.LoadingLoaderSettings(this.selectedCompany.CompanyId, this.selectedConfigGroup.LoaderConfigurationGroupId));
  }

  private reloadFieldMappings() {
    this.store.dispatch(new fromOrgDataFieldMappingsActions.LoadingFieldMappings(this.selectedCompany.CompanyId, this.selectedConfigGroup.LoaderConfigurationGroupId));
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

    return OrgDataLoadHelper.getLoaderSettingsToSave(newLoaderSettings, this.existingCompanyLoaderSettings);
  }

  /**
   * toast notifications for saving field mappings and settings are somewhat complex
   *
   *                       | settings save success | settings save failure | settings not saved    |
   * ----------------------|-----------------------------------------------------------------------|
   * mappings save success | show success toast    | show error toast      | show success toast    |
   * mappings save failure | show error toast      | show error toast      | show error toast      |
   * mappings not saved    | show success toast    | show error toast      | n/a                   |
   *
   * use this.loaderSaveCoordination to coordinate, since saving mappings and saving settings are separate async operations
   */
  private showLoaderMappingsSaveSuccessToast = () => {
    this.loaderSaveCoordination.mappingsSaveComplete = true;
    this.loaderSaveCoordination.mappingsSaveSuccess = true;

    if (!this.loaderSaveCoordination.settingsSaved || this.loaderSaveCoordination.settingsSaveSuccess) {
      this.showSaveSuccessToast();
    }
  }

  private showLoaderMappingsSaveErrorToast = () => {
    this.loaderSaveCoordination.mappingsSaveComplete = true;
    this.loaderSaveCoordination.mappingsSaveSuccess = false;

    if (!this.loaderSaveCoordination.settingsSaved || this.loaderSaveCoordination.settingsSaveComplete) {
      this.showSaveErrorToast();
    }
  }

  private showLoaderSettingsSaveSuccessToast = () => {
    this.loaderSaveCoordination.settingsSaveComplete = true;
    this.loaderSaveCoordination.settingsSaveSuccess = true;

    if (!this.loaderSaveCoordination.mappingsSaved || this.loaderSaveCoordination.mappingsSaveSuccess) {
      this.showSaveSuccessToast();
    }
  }

  private showLoaderSettingsSaveErrorToast = () => {
    this.loaderSaveCoordination.settingsSaveComplete = true;
    this.loaderSaveCoordination.settingsSaveSuccess = false;

    if (!this.loaderSaveCoordination.mappingsSaved || this.loaderSaveCoordination.mappingsSaveComplete) {
      this.showSaveErrorToast();
    }
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
}
