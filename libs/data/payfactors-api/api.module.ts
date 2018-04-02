import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { PayfactorsApiService } from './payfactors-api.service';
import { NavigationApiService } from './navigation';
import { ClientSettingsApiService} from './client-settings';
import { PayMarketApiService } from './paymarket';
import { ExchangeApiService, ExchangeCompanyApiService, ExchangeDataSearchApiService } from './peer';
import { CompanySecurityApiService } from './security';
import { DashboardApiService } from './dashboard';
import { UserApiService } from './user';
import { CompanyApiService } from './company/company-api.service';

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
    ClientSettingsApiService,
    PayMarketApiService,
    PayfactorsApiService
  ]
})
export class PfApiModule { }



