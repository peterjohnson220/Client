import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgxMapboxGLModule } from 'ngx-mapbox-gl';

import { PfFormsModule } from 'libs/forms';
import { PfCommonUIModule } from 'libs/ui/common';
import { PfSharedPeerModule } from 'libs/features';

import { AddDataCutPageComponent, FiltersComponent, MapComponent } from './containers';
import { PeerRoutingModule } from './peer-routing.module';
import { environment } from 'environments/environment';
import { GeocoderDirective } from './directives';
@NgModule({
  imports: [
    // Angular
    CommonModule,

    // 3rd party
    NgxMapboxGLModule.forRoot({accessToken: environment.mapboxAccessToken}),

    // Routing
    PeerRoutingModule,

    // Payfactors
    PfCommonUIModule,
    PfSharedPeerModule,
    PfFormsModule
  ],
  declarations: [
    // Containers
    FiltersComponent, MapComponent,

    // Pages
    AddDataCutPageComponent,

    // Directives
    GeocoderDirective,

    // Third party
  ]
})
export class PeerModule { }
