import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';

import { PfFormsModule } from 'libs/forms';
import { PfCommonUIModule } from 'libs/ui/common';
import { PfCommonModule } from 'libs/core';

import { ViewsListEffects, UpsertViewModalEffects } from './effects';
import { reducers } from './reducers';
import { ViewsListPageComponent } from './views-list.page';
import { UpsertViewModalComponent } from './containers';
import * as fromFaIcons from './fa-icons';

@NgModule({
  imports: [
    // Angular
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    // 3rd Party
    StoreModule.forFeature('jobDescriptionManagement_settings_viewsList', reducers),
    EffectsModule.forFeature([ViewsListEffects, UpsertViewModalEffects]),
    DropDownsModule,

    // Payfactors
    PfFormsModule,
    FontAwesomeModule,
    PfCommonUIModule,
    PfCommonModule
  ],
  declarations: [
    // Feature
    ViewsListPageComponent,
    UpsertViewModalComponent
  ],
  exports: [
    ViewsListPageComponent,
    UpsertViewModalComponent
  ]
})
export class ViewsListModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(...fromFaIcons.faIcons);
  }
}
