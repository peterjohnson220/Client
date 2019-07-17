import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { PayfactorsApiService } from './payfactors-api.service';
import { NavigationApiService } from './navigation';
import { UiPersistenceSettingsApiService, CompanySettingsApiService } from './settings';
import { AccountApiService} from './auth';
import { PayMarketApiService } from './paymarket';
import { ExchangeApiService, ExchangeCompanyApiService, ExchangeDataSearchApiService,
         ExchangeScopeApiService, ExchangeDataCutsApiService } from './peer';
import { CompanySecurityApiService } from './security';
import { SurveySearchApiService, JobSearchApiService } from './search';
import { DashboardApiService } from './dashboard';
import { UserApiService, UserFilterApiService, UserProfileApiService } from './user';
import { CompanyApiService } from './company';
import { JobDescriptionApiService, JobDescriptionManagementApiService } from './jdm';
import { TermsConditionsApiService } from './terms-conditions';
import { LoaderFieldMappingsApiService } from './data-loads/index';
import { AppEnvironmentApiService } from './app-environment';
import { UserTicketApiService } from './service';
import { CompanyJobApiService } from './company';
import { CompanyJobPricingMatchApiService } from './company-job-pricing-match';
import { RolesApiService } from './company-admin';
import {DataLoadEmailRecipientsApiService, LoaderSettingsApiService} from './data-loads';
import { ProjectApiService } from './project';
import { IntegrationApiService } from './integration';
import { ComphubApiService } from './comphub';
import { MarketDataScopeApiService } from './paymarket';
import { FileApiService } from './file';
import { TagApiService } from './tags';
import { SurveyApiService } from './surveys';
import { PermissionService, RemoteDataSourceService } from '../../core/services';
import { JobDescriptionTemplateApiService } from './jdm';
import { TableauReportApiService, UserReportApiService, ReportManagementApiService } from './reports';

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
    ReportManagementApiService
  ]
})
export class PfApiModule { }



