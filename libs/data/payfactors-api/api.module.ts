import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { PayfactorsApiService } from './payfactors-api.service';
import { NavigationApiService } from './navigation';
import { ExchangeApiService } from './peer';
import { CompanySecurityApiService } from './security';

@NgModule({
  imports:      [ HttpClientModule ],
  providers:    [
    CompanySecurityApiService,
    ExchangeApiService,
    NavigationApiService,
    PayfactorsApiService,
  ]
})
export class PfApiModule { }



