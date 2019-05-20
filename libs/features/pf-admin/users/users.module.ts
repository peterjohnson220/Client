import { NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { GridModule } from '@progress/kendo-angular-grid';
import { LayoutModule } from '@progress/kendo-angular-layout';

import { PfCommonUIModule } from 'libs/ui/common';
import { PfFormsModule } from 'libs/forms';
import { reducers } from './reducers';
import { UsersListEffects } from './effects';

import { UsersListComponent } from './components/users-list';
import { UsersListPageComponent } from './containers/pages/users-list';

@NgModule({
  imports: [
    // Angular
    CommonModule, FormsModule, ReactiveFormsModule,

    // 3rd Party
    StoreModule.forFeature('pf_admin_users', reducers),
    EffectsModule.forFeature([
      UsersListEffects,
    ]),
    GridModule,
    LayoutModule,

    // Payfactors
    PfCommonUIModule,
    PfFormsModule,
  ],
  declarations: [
    // Components
    UsersListComponent,
    UsersListPageComponent,

  ],
  exports: [
    UsersListComponent,
    UsersListPageComponent,
  ]
})
export class UsersModule { }
