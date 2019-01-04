import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { NgbProgressbarModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

import { PfApiModule } from 'libs/data/payfactors-api';
import { PfStateModule } from 'libs/state/state.module';
import { PfAppRootModule, AppComponent } from 'libs/features/app-root';
import { WindowCommunicationService } from 'libs/core/services';

import { AppRoutingModule } from './app-routing.module';
import { RouteReuseStrategy } from '@angular/router';
import { CustomRouteReuseStrategy } from './route-reuse-strategy';

@NgModule({
  imports: [
    // Angular
    BrowserAnimationsModule,

    // Third Party
    NgbProgressbarModule.forRoot(),
    NgbTooltipModule.forRoot(),

    // PF Modules
    PfStateModule,
    PfApiModule,
    PfAppRootModule,

    // Routing
    AppRoutingModule
  ],
  providers: [
    WindowCommunicationService,
    { provide: RouteReuseStrategy, useClass: CustomRouteReuseStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
