import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';

import { PfApiModule } from 'libs/data/payfactors-api';
import { PfStateModule } from 'libs/state/state.module';
import { PfCommonUIModule } from 'libs/ui/common/common-ui-module';
import { PfSecurityModule } from 'libs/security/security.module';
import { SentryErrorHandler, SentryService } from 'libs/core/services';

import { AppComponent } from './app.component';
import { AppWrapperComponent } from './app-wrapper.component';
import { AppRoutingModule } from './app-routing.module';
import { AuthLayoutWrapperComponent } from './auth-layout-wrapper.component';

@NgModule({
  declarations: [
    AppComponent,
    AppWrapperComponent,
    AuthLayoutWrapperComponent
  ],
  imports: [
    // Angular
    BrowserModule,

    // PF Modules
    PfApiModule,
    PfSecurityModule,
    PfStateModule,
    PfCommonUIModule,

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
