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
import { SurveySearchApiService } from './surveys';
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
import { CompanyAdminApiService } from './company-admin';

@NgModule({
  imports:      [ HttpClientModule ],
  providers:    [
    CompanyApiService,
    CompanyAdminApiService,
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
    CompanyJobPricingMatchApiService
  ]
})
export class PfApiModule { }



