import { NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { GridModule } from '@progress/kendo-angular-grid';
import { LayoutModule } from '@progress/kendo-angular-layout';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { PfCommonUIModule } from 'libs/ui/common';
import { PfFormsModule } from 'libs/forms';

import { UserEffects } from './effects/user-management.effects';
import { reducers } from './reducers';

import { UserFormComponent } from './components/user-form';
import { UserManagementPageComponent } from './user-management.page/user-management.page';


@NgModule({
  imports: [
    // Angular
    CommonModule, FormsModule, ReactiveFormsModule,

    // 3rd Party
    StoreModule.forFeature('companyAdminUserManagement', reducers),
    EffectsModule.forFeature([
      UserEffects,
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
    UserManagementPageComponent,

    // Components
    UserFormComponent
  ],
  exports: [
    UserManagementPageComponent,
  ]
})
export class UserManagementModule {
  constructor() { }
}
