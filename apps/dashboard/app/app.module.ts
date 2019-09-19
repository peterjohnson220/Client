import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

import { PfLayoutWrapperModule } from 'libs/ui/layout-wrapper';
import { PfApiModule } from 'libs/data/payfactors-api';
import { PfStateModule } from 'libs/state/state.module';
import { PfSecurityModule } from 'libs/security/security.module';
import { PfCommonUIModule } from 'libs/ui/common/common-ui-module';
import { PfAppRootModule, AppComponent } from 'libs/features/app-root';

import { AppRoutingModule } from './app-routing.module';
import { AppWrapperComponent } from './app-wrapper.component';

@NgModule({
  declarations: [
    AppWrapperComponent
  ],
  imports: [
    // Angular
    BrowserModule,
    BrowserAnimationsModule,

    // PF Modules
    PfAppRootModule,
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
