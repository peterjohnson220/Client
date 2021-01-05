import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { NgbProgressbarModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

import { PfApiModule } from 'libs/data/payfactors-api';
import { PfStateModule } from 'libs/state/state.module';
import { PfAppRootModule, AppComponent } from 'libs/features/infrastructure/app-root';
import { SentryService, SentryErrorHandler, WindowCommunicationService } from 'libs/core/services';

import { AppRoutingModule } from './app-routing.module';
import { RouteReuseStrategy } from '@angular/router';
import { CustomRouteReuseStrategy } from './route-reuse-strategy';

@NgModule({
  imports: [
    // Angular
    BrowserAnimationsModule,

    // Third Party
    NgbProgressbarModule,
    NgbTooltipModule,

    // PF Modules
    PfStateModule,
    PfApiModule,
    PfAppRootModule,

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
