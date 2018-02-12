import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { NgxMapboxGLModule } from 'ngx-mapbox-gl';

import { environment } from 'environments/environment';
import { PfFormsModule } from 'libs/forms';
import { PfCommonUIModule } from 'libs/ui/common';
import { WindowCommunicationService } from 'libs/core/services';

import { AddDataCutPageComponent, FiltersComponent, MapComponent } from './containers';
import { PeerRoutingModule } from './peer-routing.module';
import { GeocoderDirective } from './directives';
import { PeerMapEffects } from './effects';
import { reducers } from './reducers';
import { MultiSelectModule } from '@progress/kendo-angular-dropdowns';
import { FilterComponent } from './components';

@NgModule({
  imports: [
    // Angular
    CommonModule,

    // 3rd party
    StoreModule.forFeature('peerData', reducers),
    EffectsModule.forFeature([
      PeerMapEffects
    ]),
    NgxMapboxGLModule.forRoot({accessToken: environment.mapboxAccessToken}),
    MultiSelectModule,

    // Routing
    PeerRoutingModule,

    // Payfactors
    PfCommonUIModule,
    PfFormsModule
  ],
  declarations: [
    // Components
    FilterComponent,

    // Containers
    FiltersComponent, MapComponent,

    // Pages
    AddDataCutPageComponent,

    // Directives
    GeocoderDirective
  ],
  providers: [
    WindowCommunicationService
  ]
})
export class PeerModule { }
