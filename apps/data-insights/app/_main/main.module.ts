import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';

import { PfCommonModule } from 'libs/core';
import { PfFormsModule } from 'libs/forms';
import { PfCommonUIModule } from 'libs/ui/common';

import * as fromFaIcons from './fa-icons';
import { reducers } from './reducers';
import { AllDashboardsEffects } from './effects';
import { MainRoutingModule } from './main-routing.module';
import { DataInsightsPageComponent, AllDashboardsComponent } from './containers';

@NgModule({
  imports: [
    // Angular
    CommonModule,

    // 3rd Party
    StoreModule.forFeature('datainsights_main', reducers),
    EffectsModule.forFeature([
      AllDashboardsEffects
    ]),
    FontAwesomeModule,

    // Routing
    MainRoutingModule,

    // Payfactors
    PfCommonModule,
    PfCommonUIModule,
    PfFormsModule
  ],
  declarations: [
    // Pages
    DataInsightsPageComponent,

    // Containers
    AllDashboardsComponent
  ]
})
export class MainModule {
  constructor() {
    library.add(...fromFaIcons.faIcons);
  }
}
