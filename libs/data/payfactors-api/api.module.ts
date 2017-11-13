import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { NavigationApiService } from './navigation';
import { CompanySecurityApiService } from './security';

@NgModule({
  imports:      [ HttpClientModule ],
  providers:    [
    CompanySecurityApiService, NavigationApiService
  ]
})
export class PFApiModule { }
