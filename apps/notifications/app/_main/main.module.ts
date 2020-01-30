import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';

import { PfCommonModule } from 'libs/core';
import { PfFormsModule } from 'libs/forms';
import { PfCommonUIModule } from 'libs/ui/common';

import { DataViewsExportCardComponent } from './components';
import { NotificationsPageComponent, DataViewsExportListComponent } from './containers';
import { DataViewsExportEffects } from './effects';
import * as fromFaIcons from './fa-icons';
import { reducers } from './reducers';
import { MainRoutingModule } from './main-routing.module';




@NgModule({
  imports: [
    // Angular
    CommonModule,

    // 3rd Party
    StoreModule.forFeature('notifications_main', reducers),
    EffectsModule.forFeature([
      DataViewsExportEffects
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
    // Containers
    DataViewsExportListComponent,

    // Components
    DataViewsExportCardComponent,

    // Pages
    NotificationsPageComponent,

  ]
})
export class MainModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(...fromFaIcons.faIcons);
  }
}
