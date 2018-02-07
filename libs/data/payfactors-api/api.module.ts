import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { PayfactorsApiService } from './payfactors-api.service';
import { NavigationApiService } from './navigation';
import { ExchangeApiService, ExchangeCompanyApiService } from './peer';
import { CompanySecurityApiService } from './security';
import { DashboardApiService } from './dashboard';

@NgModule({
  imports:      [ HttpClientModule ],
  providers:    [
    CompanySecurityApiService,
    DashboardApiService,
    ExchangeApiService,
    ExchangeCompanyApiService,
    NavigationApiService,
    PayfactorsApiService
  ]
})
export class PfApiModule { }



