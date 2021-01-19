import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';

import { PfApiModule } from 'libs/data/payfactors-api';
import { PfStateModule } from 'libs/state/state.module';
import { PfAppRootModule, AppComponent } from 'libs/features/app-root';
import { SentryService, SentryErrorHandler } from 'libs/core/services';
import { PfLayoutWrapperModule } from 'libs/ui/layout-wrapper';
import { PfCommonUIModule } from 'libs/ui/common/common-ui-module';
import { PfSecurityModule } from 'libs/security/security.module';

import { AppRoutingModule } from './app-routing.module';

@NgModule({
  imports: [
    // Angular
    BrowserModule,
    BrowserAnimationsModule,

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
