import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { GridModule } from '@progress/kendo-angular-grid';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { ChartModule } from '@progress/kendo-angular-charts';
import {
  NgbModalModule,
  NgbPaginationModule,
  NgbProgressbarModule,
  NgbTooltipModule
} from '@ng-bootstrap/ng-bootstrap';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';

import { PfCommonModule } from 'libs/core';
import { WindowRef } from 'libs/core/services';
import { PfFormsModule } from 'libs/forms';
import { PfCommonUIModule } from 'libs/ui/common';

import * as fromFaIcons from './fa-icons';
import { JobRangeModelingPageEffects } from './effects';
import { reducers } from './reducers';
import { MainRoutingModule } from './main-routing.module';
import { ModelNameInputComponent, ModelingSettingsComponent } from './components';
import { JobRangeModelingPageComponent } from './containers/pages';

@NgModule({
  imports: [
    // Angular
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    // 3rd Party
    StoreModule.forFeature('structures_main', reducers),
    EffectsModule.forFeature([
      JobRangeModelingPageEffects
    ]),
    PerfectScrollbarModule,
    FontAwesomeModule,

    // Routing
    MainRoutingModule,

    // 3rd Party
    DropDownsModule,
    GridModule,
    ChartModule,
    NgbPaginationModule,
    NgbModalModule,
    NgbProgressbarModule,
    NgbTooltipModule,

    // Payfactors
    PfCommonModule,
    PfCommonUIModule,
    PfFormsModule
  ],
  declarations: [
    // Components
    ModelNameInputComponent,
    ModelingSettingsComponent,

    // Pages
    JobRangeModelingPageComponent
  ],
  providers: [
    WindowRef
  ]
})
export class MainModule {
  constructor() {
    library.add(...fromFaIcons.faIcons);
  }
}
