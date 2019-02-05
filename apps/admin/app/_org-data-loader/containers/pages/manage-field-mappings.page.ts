import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import {filter} from 'rxjs/internal/operators';

import { Company } from 'libs/models/company/company.model';
import { LoaderFieldMappingsApiService } from 'libs/data/payfactors-api/data-loads/index';
import { LoaderTypes } from 'libs/constants/loader-types';

import * as fromOrgDataAutoloaderReducer from '../../reducers';
import * as fromCompanySelectorActions from '../../actions/company-selector.actions';
import * as fromEmailRecipientsActions from '../../actions/email-recipients.actions';
import * as fromOrgDataFieldMappingsActions from '../../actions/org-data-field-mappings.actions';
import * as fromLoaderSettingsActions from '../../actions/loader-settings.actions';

import {LoaderFieldSet, MappingModel} from '../../models';
import {
  DATEFORMAT_LOADER_SETTING_KEY_NAME,
  DELIMITER_LOADER_SETTING_KEY_NAME,
  ORG_DATA_PF_EMPLOYEE_FIELDS,
  ORG_DATA_PF_JOB_FIELDS, ORG_DATA_PF_PAYMARKET_FIELDS, ORG_DATA_PF_STRUCTURE_FIELDS,
  ORG_DATA_PF_STRUCTURE_MAPPING_FIELDS
} from '../../constants';
import { EmailRecipientModel } from '../../models/email-recipient.model';
import {LoaderSetting} from '../../models/loader-settings.model';

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
  delimiter: string;
  dateFormat: string;
  loaderSettings$: Observable<LoaderSetting[]>;
  saveLoaderSettingsSuccess$: Observable<boolean>;
  saveLoaderSettingsError$: Observable<boolean>;
  existingCompanyLoaderSettings: LoaderSetting[];
  loaderSettingsToSave: LoaderSetting[];

  constructor (private store: Store<fromOrgDataAutoloaderReducer.State>, private orgDataAutoloaderApi: LoaderFieldMappingsApiService) {
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

    this.mappings = [];
    this.delimiter = ',';
    this.loaderSettingsToSave = [];
    this.existingCompanyLoaderSettings = [];


    this.saveMappingsSuccess$.subscribe(success => {
      if (success) {
        this.saveClass = 'success';
        this.saveMessage = 'Saved.';
      }
    });

    this.saveMappingsError$.subscribe(error => {
      if (error) {
        this.saveClass = 'error';
        this.saveMessage = 'Failed.';
      }
    });

    this.loaderSettings$.subscribe(settings => {
      if (settings.length > 0) {
        this.existingCompanyLoaderSettings = settings;
        const delimiterSetting = this.existingCompanyLoaderSettings.find(x => x.KeyName === DELIMITER_LOADER_SETTING_KEY_NAME);
        this.delimiter = delimiterSetting ? delimiterSetting.KeyValue : null;
        const dateFormatSetting = this.existingCompanyLoaderSettings.find(x => x.KeyName === DATEFORMAT_LOADER_SETTING_KEY_NAME);
        this.dateFormat = dateFormatSetting ? dateFormatSetting.KeyValue : null;
      }
    });

    this.saveLoaderSettingsSuccess$.pipe(
      filter(success => success)
    ).subscribe(success => {
      this.saveClass = 'success';
      this.saveMessage = 'Saved.';
    });

    this.saveLoaderSettingsError$.pipe(
      filter(error => error)
      ).subscribe(error => {
      if (error) {
        this.saveClass = 'error';
        this.saveMessage = 'Failed.';
      }
    });
  }

  ngOnInit() {
    this.store.dispatch(new fromCompanySelectorActions.LoadingCompanies());
  }

  onPaymarketMappingComplete($event: any) {
    this.saveMessage = '';
    this.paymarketMappingComplete = $event.complete;
    if (this.paymarketMappingComplete) {
      this.addOrReplaceMappings('PayMarkets', $event.mappings);
    }
  }

  onJobMappingComplete($event: any) {
    this.saveMessage = '';
    this.jobMappingComplete = $event.complete;
    if (this.jobMappingComplete) {
      this.addOrReplaceMappings('Jobs', $event.mappings);
    }
  }

  onStructureMappingComplete($event: any) {
    this.saveMessage = '';
    this.structureMappingComplete = $event.complete;
    if (this.structureMappingComplete) {
      this.addOrReplaceMappings('Structures', $event.mappings);
    }
  }

  onStructureMappingMappingComplete($event: any) {
    this.saveMessage = '';
    this.structureMappingMappingComplete = $event.complete;
    if (this.structureMappingMappingComplete) {
      this.addOrReplaceMappings('StructureMapping', $event.mappings);
    }
  }

  onEmployeeMappingComplete($event: any) {
    this.saveMessage = '';
    this.employeeMappingComplete = $event.complete;
    if (this.employeeMappingComplete) {
      this.addOrReplaceMappings('Employees', $event.mappings);
    }
    if ($event.dateFormat) {
      this.dateFormat = $event.dateFormat;
    }
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

    this.store.dispatch(new fromLoaderSettingsActions.LoadingLoaderSettings(this.selectedCompany));
    this.store.dispatch(new fromOrgDataFieldMappingsActions.LoadingFieldMappings(this.selectedCompany));
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

    this.loaderSettingsToSave = [];
  }

  private addOrReplaceMappings(loaderType: string, mappings: string[]) {
    let index = -1;
    const mappingsModel: MappingModel = {
      LoaderType: loaderType,
      Mappings: mappings
    };

    for (let i = 0; i < this.mappings.length; i++) {
      if (this.mappings[i].LoaderType === loaderType) {
        index = i;
      }
    }

    if (index !== -1) {
      this.mappings[index] = mappingsModel;
    } else {
      this.mappings.push(mappingsModel);
    }
  }

  private getLoaderSettingsToSave() {
    const existingDelimiterSetting = this.existingCompanyLoaderSettings.filter(x => x.KeyName === DELIMITER_LOADER_SETTING_KEY_NAME)[0];
    const existingDateFormatSetting = this.existingCompanyLoaderSettings.filter(x => x.KeyName === DATEFORMAT_LOADER_SETTING_KEY_NAME)[0];

    if ((!existingDelimiterSetting && this.delimiter)
      || (existingDelimiterSetting && this.delimiter !== existingDelimiterSetting.KeyValue)) {
      this.pushToLoaderSettingsToSave(DELIMITER_LOADER_SETTING_KEY_NAME, this.delimiter);
    }

    if ((!existingDateFormatSetting && this.dateFormat)
      || (existingDateFormatSetting && this.dateFormat !== existingDateFormatSetting.KeyValue)) {
      this.pushToLoaderSettingsToSave(DATEFORMAT_LOADER_SETTING_KEY_NAME, this.dateFormat);
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
