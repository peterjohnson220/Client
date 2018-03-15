import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { PayfactorsApiService } from './payfactors-api.service';
import { NavigationApiService } from './navigation';
import { ClientSettingsApiService} from './client-settings';
import { ExchangeApiService, ExchangeCompanyApiService, ExchangeDataSearchApiService } from './peer';
import { CompanySecurityApiService } from './security';
import { DashboardApiService } from './dashboard';
import { UserApiService } from './user';

@NgModule({
  imports:      [ HttpClientModule ],
  providers:    [
    CompanySecurityApiService,
    DashboardApiService,
    UserApiService,
    ExchangeApiService,
    ExchangeCompanyApiService,
    ExchangeDataSearchApiService,
    NavigationApiService,
    ClientSettingsApiService,
    PayfactorsApiService
  ]
})
export class PfApiModule { }



