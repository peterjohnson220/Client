import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { SwitchModule } from '@progress/kendo-angular-inputs';
import { NgxMapboxGLModule } from 'ngx-mapbox-gl';
import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';

import { environment } from 'environments/environment';

import { PfCommonUIModule } from 'libs/ui/common/common-ui-module';
import { PfFormsModule } from 'libs/forms';

import {
  FilterAggregateComponent,
  FilterAggregateGroupComponent,
  ExcludeIndirectMatchesFilterComponent,
  PayMarketBoundsFilterComponent,
  PeerFilterInfoComponent
} from './components';
import { FilterSidebarComponent, MapComponent, ScopeSelectorComponent } from './containers';
import { FilterSidebarEffects, MapEffects, ExchangeScopeEffects } from './effects';
import { reducers } from './reducers';
import * as fromFaIcons from './fa-icons';
import {ExchangeJobSelectorComponent} from '../exchange-job-selector';

const declarations = [
  // Components
  FilterAggregateComponent, FilterAggregateGroupComponent, PayMarketBoundsFilterComponent, PeerFilterInfoComponent,
  ExcludeIndirectMatchesFilterComponent, ExchangeJobSelectorComponent,

  // Containers
  FilterSidebarComponent, MapComponent, ScopeSelectorComponent
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,

    // PF Modules
    PfCommonUIModule,
    PfFormsModule,

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
    FontAwesomeModule
  ],
  declarations: declarations,
  exports: declarations
})
export class PfPeerMapModule {
  constructor() {
    library.add(...fromFaIcons.faIcons);
  }
}
