import { NgModule } from '@angular/core';

import { HttpClientModule } from '@angular/common/http';

import { PayfactorsApiService } from './payfactors-api.service';
import { NavigationApiService } from './navigation';
import { CompanySettingsApiService, UiPersistenceSettingsApiService } from './settings';
import { AccountApiService } from './auth';
import { MarketDataScopeApiService, PayMarketApiService } from './paymarket';
import {
    ExchangeApiService, ExchangeCompanyApiService, ExchangeDataCutsApiService, ExchangeDataFilterApiService, ExchangeScopeApiService
} from './peer';
import { CompanySecurityApiService } from './security';
import { ExchangeDataSearchApiService, JobSearchApiService, SurveySearchApiService } from './search';
import { DashboardApiService } from './dashboard';
import { UserApiService, UserFilterApiService, UserProfileApiService } from './user';
import { CompanyApiService, CompanyEmployeeApiService, CompanyJobApiService } from './company';
import {
    JobDescriptionApiService, JobDescriptionFooterViewApiService, JobDescriptionManagementApiService, JobDescriptionTemplateApiService,
    JobDescriptionWorkflowApiService, JobDescriptionWorkflowTemplateApiService
} from './jdm';
import { TermsConditionsApiService } from './terms-conditions';
import { AppEnvironmentApiService } from './app-environment';
import { UserTicketApiService } from './service';
import { CompanyJobPricingMatchApiService } from './company-job-pricing-match';
import { RolesApiService, BulkAddUsersApiService } from './company-admin';
import { DataLoadEmailRecipientsApiService, LoaderFieldMappingsApiService, LoaderSettingsApiService } from './data-loads';
import { ProjectApiService } from './project';
import { IntegrationApiService } from './integration';
import { ComphubApiService } from './comphub';
import { FileApiService } from './file';
import { TagApiService } from './tags';
import { SurveyApiService } from './surveys';
import { PermissionService, RemoteDataSourceService } from '../../core/services';
import { DataViewApiService, ReportManagementApiService, TableauReportApiService, UserReportApiService } from './reports';
import { NotificationsApiService } from './notifications';
import { StructuresApiService, StructureRangeGroupApiService } from './structures';
import {
  AuthenticationTypesHrisApiService,
  ConnectionsHrisApiService,
  HrisApiService,
  MappingsHrisApiService,
  ProvidersHrisApiService,
  SyncScheduleHrisApiService,
  TransferMethodsHrisApiService
} from './hris-api';
import { SurveyLibraryApiService } from './survey-library';
import { CompanyResourcesApiService } from './company-resources';
import { ConfigurationGroupApiService, OrganizationalDataApiService } from './organizational-data';
import { JobsApiService } from './jobs';
import {DataImportApiService} from './integration/data-import';
import { TotalRewardsApiService } from './total-rewards';
import { SsoConfigApiService } from './sso';
import { CurrencyApiService } from './currency';
import { CompositeFieldApiService } from './composite-field';
import { PricingApiService } from './pricings';
import { CountryApiService } from './country';

@NgModule({
  imports: [HttpClientModule],
  providers: [
    CompanyApiService,
    CompanySecurityApiService,
    DashboardApiService,
    UserApiService,
    NavigationApiService,
    UiPersistenceSettingsApiService,
    AccountApiService,
    PayMarketApiService,
    PayfactorsApiService,
    JobDescriptionFooterViewApiService,
    JobDescriptionManagementApiService,
    JobDescriptionWorkflowApiService,
    JobDescriptionWorkflowTemplateApiService,
    JobDescriptionTemplateApiService,
    UserProfileApiService,
    UserFilterApiService,
    JobDescriptionApiService,
    JobsApiService,
    TermsConditionsApiService,
    SurveySearchApiService,
    CompanySettingsApiService,
    LoaderFieldMappingsApiService,
    AppEnvironmentApiService,
    UserTicketApiService,
    CompanyJobApiService,
    RolesApiService,
    BulkAddUsersApiService,
    CompanyJobPricingMatchApiService,
    DataLoadEmailRecipientsApiService,
    JobSearchApiService,
    ProjectApiService,
    IntegrationApiService,
    ComphubApiService,
    LoaderSettingsApiService,
    MarketDataScopeApiService,
    FileApiService,
    PermissionService,
    RemoteDataSourceService,
    TagApiService,
    SurveyApiService,
    TableauReportApiService,
    UserReportApiService,
    ReportManagementApiService,
    StructuresApiService,
    StructureRangeGroupApiService,
    DataViewApiService,
    NotificationsApiService,
    SurveyLibraryApiService,
    CompanyResourcesApiService,
    OrganizationalDataApiService,
    ConfigurationGroupApiService,
    DataImportApiService,
    TotalRewardsApiService,
    SsoConfigApiService,
    CurrencyApiService,
    CompositeFieldApiService,
    PricingApiService,
    CountryApiService,
    CompanyEmployeeApiService,

    // PEER
    ExchangeApiService,
    ExchangeCompanyApiService,
    ExchangeDataSearchApiService,
    ExchangeScopeApiService,
    ExchangeDataFilterApiService,
    ExchangeDataCutsApiService,

    // Hris Api Services
    HrisApiService,
    TransferMethodsHrisApiService,
    ProvidersHrisApiService,
    AuthenticationTypesHrisApiService,
    ConnectionsHrisApiService,
    MappingsHrisApiService,
    SyncScheduleHrisApiService
  ]
})
export class PfApiModule { }
