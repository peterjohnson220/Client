import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { PayfactorsApiService } from './payfactors-api.service';
import { NavigationApiService } from './navigation';
import { UiPersistenceSettingsApiService, CompanySettingsApiService } from './settings';
import { AccountApiService} from './auth';
import { PayMarketApiService } from './paymarket';
import { ExchangeApiService, ExchangeCompanyApiService, ExchangeDataSearchApiService, ExchangeScopeApiService } from './peer';
import { CompanySecurityApiService } from './security';
import { SurveySearchApiService } from './surveys';
import { DashboardApiService } from './dashboard';
import { UserApiService } from './user';
import { CompanyApiService } from './company';
import { JobDescriptionApiService, JobDescriptionManagementApiService } from './jdm';
import { UserProfileApiService } from './user-profile';
import { TermsConditionsApiService } from './terms-conditions';
import { OrgDataFieldMappingsApiService } from './org-data-loader';

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
    JobDescriptionApiService,
    TermsConditionsApiService,
    SurveySearchApiService,
    ExchangeScopeApiService,
    CompanySettingsApiService,
    OrgDataFieldMappingsApiService
  ]
})
export class PfApiModule { }



