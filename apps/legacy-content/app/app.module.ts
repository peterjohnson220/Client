import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ErrorHandler, NgModule } from '@angular/core';
import { RouteReuseStrategy } from '@angular/router';

import { NgbPopoverModule, NgbProgressbarModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

import { PfApiModule } from 'libs/data/payfactors-api';
import { PfStateModule } from 'libs/state/state.module';
import { PfCommonUIModule } from 'libs/ui/common/common-ui-module';
import { PfAppRootModule, AppComponent } from 'libs/features/app-root';
import { PfSecurityModule } from 'libs/security/security.module';
import { SentryErrorHandler, SentryService, WindowCommunicationService } from 'libs/core/services';

import { AppRoutingModule } from './app-routing.module';
import { CustomRouteReuseStrategy } from './route-reuse-strategy';

@NgModule({
  imports: [
    // Angular
    BrowserAnimationsModule,

    // 3rd Party
    NgbPopoverModule,
    NgbProgressbarModule,
    NgbTooltipModule,

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
    WindowCommunicationService,
    { provide: RouteReuseStrategy, useClass: CustomRouteReuseStrategy },
    { provide: ErrorHandler, useClass: SentryErrorHandler },
    SentryService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
