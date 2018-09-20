import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { Ng5SliderModule } from 'ng5-slider';

import { PfApiModule } from 'libs/data/payfactors-api';
import { PfStateModule } from 'libs/state/state.module';
import { PfAppRootModule, AppComponent } from 'libs/features/app-root';
import { WindowCommunicationService } from 'libs/core/services';

import { AppRoutingModule } from './app-routing.module';

@NgModule({
  imports: [
    // Angular
    BrowserModule,

    // PF Modules
    PfStateModule,
    PfApiModule,
    PfAppRootModule,

    // Routing
    AppRoutingModule,

    // 3rd Party
    Ng5SliderModule
  ],
  providers: [
    WindowCommunicationService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
