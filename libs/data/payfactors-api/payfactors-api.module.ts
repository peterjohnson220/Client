import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { CompanySecurityApiService } from './company-security-api.service';

@NgModule({
  imports:      [ HttpClientModule ],
  providers:    [ CompanySecurityApiService ]
})
export class PayfactorsApiModule { }
