import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';

import { PfFormsModule } from 'libs/forms';
import { PfCommonUIModule } from 'libs/ui/common';
import { PfCommonModule } from 'libs/core';

import { ViewsListEffects } from './effects';
import { reducers } from './reducers';
import { ViewsListPageComponent } from './views-list.page';
import * as fromFaIcons from './fa-icons';

@NgModule({
  imports: [
    // Angular
    CommonModule, FormsModule,

    // 3rd Party
    StoreModule.forFeature('jobDescriptionManagement_settings_viewList', reducers),
    EffectsModule.forFeature([ViewsListEffects]),

    // Payfactors
    PfFormsModule,
    FontAwesomeModule,
    PfCommonUIModule,
    PfCommonModule
  ],
  declarations: [
    // Feature
    ViewsListPageComponent,
  ],
  exports: [
    ViewsListPageComponent,
  ]
})
export class ViewsListModule {
  constructor() {
    library.add(...fromFaIcons.faIcons);
  }
}
