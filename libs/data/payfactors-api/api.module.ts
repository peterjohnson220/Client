import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { PayfactorsApiService } from './payfactors-api.service';
import { NavigationApiService } from './navigation';
import { ExchangeApiService, ExchangeCompanyApiService } from './peer';
import { CompanySecurityApiService } from './security';
import { DashboardApiService } from './dashboard';
import { ProductAssetsApiService } from './product-assets';

@NgModule({
  imports:      [ HttpClientModule ],
  providers:    [
    CompanySecurityApiService,
    DashboardApiService,
    ExchangeApiService,
    ExchangeCompanyApiService,
    NavigationApiService,
    PayfactorsApiService,
    ProductAssetsApiService,
  ]
})
export class PfApiModule { }



