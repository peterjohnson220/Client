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
import {
  ExchangeDataSearchApiService,
  JobSearchApiService,
  SurveySearchApiService,
  ExchangeJobSearchApiService,
} from './search';
import { DashboardApiService } from './dashboard';
import { UserApiService, UserFilterApiService, UserProfileApiService } from './user';
import { CompanyApiService, CompanyEmployeeApiService, CompanyJobApiService } from './company';
import {
    JobDescriptionApiService, JobDescriptionFooterViewApiService, JobDescriptionManagementApiService, JobDescriptionTemplateApiService,
    JobDescriptionWorkflowApiService, JobDescriptionWorkflowTemplateApiService, JobDescriptionWorkflowStepUserApiService
} from './jdm';
import { TermsConditionsApiService } from './terms-conditions';
import { AppEnvironmentApiService } from './app-environment';
import { UserTicketApiService } from './service';
import { CompanyJobPricingMatchApiService } from './company-job-pricing-match';
import { RolesApiService, BulkAddUsersApiService } from './company-admin';
import {
  DataLoadEmailRecipientsApiService,
  LoaderFieldMappingsApiService,
  LoaderSettingsApiService,
  OrgDataLoaderConfigurationApiService,
  SftpUserApiService,
  PricingLoaderApiService
} from './data-loads';
import { ProjectApiService } from './project';
import { IntegrationApiService } from './integration';
import { ComphubApiService } from './comphub';
import { FileApiService } from './file';
import { TagApiService } from './tags';
import { SurveyApiService } from './surveys';
import { PermissionService, RemoteDataSourceService } from '../../core/services';
import { DataViewApiService, ReportManagementApiService, TableauReportApiService, UserReportApiService } from './reports';
import { NotificationsApiService } from './notifications';
import { StructuresApiService, StructureRangeGroupApiService, StructureModelingApiService } from './structures';
import {
  AuthenticationTypesHrisApiService,
  ConnectionsHrisApiService,
  HrisApiService,
  MappingsHrisApiService,
  OnDemandSyncHrisApiService,
  ProvidersHrisApiService,
  SyncScheduleHrisApiService,
  TransferMethodsHrisApiService
} from './hris-api';
import { ExchangeSignupFormApiService } from './form';
import { SurveyLibraryApiService } from './survey-library';
import { CompanyResourcesApiService } from './company-resources';
import { ConfigurationGroupApiService, OrganizationalDataApiService } from './organizational-data';
import { JobsApiService } from './jobs';
import {DataImportApiService} from './integration/data-import';
import { TotalRewardsApiService, TotalRewardsSearchApiService } from './total-rewards';
import { SsoConfigApiService } from './sso';
import { CurrencyApiService } from './currency';
import { CompositeFieldApiService } from './composite-field';
import { PricingApiService } from './pricing';
import { PricingLegacyApiService } from './pricing-legacy';
import { CountryApiService } from './country';
import { EntityKeysValidationApiService } from './validation';
import { CaptchaApiService } from './captcha';
import { ECommerceApiService } from './ecommerce';
import { MarketDataFeedApiService } from './market-data-feed';

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
    JobDescriptionWorkflowStepUserApiService,
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
    ExchangeJobSearchApiService,
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
    TotalRewardsSearchApiService,
    SsoConfigApiService,
    CurrencyApiService,
    CompositeFieldApiService,
    PricingLegacyApiService,
    PricingApiService,
    CountryApiService,
    CompanyEmployeeApiService,
    EntityKeysValidationApiService,
    StructureModelingApiService,
    OrgDataLoaderConfigurationApiService,
    SftpUserApiService,
    PricingLoaderApiService,
    CaptchaApiService,
    ExchangeSignupFormApiService,
    ECommerceApiService,
    MarketDataFeedApiService,

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
    SyncScheduleHrisApiService,
    OnDemandSyncHrisApiService,
  ]
})
export class PfApiModule { }
