import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { GridModule } from '@progress/kendo-angular-grid';
import { LayoutModule } from '@progress/kendo-angular-layout';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import * as fromFaIcons from './fa-icons';
import { UploadModule } from '@progress/kendo-angular-upload';

import { PfCommonUIModule } from 'libs/ui/common';
import { PfFormsModule } from 'libs/forms';

import { UserBulkAddEffects } from './effects/user-bulk-add.effects';
import { reducers } from './reducers';
import { BulkAddUsersPageComponent } from './user-bulk-add.page/bulk-add-users.page';
import {
  BulkAddUsersLoaderImportPanelComponent,
  BulkAddUsersLoaderImportSummaryPanelComponent,
  BulkAddUsersLoaderUploadPanelComponent,
  BulkAddUsersLoaderValidationPanelComponent
} from './containers';
import { BaseBulkAddUsersTogglePanelComponent } from './containers/base-bulk-add-users-toggle-panel';


@NgModule({
  imports: [
    // Angular
    CommonModule, FormsModule, ReactiveFormsModule,

    // 3rd Party
    StoreModule.forFeature('companyAdminUserBulkAddSettings', reducers),
    EffectsModule.forFeature([
      UserBulkAddEffects,
    ]),
    GridModule,
    LayoutModule,
    FontAwesomeModule,
    UploadModule,

    // Payfactors
    PfCommonUIModule,
    PfFormsModule,
  ],
  declarations: [
   // Feature
    BulkAddUsersPageComponent,

   // Containers
    BaseBulkAddUsersTogglePanelComponent,
    BulkAddUsersLoaderImportPanelComponent,
    BulkAddUsersLoaderImportSummaryPanelComponent,
    BulkAddUsersLoaderUploadPanelComponent,
    BulkAddUsersLoaderValidationPanelComponent

  ],
  exports: [
    BulkAddUsersPageComponent
  ]
})

export class UserBulkAddModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(...fromFaIcons.faIcons);
  }
}
