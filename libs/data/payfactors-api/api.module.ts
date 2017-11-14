import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { PayfactorsApiService } from './payfactors-api.service';
import { NavigationApiService } from './navigation';
import { CompanySecurityApiService } from './security';

@NgModule({
  imports:      [ HttpClientModule ],
  providers:    [
    PayfactorsApiService,
    CompanySecurityApiService,
    NavigationApiService
  ]
})
export class PFApiModule { }
