import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';

import { PfApiModule } from 'libs/data/payfactors-api';
import { PfAppRootModule, AppComponent } from 'libs/features/app-root';
import { PfSecurityModule } from 'libs/security/security.module';
import { PfStateModule } from 'libs/state/state.module';
import { PfCommonUIModule } from 'libs/ui/common/common-ui-module';
import { PfLayoutWrapperModule } from 'libs/ui/layout-wrapper';
import { SentryErrorHandler, SentryService } from 'libs/core/services';

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
    // Routing
    AppRoutingModule
  ],
  providers: [
    { provide: ErrorHandler, useClass: SentryErrorHandler },
    SentryService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
