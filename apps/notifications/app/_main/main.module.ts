import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';

import { PfCommonModule } from 'libs/core';
import { PfFormsModule } from 'libs/forms';
import { PfCommonUIModule } from 'libs/ui/common';

import { NotificationsPageComponent, DataViewsExportListComponent } from './containers';
import { DataViewsExportEffects, TotalRewardsStatementPdfEffects } from './effects';
import * as fromFaIcons from './fa-icons';
import { reducers } from './reducers';
import { MainRoutingModule } from './main-routing.module';
import { PfUserNotificationsModule} from 'libs/features/infrastructure/user-notifications/user-notifications.module';
import { TotalRewardsStatementPdfListComponent } from './containers/total-rewards-statement-pdf-list/total-rewards-statement-pdf-list.component';
import { FileDownloadCardComponent } from './components/file-download-card/file-download-card.component';




@NgModule({
  imports: [
    // Angular
    CommonModule,

    // 3rd Party
    StoreModule.forFeature('notifications_main', reducers),
    EffectsModule.forFeature([
      DataViewsExportEffects,
      TotalRewardsStatementPdfEffects,

    ]),
    FontAwesomeModule,

    // Routing
    MainRoutingModule,

    // Payfactors
    PfCommonModule,
    PfCommonUIModule,
    PfFormsModule,
    PfUserNotificationsModule
  ],
  declarations: [
    // Containers
    DataViewsExportListComponent,
    TotalRewardsStatementPdfListComponent,

    // Components
    FileDownloadCardComponent,

    // Pages
    NotificationsPageComponent,
  ]
})
export class MainModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(...fromFaIcons.faIcons);
  }
}
