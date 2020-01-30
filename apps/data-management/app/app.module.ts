import { NgModule } from '@angular/core';

import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import {DropDownsModule} from '@progress/kendo-angular-dropdowns';

import { JwtAuthInterceptor } from 'libs/core/services/jwt-auth-interceptor.service';
import { PfApiModule } from 'libs/data/payfactors-api';
import { AppComponent, PfAppRootModule } from 'libs/features/app-root';
import { PfCompanySelectorModule } from 'libs/features/company/company-selector.module';
import { PfSecurityModule } from 'libs/security/security.module';
import { PfStateModule } from 'libs/state/state.module';
import { PfCommonUIModule } from 'libs/ui/common/common-ui-module';
import { PfLayoutWrapperModule } from 'libs/ui/layout-wrapper';

import { AppRoutingModule } from './app-routing.module';

@NgModule({
  imports: [
    // Angular
    BrowserModule,

    // PF Modules
    PfApiModule,
    PfAppRootModule,
    PfCommonUIModule,
    PfLayoutWrapperModule,
    PfSecurityModule,
    PfStateModule,
    PfCompanySelectorModule,

    // Routing
    AppRoutingModule,

    // Kendo
    DropDownsModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtAuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
