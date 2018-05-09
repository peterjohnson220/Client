import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { PfApiModule } from 'libs/data/payfactors-api';
import { PfStateModule } from 'libs/state/state.module';
import { PfCommonUIModule } from 'libs/ui/common/common-ui-module';

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
    PfStateModule,
    PfCommonUIModule,

    // Routing
    AppRoutingModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
