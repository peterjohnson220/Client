import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

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
    PfCommonUIModule,
    // Routing
    AppRoutingModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
