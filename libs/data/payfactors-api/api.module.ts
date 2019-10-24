import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { PayfactorsApiService } from './payfactors-api.service';
import { NavigationApiService } from './navigation';
import { UiPersistenceSettingsApiService, CompanySettingsApiService } from './settings';
import { AccountApiService} from './auth';
import { PayMarketApiService } from './paymarket';
import { ExchangeApiService, ExchangeCompanyApiService,
         ExchangeScopeApiService, ExchangeDataCutsApiService } from './peer';
import { CompanySecurityApiService } from './security';
import { SurveySearchApiService, JobSearchApiService, ExchangeDataSearchApiService } from './search';
import { DashboardApiService, CompanyResourcesApiService } from './dashboard';
import { UserApiService, UserFilterApiService, UserProfileApiService } from './user';
import { CompanyApiService } from './company';
import { JobDescriptionApiService, JobDescriptionManagementApiService } from './jdm';
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
import { JobDescriptionTemplateApiService } from './jdm';
import { TableauReportApiService, UserReportApiService, ReportManagementApiService, DataViewApiService } from './reports';
import { NotificationsApiService } from './notifications';
import { StructuresApiService, StructuresRangeGroupApiService } from './structures';
import { HrisApiService, ProvidersHrisApiService, TransferMethodsHrisApiService,
  AuthenticationTypesHrisApiService,
  ConnectionsHrisApiService } from './hris-api';
import { SurveyLibraryApiService } from './survey-library';

@NgModule({
  imports:      [ HttpClientModule ],
  providers:    [
    CompanyApiService,
    CompanySecurityApiService,
    DashboardApiService,
    UserApiService,
    ExchangeApiService,
    ExchangeCompanyApiService,
    ExchangeDataSearchApiService,
    NavigationApiService,
    UiPersistenceSettingsApiService,
    AccountApiService,
    PayMarketApiService,
    PayfactorsApiService,
    JobDescriptionManagementApiService,
    UserProfileApiService,
    UserFilterApiService,
    JobDescriptionApiService,
    TermsConditionsApiService,
    SurveySearchApiService,
    ExchangeScopeApiService,
    CompanySettingsApiService,
    LoaderFieldMappingsApiService,
    ExchangeDataCutsApiService,
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
    JobDescriptionTemplateApiService,
    SurveyApiService,
    TableauReportApiService,
    UserReportApiService,
    ReportManagementApiService,
    StructuresApiService,
    StructuresRangeGroupApiService,
    DataViewApiService,
    NotificationsApiService,
    CompanyResourcesApiService,
    SurveyLibraryApiService,

    // Hris Api Services
    HrisApiService,
    TransferMethodsHrisApiService,
    ProvidersHrisApiService,
    AuthenticationTypesHrisApiService,
    ConnectionsHrisApiService
  ]
})
export class PfApiModule { }
