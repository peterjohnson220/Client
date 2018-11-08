import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { PfApiModule } from 'libs/data/payfactors-api';
import { PfStateModule } from 'libs/state/state.module';
import { PfAppRootModule, AppComponent } from 'libs/features/app-root';
import { WindowCommunicationService } from 'libs/core/services';

import { AppRoutingModule } from './app-routing.module';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  imports: [
    // Angular
    BrowserModule,

    // Third Party
    NgbModalModule,

    // PF Modules
    PfStateModule,
    PfApiModule,
    PfAppRootModule,

    // Routing
    AppRoutingModule
  ],
  providers: [
    WindowCommunicationService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
