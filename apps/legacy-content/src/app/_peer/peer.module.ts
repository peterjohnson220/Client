import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { NgxMapboxGLModule } from 'ngx-mapbox-gl';

import { environment } from 'environments/environment';
import { PfFormsModule } from 'libs/forms';
import { PfCommonUIModule } from 'libs/ui/common';
import { WindowCommunicationService } from 'libs/core/services';

import { AddDataCutPageComponent, FilterSidebarComponent, MapComponent } from './containers';
import { PeerRoutingModule } from './peer-routing.module';
import { GeocoderDirective } from './directives';
import { AddDataCutEffects, PeerMapEffects } from './effects';
import { reducers } from './reducers';
import { FilterCategoryComponent, FilterOptionComponent } from './components';

@NgModule({
  imports: [
    // Angular
    CommonModule,
    FormsModule,

    // 3rd party
    StoreModule.forFeature('peerData', reducers),
    EffectsModule.forFeature([
      AddDataCutEffects,
      PeerMapEffects
    ]),
    NgxMapboxGLModule.forRoot({accessToken: environment.mapboxAccessToken}),

    // Routing
    PeerRoutingModule,

    // Payfactors
    PfCommonUIModule,
    PfFormsModule
  ],
  declarations: [
    // Components
    FilterCategoryComponent, FilterOptionComponent,

    // Containers
    FilterSidebarComponent, MapComponent,

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
