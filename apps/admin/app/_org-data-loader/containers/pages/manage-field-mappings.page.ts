import { Component, OnInit } from '@angular/core';
import { NotificationService, NotificationSettings, NotificationRef } from '@progress/kendo-angular-notification';
import { delay, isNumber, isObject } from 'lodash';

import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { filter } from 'rxjs/operators';

import { Company } from 'libs/models/company/company.model';
import { LoaderFieldMappingsApiService } from 'libs/data/payfactors-api/data-loads/index';
import { LoaderTypes } from 'libs/constants/loader-types';
import { ConfigSettingsSelectorFactory } from 'libs/state/app-context/services';
import { ConfigSetting } from 'libs/models/security';
import { VisibleLoaderOptionModel} from 'libs/features/org-data-loader/models';

import * as fromOrgDataAutoloaderReducer from '../../reducers';

import * as fromCompanySelectorActions from '../../actions/company-selector.actions';
import * as fromEmailRecipientsActions from '../../actions/email-recipients.actions';
import * as fromOrgDataFieldMappingsActions from '../../actions/org-data-field-mappings.actions';
import * as fromLoaderSettingsActions from '../../actions/loader-settings.actions';
import { OpenEmailRecipientsModal } from '../../actions/email-recipients.actions';

import {
  ORG_DATA_PF_EMPLOYEE_FIELDS,
  ORG_DATA_PF_JOB_FIELDS,
  ORG_DATA_PF_PAYMARKET_FIELDS,
  ORG_DATA_PF_STRUCTURE_FIELDS,
  ORG_DATA_PF_STRUCTURE_MAPPING_FIELDS,
  LoaderType,
  LoaderSettingsKeys,
} from '../../constants';

import {
  EmailRecipientModel,
  LoaderEntityStatus,
  LoaderFieldSet,
  LoaderSetting,
  MappingModel,
  OrgDataFilenamePatternSet,
  LoaderSaveCoordination
} from '../../models';
import { environment } from 'environments/environment';

@Component({
  selector: 'pf-autoloader-field-mapping-page',
  templateUrl: './manage-field-mappings.page.html',
  styleUrls: ['./manage-field-mappings.page.scss']
})
export class ManageFieldMappingsPageComponent implements OnInit {

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
  companies$: Observable<Company[]>;
  companiesLoading$: Observable<boolean>;
  selectedCompany: number;
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

  constructor (
    private store: Store<fromOrgDataAutoloaderReducer.State>,
    private orgDataAutoloaderApi: LoaderFieldMappingsApiService,
    private notificationService: NotificationService,
    private configSettingsSelectorFactory: ConfigSettingsSelectorFactory,
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

    this.companies$ = this.store.select(fromOrgDataAutoloaderReducer.getCompanies);
    this.companiesLoading$ = this.store.select(fromOrgDataAutoloaderReducer.getCompaniesLoading);
    this.companyMappings$ = this.store.select(fromOrgDataAutoloaderReducer.getFieldMappings);
    this.companyMappingsLoading$ = this.store.select(fromOrgDataAutoloaderReducer.getLoadingFieldMappings);
    this.saveMappingsSuccess$ = this.store.select(fromOrgDataAutoloaderReducer.getSavingFieldMappingsSuccess);
    this.saveMappingsError$ = this.store.select(fromOrgDataAutoloaderReducer.getSavingFieldMappingsError);
    this.emailRecipients$ = this.store.select(fromOrgDataAutoloaderReducer.getEmailRecipients);
    this.loaderSettings$ = this.store.select(fromOrgDataAutoloaderReducer.getLoaderSettings);
    this.loaderSettingsLoading$ = this.store.select(fromOrgDataAutoloaderReducer.getLoadingLoaderSettings);
    this.saveLoaderSettingsSuccess$ = this.store.select(fromOrgDataAutoloaderReducer.getLoaderSettingsSavingSuccess);
    this.saveLoaderSettingsError$ = this.store.select(fromOrgDataAutoloaderReducer.getLoadingLoaderSettingsError);
    this.orgDataFilenamePatternSet$ = this.store.select(fromOrgDataAutoloaderReducer.getOrgDataFilenamePatternSet);

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

        this.isActive = this.getLoaderSettingValueIfSet<boolean>(
          LoaderSettingsKeys.IsActive,
          true,
          this.stringSettingToBooleanTransform,
        );
        this.isCompanyOnAutoloader = this.getLoaderSettingValueIfSet<boolean>(
          LoaderSettingsKeys.IsActive,
          false,
          this.stringSettingToBooleanTransform
        );
        this.delimiter = this.getLoaderSettingValueIfSet<string>(LoaderSettingsKeys.Delimiter, null, this.noopStringTransform);
        this.dateFormat = this.getLoaderSettingValueIfSet<string>(LoaderSettingsKeys.DateFormat, null, this.noopStringTransform);
        this.isEmployeesLoadEnabled = this.getLoaderSettingValueIfSet<boolean>(
          LoaderSettingsKeys.IsEmployeesLoadEnabled,
          false,
          this.stringSettingToBooleanTransform,
        );
        this.isJobsLoadEnabled = this.getLoaderSettingValueIfSet<boolean>(
          LoaderSettingsKeys.IsJobsLoadEnabled,
          false,
          this.stringSettingToBooleanTransform,
        );
        this.isPaymarketsLoadEnabled = this.getLoaderSettingValueIfSet<boolean>(
          LoaderSettingsKeys.IsPaymarketsLoadEnabled,
          false,
          this.stringSettingToBooleanTransform,
        );
        this.isStructuresLoadEnabled = this.getLoaderSettingValueIfSet<boolean>(
          LoaderSettingsKeys.IsStructuresLoadEnabled,
          false,
          this.stringSettingToBooleanTransform,
        );
        this.isStructureMappingsLoadEnabled = this.getLoaderSettingValueIfSet<boolean>(
          LoaderSettingsKeys.IsStructureMappingsLoadEnabled,
          false,
          this.stringSettingToBooleanTransform,
        );
        this.isEmployeesFullReplace = this.getLoaderSettingValueIfSet<boolean>(
          LoaderSettingsKeys.IsEmployeesFullReplace,
          true,
          this.stringSettingToBooleanTransform,
        );
        this.isStructureMappingsFullReplace = this.getLoaderSettingValueIfSet<boolean>(
          LoaderSettingsKeys.IsStructureMappingsFullReplace,
          true,
          this.stringSettingToBooleanTransform,
        );
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
  } // end constructor

  ngOnInit() {
    this.store.dispatch(new fromCompanySelectorActions.LoadingCompanies());
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

  onCompanySelected($event: number) {
    this.selectedCompany = $event;
    this.orgDataAutoloaderApi.getCustomJobFields(this.selectedCompany).subscribe(res => {
      res.forEach((udf) => {
        this.payfactorsJobDataFields.push(udf.Value);
      });
    });

    this.orgDataAutoloaderApi.getCustomEmployeeFields(this.selectedCompany).subscribe(res => {
      res.forEach((udf) => {
        this.payfactorsEmployeeDataFields.push(udf.Value);
      });
    });

    this.store.dispatch(new fromEmailRecipientsActions.LoadEmailRecipients({
      companyId: this.selectedCompany,
      loaderType: LoaderTypes.OrgData
    }));

    this.reloadLoaderSettings();
    this.reloadFieldMappings();
  }

  SaveMappings() {
    const loaderSettingsToSave = this.getLoaderSettingsToSave();

    this.loaderSaveCoordination = {
      mappingsSaveComplete: false,
      mappingsSaved: this.mappings.length > 0,
      settingsSaveComplete: false,
      settingsSaved: loaderSettingsToSave.length > 0,
    };

    if (this.loaderSaveCoordination.settingsSaved) {
      this.store.dispatch(new fromLoaderSettingsActions.SavingLoaderSettings({
        companyId: this.selectedCompany,
        settings: loaderSettingsToSave,
      }));
    }

    if (this.loaderSaveCoordination.mappingsSaved) {
      this.store.dispatch(new fromOrgDataFieldMappingsActions.SavingFieldMappings({
        companyId: this.selectedCompany,
        mappings: this.mappings,
      }));
    }
  }

  private reloadLoaderSettings() {
    this.store.dispatch(new fromLoaderSettingsActions.LoadingLoaderSettings(this.selectedCompany));
  }

  private reloadFieldMappings() {
    this.store.dispatch(new fromOrgDataFieldMappingsActions.LoadingFieldMappings(this.selectedCompany));
  }

  private addOrReplaceMappings(loaderType: string, mappings: string[]) {
    const mappingsModel: MappingModel = {
      LoaderType: loaderType,
      Mappings: mappings
    };

    this.mappings = this.mappings.filter(mapping => mapping.LoaderType !== loaderType);
    this.mappings.push(mappingsModel);
  }

  private getLoaderSettingValueIfSet<T>(keyName: string, defaultValue: T, transform: (value: string) => T) {
    const setting = this.existingCompanyLoaderSettings.find(x => x.KeyName === keyName);
    return setting ? transform(setting.KeyValue) : defaultValue;
  }

  private getLoaderSettingsToSave() {
    return [
      this.getSettingIfChanged(
        LoaderSettingsKeys.IsActive,
        this.booleanSettingToStringTransform(this.isActive),
      ),
      this.getSettingIfChanged(LoaderSettingsKeys.Delimiter, this.delimiter),
      this.getSettingIfChanged(LoaderSettingsKeys.DateFormat, this.dateFormat),
      this.getSettingIfChanged(
        LoaderSettingsKeys.IsEmployeesLoadEnabled,
        this.booleanSettingToStringTransform(this.isEmployeesLoadEnabled),
      ),
      this.getSettingIfChanged(
        LoaderSettingsKeys.IsJobsLoadEnabled,
        this.booleanSettingToStringTransform(this.isJobsLoadEnabled),
      ),
      this.getSettingIfChanged(
        LoaderSettingsKeys.IsPaymarketsLoadEnabled,
        this.booleanSettingToStringTransform(this.isPaymarketsLoadEnabled),
      ),
      this.getSettingIfChanged(
        LoaderSettingsKeys.IsStructuresLoadEnabled,
        this.booleanSettingToStringTransform(this.isStructuresLoadEnabled),
      ),
      this.getSettingIfChanged(
        LoaderSettingsKeys.IsStructureMappingsLoadEnabled,
        this.booleanSettingToStringTransform(this.isStructureMappingsLoadEnabled),
      ),
      this.getSettingIfChanged(
        LoaderSettingsKeys.IsEmployeesFullReplace,
        this.booleanSettingToStringTransform(this.isEmployeesFullReplace),
      ),
      this.getSettingIfChanged(
        LoaderSettingsKeys.IsStructureMappingsFullReplace,
        this.booleanSettingToStringTransform(this.isStructureMappingsFullReplace),
      ),
    ].filter(setting => isObject(setting));
  }

  private booleanSettingToStringTransform = (value: boolean) => value ? 'true' : 'false';
  private stringSettingToBooleanTransform = (value: string) => /^true$/i.test(value);

  private noopStringTransform = (value: string) => value;

  private getSettingIfChanged(keyName: string, keyValue: string) {
    const existingSettingValue = this.existingCompanyLoaderSettings.find(setting => setting.KeyName === keyName);

    if (
      (!existingSettingValue && keyValue) ||
      (existingSettingValue && keyValue !== existingSettingValue.KeyValue)
    ) {
      return this.getSettingToSave(keyName, keyValue);
    }
  }

  private getSettingToSave(keyName: string, keyValue: string) {
    return <LoaderSetting> {
      LoaderSettingsId: undefined,
      KeyName: keyName,
      KeyValue: keyValue
    };
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
      } catch (e) {}
    }

    // delay to emphasize that this is a new toast message in the event that the text content is the same
    delay(
      () => this.toastReference = this.notificationService.show(options),
      this.toastClosePaddingMs,
    );
  }

  openEmailRecipientsModal() {
    this.store.dispatch(new OpenEmailRecipientsModal());
  }
}
