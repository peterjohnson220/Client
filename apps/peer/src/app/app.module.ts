import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { PfLayoutWrapperModule } from 'libs/ui/layout-wrapper';
import { PfApiModule } from 'libs/data/payfactors-api';
import { PfStateModule } from 'libs/state/state.module';
import { PfSecurityModule } from 'libs/security/security.module';
import { PfCommonUIModule } from 'libs/ui/common/common-ui-module';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AppWrapperComponent } from './app-wrapper.component';
import { PfLayoutWrapperOldModule } from 'libs/ui/layout-wrapper-old';


@NgModule({
  declarations: [
    AppComponent,
    AppWrapperComponent
  ],
  imports: [
    // Angular
    BrowserModule,

    // PF Modules
    PfCommonUIModule,
    PfLayoutWrapperOldModule,
    PfSecurityModule,
    PfStateModule,
    PfApiModule,

    // Routing
    AppRoutingModule

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
