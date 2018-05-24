import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { SwitchModule } from '@progress/kendo-angular-inputs';
import { NgxMapboxGLModule } from 'ngx-mapbox-gl';

import { environment } from 'environments/environment';

import {
  FilterAggregateComponent,
  FilterAggregateGroupComponent,
  PayMarketBoundsFilterComponent,
  PayMarketFilterInfoComponent
} from './components';
import { FilterSidebarComponent, MapComponent} from './containers';
import { FilterSidebarEffects, MapEffects } from './effects';
import { reducers } from './reducers';

const declarations = [
  // Components
  FilterAggregateComponent, FilterAggregateGroupComponent, PayMarketBoundsFilterComponent, PayMarketFilterInfoComponent,

  // Containers
  FilterSidebarComponent, MapComponent
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,

    // 3rd Party
    SwitchModule,
    StoreModule.forFeature('feature_peerMap', reducers),
    EffectsModule.forFeature([
      MapEffects,
      FilterSidebarEffects
    ]),
    NgxMapboxGLModule.forRoot({accessToken: environment.mapboxAccessToken}),

    // Payfactors

  ],
  declarations: declarations,
  exports: declarations
})
export class PfPeerMapModule { }
