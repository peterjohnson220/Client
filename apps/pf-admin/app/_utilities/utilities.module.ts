import { NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import * as fromFaIcons from './fa-icons';

import { PfCommonUIModule } from 'libs/ui/common';
import { PfFormsModule } from 'libs/forms';
import { PfCommonModule } from 'libs/core';

import { DataListCardComponent, MatchResultsComponent, ScopeSelectorComponent } from './components';
import { SelectCompanyPageComponent, YoyDefaultScopesPageComponent } from './containers';
import { SelectCompanyEffects, YoyDefaultScopesPageEffects } from './effects';
import { reducers } from './reducers';
import { UtilitiesRoutingModule } from './utilities-routing.module';

@NgModule({
  imports: [
    // Angular
    CommonModule,

    // 3rd Party
    StoreModule.forFeature('pf-admin_utilities', reducers),
    EffectsModule.forFeature([
      SelectCompanyEffects,
      YoyDefaultScopesPageEffects
    ]),
    FontAwesomeModule,

    // Routing
    UtilitiesRoutingModule,

    // Payfactors
    PfCommonUIModule,
    PfFormsModule,
    PfCommonModule,
    FormsModule
  ],
  declarations: [
    // Components
    DataListCardComponent, MatchResultsComponent, ScopeSelectorComponent,

    // Pages
    SelectCompanyPageComponent, YoyDefaultScopesPageComponent
  ]
})
export class UtilitiesModule {
  constructor() {
    library.add(...fromFaIcons.faIcons);
  }
}
