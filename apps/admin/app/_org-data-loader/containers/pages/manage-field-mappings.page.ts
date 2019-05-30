import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { filter } from 'rxjs/operators';

import { Company } from 'libs/models/company/company.model';
import { LoaderFieldMappingsApiService } from 'libs/data/payfactors-api/data-loads/index';
import { LoaderTypes } from 'libs/constants/loader-types';

import * as fromOrgDataAutoloaderReducer from '../../reducers';

import * as fromCompanySelectorActions from '../../actions/company-selector.actions';
import * as fromEmailRecipientsActions from '../../actions/email-recipients.actions';
import * as fromOrgDataFieldMappingsActions from '../../actions/org-data-field-mappings.actions';
import * as fromLoaderSettingsActions from '../../actions/loader-settings.actions';

import {
  ORG_DATA_PF_EMPLOYEE_FIELDS,
  ORG_DATA_PF_JOB_FIELDS,
  ORG_DATA_PF_PAYMARKET_FIELDS,
  ORG_DATA_PF_STRUCTURE_FIELDS,
  ORG_DATA_PF_STRUCTURE_MAPPING_FIELDS
} from '../../constants';

import { LoaderSettingsKeys } from '../../constants/loader-settings-keys.enum';
import { LoaderType } from '../../constants/loader-type.enum';

import {
  EmailRecipientModel,
  LoaderEntityStatus,
  LoaderFieldSet,
  LoaderSetting,
  MappingModel,
  OrgDataFilenamePatternSet
} from '../../models';

@Component({
  selector: 'pf-autoloader-field-mapping-page',
  templateUrl: './manage-field-mappings.page.html',
  styleUrls: ['./manage-field-mappings.page.scss']
})
export class ManageFieldMappingsPageComponent implements OnInit {

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
  saveMessage: string;
  saveClass: string;
  emailRecipients$: Observable<EmailRecipientModel[]>;
  isActive: boolean;
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
  saveLoaderSettingsSuccess$: Observable<boolean>;
  saveLoaderSettingsError$: Observable<boolean>;
  existingCompanyLoaderSettings: LoaderSetting[];
  loaderSettingsToSave: LoaderSetting[];
  loaderTypes = LoaderType;
  orgDataFilenamePatternSet$: Observable<OrgDataFilenamePatternSet>;

  constructor (private store: Store<fromOrgDataAutoloaderReducer.State>,
               private orgDataAutoloaderApi: LoaderFieldMappingsApiService) {
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
    this.saveLoaderSettingsSuccess$ = this.store.select(fromOrgDataAutoloaderReducer.getLoaderSettingsSavingSuccess);
    this.saveLoaderSettingsError$ = this.store.select(fromOrgDataAutoloaderReducer.getLoadingLoaderSettingsError);
    this.orgDataFilenamePatternSet$ = this.store.select(fromOrgDataAutoloaderReducer.getOrgDataFilenamePatternSet);

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
    this.loaderSettingsToSave = [];
    this.existingCompanyLoaderSettings = [];

    this.saveMappingsSuccess$
      .pipe(
        filter(success => success),
      )
      .subscribe(success => {
        this.saveClass = 'success';
        this.saveMessage = 'Saved.';
        this.mappings = [];
        this.reloadFieldMappings();
      });

    this.saveMappingsError$
      .pipe(
        filter(error => error),
      )
      .subscribe(error => {
        this.saveClass = 'error';
        this.saveMessage = 'Failed.';
      });

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
        this.saveClass = 'success';
        this.saveMessage = 'Saved.';
        this.loaderSettingsToSave = [];
        this.reloadLoaderSettings();
      });

    this.saveLoaderSettingsError$
      .pipe(
        filter(error => error),
      )
      .subscribe(() => {
        this.saveClass = 'error';
        this.saveMessage = 'Failed.';
      });
  } // end constructor

  ngOnInit() {
    this.store.dispatch(new fromCompanySelectorActions.LoadingCompanies());
  }

  onPaymarketMappingComplete($event: LoaderEntityStatus) {
    this.saveMessage = '';
    this.paymarketMappingComplete = $event.complete;
    this.isPaymarketsLoadEnabled = $event.loadEnabled;
    if (this.paymarketMappingComplete) {
      this.addOrReplaceMappings('PayMarkets', $event.mappings);
    }
  }

  onJobMappingComplete($event: LoaderEntityStatus) {
    this.saveMessage = '';
    this.jobMappingComplete = $event.complete;
    this.isJobsLoadEnabled = $event.loadEnabled;
    if (this.jobMappingComplete) {
      this.addOrReplaceMappings('Jobs', $event.mappings);
    }
  }

  onStructureMappingComplete($event: LoaderEntityStatus) {
    this.saveMessage = '';
    this.structureMappingComplete = $event.complete;
    this.isStructuresLoadEnabled = $event.loadEnabled;
    if (this.structureMappingComplete) {
      this.addOrReplaceMappings('Structures', $event.mappings);
    }
  }

  onStructureMappingMappingComplete($event: LoaderEntityStatus) {
    this.saveMessage = '';
    this.structureMappingMappingComplete = $event.complete;
    this.isStructureMappingsLoadEnabled = $event.loadEnabled;
    if (this.structureMappingMappingComplete) {
      this.addOrReplaceMappings('StructureMapping', $event.mappings);
    }
    this.isStructureMappingsFullReplace = $event.isFullReplace;
  }

  onEmployeeMappingComplete($event: LoaderEntityStatus) {
    this.saveMessage = '';
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
    this.getLoaderSettingsToSave();

    if (this.loaderSettingsToSave.length > 0) {
      this.store.dispatch(new fromLoaderSettingsActions.SavingLoaderSettings({
        settings: this.loaderSettingsToSave,
        companyId: this.selectedCompany
      }));
    }

    if (this.mappings.length > 0) {
      this.store.dispatch(new fromOrgDataFieldMappingsActions.SavingFieldMappings({
        mappings: this.mappings,
        companyId: this.selectedCompany,
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
    this.updateSettingIfChanged(
      LoaderSettingsKeys.IsActive,
      this.booleanSettingToStringTransform(this.isActive),
    );
    this.updateSettingIfChanged(LoaderSettingsKeys.Delimiter, this.delimiter);
    this.updateSettingIfChanged(LoaderSettingsKeys.DateFormat, this.dateFormat);
    this.updateSettingIfChanged(
      LoaderSettingsKeys.IsEmployeesLoadEnabled,
      this.booleanSettingToStringTransform(this.isEmployeesLoadEnabled),
    );
    this.updateSettingIfChanged(
      LoaderSettingsKeys.IsJobsLoadEnabled,
      this.booleanSettingToStringTransform(this.isJobsLoadEnabled),
    );
    this.updateSettingIfChanged(
      LoaderSettingsKeys.IsPaymarketsLoadEnabled,
      this.booleanSettingToStringTransform(this.isPaymarketsLoadEnabled),
    );
    this.updateSettingIfChanged(
      LoaderSettingsKeys.IsStructuresLoadEnabled,
      this.booleanSettingToStringTransform(this.isStructuresLoadEnabled),
    );
    this.updateSettingIfChanged(
      LoaderSettingsKeys.IsStructureMappingsLoadEnabled,
      this.booleanSettingToStringTransform(this.isStructureMappingsLoadEnabled),
    );
    this.updateSettingIfChanged(
      LoaderSettingsKeys.IsEmployeesFullReplace,
      this.booleanSettingToStringTransform(this.isEmployeesFullReplace),
    );
    this.updateSettingIfChanged(
      LoaderSettingsKeys.IsStructureMappingsFullReplace,
      this.booleanSettingToStringTransform(this.isStructureMappingsFullReplace),
    );
  }

  private booleanSettingToStringTransform = (value: boolean) => value ? 'true' : 'false';
  private stringSettingToBooleanTransform = (value: string) => /^true$/i.test(value);

  private noopStringTransform = (value: string) => value;

  private updateSettingIfChanged(keyName: string, keyValue: string) {
    const existingSettingValue = this.existingCompanyLoaderSettings.find(setting => setting.KeyName === keyName);

    if (
      (!existingSettingValue && keyValue) ||
      (existingSettingValue && keyValue !== existingSettingValue.KeyValue)
    ) {
      this.pushToLoaderSettingsToSave(keyName, keyValue);
    }
  }

  private pushToLoaderSettingsToSave(keyName: string, keyValue: string) {
    this.loaderSettingsToSave.push({
      LoaderSettingsId: undefined,
      KeyName: keyName,
      KeyValue: keyValue
    });
  }
}
