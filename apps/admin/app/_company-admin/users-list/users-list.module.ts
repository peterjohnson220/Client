import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { GridModule } from '@progress/kendo-angular-grid';
import { LayoutModule } from '@progress/kendo-angular-layout';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';

import { PfCommonUIModule } from 'libs/ui/common';
import { PfFormsModule } from 'libs/forms';
import { reducers } from './reducers';
import { UsersListEffects } from './effects';

import * as fromFaIcons from './fa-icons';
import { UsersListComponent } from './components/users-list';
import { UsersListPageComponent } from './users-list.page/users-list.page';

@NgModule({
  imports: [
    // Angular
    CommonModule, FormsModule, ReactiveFormsModule,

    // 3rd Party
    StoreModule.forFeature('companyAdminUserList', reducers),
    EffectsModule.forFeature([
      UsersListEffects,
    ]),
    GridModule,
    LayoutModule,
    FontAwesomeModule,

    // Payfactors
    PfCommonUIModule,
    PfFormsModule,
  ],
  declarations: [
    // Feature
    UsersListPageComponent,

    // Components
    UsersListComponent
  ],
  exports: [
    UsersListPageComponent,
  ]
})
export class UsersListModule {
  constructor() {
    library.add(...fromFaIcons.faIcons);
  }
}
