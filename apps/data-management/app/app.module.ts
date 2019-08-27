import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { BrowserModule } from '@angular/platform-browser';

import { PfApiModule } from 'libs/data/payfactors-api';
import { AppComponent, PfAppRootModule } from 'libs/features/app-root';
import { PfSecurityModule } from 'libs/security/security.module';
import { PfStateModule } from 'libs/state/state.module';
import { PfCommonUIModule } from 'libs/ui/common/common-ui-module';
import { PfLayoutWrapperModule } from 'libs/ui/layout-wrapper';
import { JwtAuthInterceptor } from 'libs/core/services/jwt-auth-interceptor.service';

import { AppRoutingModule } from './app-routing.module';

@NgModule({
  imports: [
    // Angular
    BrowserModule,
    HttpClientModule,

    // PF Modules
    PfApiModule,
    PfAppRootModule,
    PfCommonUIModule,
    PfLayoutWrapperModule,
    PfSecurityModule,
    PfStateModule,

    // Routing
    AppRoutingModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtAuthInterceptor, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
