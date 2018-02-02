import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { PfApiModule } from 'libs/data/payfactors-api';
import { PfStateModule } from 'libs/state/state.module';
import { PfCommonUIModule } from 'libs/ui/common/common-ui-module';
import { PfAppRootModule, AppComponent } from 'libs/features/app-root';

import { AppRoutingModule } from './app-routing.module';
import { environment } from '../../../../environments/environment';
import { MapService, NgxMapboxGLModule } from 'ngx-mapbox-gl';

@NgModule({
  imports: [
    // Angular
    BrowserModule,

    // PF Modules
    PfCommonUIModule,
    PfStateModule,
    PfApiModule,
    PfAppRootModule,

    // Routing
    AppRoutingModule,


    NgxMapboxGLModule.forRoot({accessToken: environment.mapboxAccessToken})
  ],
  providers: [
    MapService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
