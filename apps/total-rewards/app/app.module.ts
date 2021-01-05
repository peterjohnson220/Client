import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { PfApiModule } from 'libs/data/payfactors-api';
import { PfAppRootModule, AppComponent } from 'libs/features/infrastructure/app-root';
import { PfSecurityModule } from 'libs/security/security.module';
import { PfStateModule } from 'libs/state/state.module';
import { PfCommonUIModule } from 'libs/ui/common/common-ui-module';
import { PfLayoutWrapperModule } from 'libs/ui/layout-wrapper';
import { JwtQueryStringAuthInterceptor, UnauthorizedHttpInterceptor, SentryErrorHandler, SentryService } from 'libs/core/services';
import { PfCommonModule } from 'libs/core';

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
    PfCommonModule,

    // Routing
    AppRoutingModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtQueryStringAuthInterceptor,
      multi: true
    },
    { provide: ErrorHandler, useClass: SentryErrorHandler },
    { provide: HTTP_INTERCEPTORS, useClass: UnauthorizedHttpInterceptor, multi: true },
    SentryService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
