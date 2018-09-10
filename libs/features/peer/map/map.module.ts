import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { SwitchModule } from '@progress/kendo-angular-inputs';
import { NgxMapboxGLModule } from 'ngx-mapbox-gl';
import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';

import { environment } from 'environments/environment';
import { PfNgBootstrapExtensionModule } from 'libs/extensions/ng-bootstrap';

import {
  FilterAggregateComponent,
  FilterAggregateGroupComponent,
  PayMarketBoundsFilterComponent,
  PayMarketFilterInfoComponent
} from './components';
import { FilterSidebarComponent, MapComponent, ScopeSelectorComponent } from './containers';
import { FilterSidebarEffects, MapEffects } from './effects';
import { reducers } from './reducers';
import {ExchangeScopeEffects} from './effects/exchange-scope.effects';

const declarations = [
  // Components
  FilterAggregateComponent, FilterAggregateGroupComponent, PayMarketBoundsFilterComponent, PayMarketFilterInfoComponent,

  // Containers
  FilterSidebarComponent, MapComponent, ScopeSelectorComponent
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
      FilterSidebarEffects,
      ExchangeScopeEffects
    ]),
    NgxMapboxGLModule.withConfig({accessToken: environment.mapboxAccessToken}),
    NgbPopoverModule,

    // Payfactors
    PfNgBootstrapExtensionModule
  ],
  declarations: declarations,
  exports: declarations
})
export class PfPeerMapModule { }
