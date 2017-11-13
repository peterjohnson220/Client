import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { PFLayoutWrapperModule } from '../../../../libs/ui/layout-wrapper';
import { PFApiModule } from '../../../../libs/data/payfactors-api';
import { PFAppStateModule } from '../../../../libs/app-state/app-state.module';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    // Angular
    BrowserModule,

    // PF Modules
    // PFLayoutWrapperModule,
    PFApiModule,
    PFAppStateModule,

    // Routing
    AppRoutingModule

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
