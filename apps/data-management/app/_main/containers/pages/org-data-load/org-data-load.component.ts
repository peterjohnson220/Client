import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';

import { KeyValue } from '@angular/common';

import { Store } from '@ngrx/store';
import { forkJoin, Observable, Subject } from 'rxjs';
import { filter, take, takeUntil } from 'rxjs/operators';

import { environment } from 'environments/environment';
import * as fromCompanySelectorActions from 'libs/features/company/actions';
import { CompanySelectorItem } from 'libs/features/company/models';
import * as fromCompanyReducer from 'libs/features/company/reducers';
import { LoaderType } from 'libs/features/org-data-loader/constants';
import { OrgDataLoadHelper } from 'libs/features/org-data-loader/helpers';
import { ILoadSettings } from 'libs/features/org-data-loader/helpers/org-data-load-helper';
import * as fromLoaderSettingsActions from 'libs/features/org-data-loader/state/actions/loader-settings.actions';
import { LoaderSetting } from 'libs/models/data-loads';
import { UserContext } from 'libs/models/security';
import * as fromRootState from 'libs/state/state';

import * as fromDataManagementMainReducer from '../../../reducers';
import * as fromOrganizationalDataActions from '../../../actions/organizational-data-page.action';
import { EntityUploadComponent } from '../../../components';
import { ConfigurationGroup, EntityChoice, getEntityChoicesForOrgLoader, OrgUploadStep } from '../../../models';
import * as fromCustomFieldsActions from '../../../actions/custom-fields.actions';

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
  public isModalOpen$: Observable<boolean>;

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
  selectedCompany: CompanySelectorItem = null;
  hasError = false;
  env = environment;
  organizationalDataTemplateLink: string;
  selectedDelimiter = this.defaultDelimiter;
  userContext: UserContext;
  loaderSetting: ILoadSettings;
  loaderConfigGroup: ConfigurationGroup;

  private configGroupSeed: ConfigurationGroup = {
    LoaderConfigurationGroupId: -1, GroupName: 'Add New Mapping', CompanyId: -1
  };

  StepHeaders: string[] = [
    'Select a company:',
    'Select which organizational data entity you would like to load data for:',
    'Select and upload files:'
  ];

  NextBtnToolTips: string[] = [
    'You must choose a company',
    'Please select at least one entity to load data for.',
    'Please choose a file for each entity type'
  ];

  constructor(private store: Store<fromCompanyReducer.State>,
    private mainStore: Store<fromDataManagementMainReducer.State>) {

    this.AddAndSetSelectedMapping(this.configGroupSeed);

    this.userContext$ = this.store.select(fromRootState.getUserContext);
    this.companies$ = this.store.select(fromCompanyReducer.getCompanies);
    this.selectedCompany$ = this.store.select(fromCompanyReducer.getSelectedCompany);
    this.organizationalDataTemplateLink$ = this.mainStore.select(fromDataManagementMainReducer.getOrganizationalHeadersLink);
    this.isModalOpen$ = this.mainStore.select(fromDataManagementMainReducer.getModalStateOpen);
    this.loaderSettings$ = this.mainStore.select(fromDataManagementMainReducer.getLoaderSettings);
    this.configGroup$ = this.mainStore.select(fromDataManagementMainReducer.getConfigurationGroup);
    this.customJobFields$ = this.mainStore.select(fromDataManagementMainReducer.getCustomJobField);
    this.customEmployeeFields$ = this.mainStore.select(fromDataManagementMainReducer.getCustomEmployeeField);

    this.selectedCompany$.pipe(
      filter(uc => !!uc),
      takeUntil(this.unsubscribe$)
    ).subscribe(f => {
      this.selectedCompany = f;
      this.store.dispatch(new fromOrganizationalDataActions.GetConfigGroup(f.CompanyId));
      this.getPayfactorCustomFields(f.CompanyId);
    });

    this.loaderSettings$.pipe(
      filter(uc => !!uc && uc.length > 0),
      takeUntil(this.unsubscribe$)
    ).subscribe(f => {
      const resp = OrgDataLoadHelper.parseSettingResponse(f);
      this.loaderSetting = resp;
      this.selectedDelimiter = resp.delimiter;
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
      take(1),
      takeUntil(this.unsubscribe$)).subscribe(jobs => {
        this.loadOptions.find(l => l.templateReferenceConstants === LoaderType.Jobs).customFields.Jobs = jobs;
      });

    this.customEmployeeFields$.pipe(
      filter(uc => !!uc),
      take(1),
      takeUntil(this.unsubscribe$)).subscribe(employees => {
        this.loadOptions.find(l => l.templateReferenceConstants === LoaderType.Employees).customFields.Employees = employees;
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
  }

  ngOnInit(): void {
    this.mainStore.dispatch(new fromOrganizationalDataActions.GetOrganizationalHeadersLink());
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next(true);
  }


  setInitValues() {
    if (this.userContext.AccessLevel === 'Admin') {
      this.selectedCompany = null;
      this.stepIndex = OrgUploadStep.Company;
    } else {
      this.selectedCompany = this.companies.find(f => f.CompanyId === this.userContext.CompanyId);
      this.store.dispatch(new fromCompanySelectorActions.SetSelectedCompany(this.selectedCompany));
      this.stepIndex = OrgUploadStep.Entity;
    }

    // reset any checked loads
    this.loadOptions = getEntityChoicesForOrgLoader();
  }

  getPayfactorCustomFields(companyId) {
    this.store.dispatch(new fromCustomFieldsActions.GetCustomJobFields(companyId));
    this.store.dispatch(new fromCustomFieldsActions.GetCustomEmployeeFields(companyId));
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
    } else {
      if (this.loaderSetting && this.loaderSetting.delimiter) {
        this.selectedDelimiter = this.loaderSetting.delimiter;
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

    switch (this.stepIndex) {
      case OrgUploadStep.Company:
        this.selectedCompany = null;
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

        if (this.loaderConfigGroup) {
          this.selectedMapping = this.mappingOptions.find(f => f.LoaderConfigurationGroupId === this.loaderConfigGroup.LoaderConfigurationGroupId);
          this.selectedDelimiter = this.loaderSetting.delimiter;
        } else {
          this.selectedMapping = this.mappingOptions.find(f => f.LoaderConfigurationGroupId === this.configGroupSeed.LoaderConfigurationGroupId);
          this.selectedDelimiter = this.defaultDelimiter;
        }
        break;

      case OrgUploadStep.FieldMapping:
        // TODO placeholder for next story
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

    if (this.stepIndex === OrgUploadStep.Files && this.hasUploadedFiles()) {
      return true;
    }

    return false;
  }

  nextBtnClick() {
    if (this.areStepsValid()) {
      this.stepIndex += 1;
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


}
