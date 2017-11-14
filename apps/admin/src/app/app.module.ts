import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { PFLayoutWrapperModule } from '../../../../libs/ui/layout-wrapper';
import { PFApiModule } from '../../../../libs/data/payfactors-api';
import { PFStateModule } from '../../../../libs/state/state.module';
import { PfSecurityModule } from '../../../../libs/security/security.module';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { MainComponent } from './main.component';
import { PFCommonUIModule } from '../../../../libs/ui/common/common-ui-module';

@NgModule({
  declarations: [
    AppComponent,
    MainComponent
  ],
  imports: [
    // Angular
    BrowserModule,

    // PF Modules
    PfSecurityModule,
    PFLayoutWrapperModule,
    PFApiModule,
    PFStateModule,
    PFCommonUIModule,

    // Routing
    AppRoutingModule

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
