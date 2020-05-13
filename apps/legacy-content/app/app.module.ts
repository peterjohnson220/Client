import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ErrorHandler, NgModule } from '@angular/core';

import { PfApiModule } from 'libs/data/payfactors-api';
import { PfStateModule } from 'libs/state/state.module';
import { PfCommonUIModule } from 'libs/ui/common/common-ui-module';
import { PfAppRootModule, AppComponent } from 'libs/features/app-root';
import { PfSecurityModule } from 'libs/security/security.module';
import { SentryErrorHandler, SentryService } from 'libs/core/services';

import { AppRoutingModule } from './app-routing.module';
import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  imports: [
    // Angular
    BrowserAnimationsModule,

    // 3rd Party
    NgbPopoverModule.forRoot(),

    // PF Modules
    PfCommonUIModule,
    PfStateModule,
    PfApiModule,
    PfAppRootModule,
    PfSecurityModule,

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
