import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { PfLayoutWrapperModule } from '../../../../libs/ui/layout-wrapper';
import { PfApiModule } from '../../../../libs/data/payfactors-api';
import { PfStateModule } from '../../../../libs/state/state.module';
import { PfSecurityModule } from '../../../../libs/security/security.module';
import { PfCommonUIModule } from '../../../../libs/ui/common/common-ui-module';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { MainComponent } from './main.component';


@NgModule({
  declarations: [
    AppComponent,
    MainComponent
  ],
  imports: [
    // Angular
    BrowserModule,

    // PF Modules
    PfCommonUIModule,
    PfSecurityModule,
    PfLayoutWrapperModule,
    PfApiModule,
    PfStateModule,

    // Routing
    AppRoutingModule

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
