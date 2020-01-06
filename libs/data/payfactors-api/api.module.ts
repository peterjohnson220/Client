import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { PayfactorsApiService } from './payfactors-api.service';
import { NavigationApiService } from './navigation';
import { UiPersistenceSettingsApiService, CompanySettingsApiService } from './settings';
import { AccountApiService} from './auth';
import { PayMarketApiService } from './paymarket';
import {
  ExchangeApiService, ExchangeCompanyApiService,
  ExchangeScopeApiService, ExchangeDataCutsApiService, ExchangeDataFilterApiService
} from './peer';
import { CompanySecurityApiService } from './security';
import { SurveySearchApiService, JobSearchApiService, ExchangeDataSearchApiService } from './search';
import { DashboardApiService } from './dashboard';
import { UserApiService, UserFilterApiService, UserProfileApiService } from './user';
import { CompanyApiService } from './company';
import { JobDescriptionApiService, JobDescriptionManagementApiService, JobDescriptionWorkflowApiService,
  JobDescriptionWorkflowTemplateApiService, JobDescriptionTemplateApiService, JobDescriptionFooterViewApiService } from './jdm';
import { TermsConditionsApiService } from './terms-conditions';
import { AppEnvironmentApiService } from './app-environment';
import { UserTicketApiService } from './service';
import { CompanyJobApiService } from './company';
import { CompanyJobPricingMatchApiService } from './company-job-pricing-match';
import { RolesApiService } from './company-admin';
import { LoaderFieldMappingsApiService, DataLoadEmailRecipientsApiService, LoaderSettingsApiService } from './data-loads';
import { ProjectApiService } from './project';
import { IntegrationApiService } from './integration';
import { ComphubApiService } from './comphub';
import { MarketDataScopeApiService } from './paymarket';
import { FileApiService } from './file';
import { TagApiService } from './tags';
import { SurveyApiService } from './surveys';
import { PermissionService, RemoteDataSourceService } from '../../core/services';
import { TableauReportApiService, UserReportApiService, ReportManagementApiService, DataViewApiService } from './reports';
import { NotificationsApiService } from './notifications';
import { StructuresApiService, StructuresRangeGroupApiService } from './structures';
import { HrisApiService, ProvidersHrisApiService, TransferMethodsHrisApiService,
  AuthenticationTypesHrisApiService,
  ConnectionsHrisApiService, MappingsHrisApiService } from './hris-api';
import { SurveyLibraryApiService } from './survey-library';
import { CompanyResourcesApiService } from './company-resources';
import {OrganizationalDataApiService} from './organizational-data';
import {JobsApiService} from './jobs';
import {PricingApiService} from './pricings';


@NgModule({
  imports:      [ HttpClientModule ],
  providers:    [
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
    StructuresRangeGroupApiService,
    DataViewApiService,
    NotificationsApiService,
    SurveyLibraryApiService,
    CompanyResourcesApiService,
    OrganizationalDataApiService,
    PricingApiService,

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
    MappingsHrisApiService
  ]
})
export class PfApiModule { }
