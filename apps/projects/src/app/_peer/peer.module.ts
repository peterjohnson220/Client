import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EffectsModule } from '@ngrx/effects';
import { GridModule } from '@progress/kendo-angular-grid';
import { StoreModule } from '@ngrx/store';

import { PfFormsModule } from 'libs/forms';
import { PfCommonUIModule } from 'libs/ui/common';
import { PfSharedPeerModule } from 'libs/features';

import { AddDataCutPageComponent, FiltersComponent, MapComponent } from './containers';
import { ExchangeListEffects, ExchangeJobMappingEffects } from './effects';
import { reducers } from './reducers';
import { ExchangeJobMappingService } from './services';
import { PeerRoutingModule } from './peer-routing.module';
import { NgxMapboxGLModule } from 'ngx-mapbox-gl';
import { environment } from 'environments/environment';

@NgModule({
  imports: [
    // Angular
    CommonModule,

    // 3rd party
    GridModule,
    StoreModule.forFeature('peerMain', reducers),
    EffectsModule.forFeature([ExchangeJobMappingEffects, ExchangeListEffects]),
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
    AddDataCutPageComponent
  ],
  providers: [
    ExchangeJobMappingService
  ]
})
export class PeerModule { }








