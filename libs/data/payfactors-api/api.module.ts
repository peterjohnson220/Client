import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { PayfactorsApiService } from './payfactors-api.service';

import { DashboardApiService } from './dashboard';
import { NavigationApiService } from './navigation';
import { ExchangeApiService } from './peer';
import { ProductAssetsApiService } from './product-assets';
import { CompanySecurityApiService } from './security';


@NgModule({
  imports:      [ HttpClientModule ],
  providers:    [
    CompanySecurityApiService,
    DashboardApiService,
    ExchangeApiService,
    NavigationApiService,
    PayfactorsApiService,
    ProductAssetsApiService,
  ]
})
export class PfApiModule { }



