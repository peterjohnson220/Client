import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { EffectsModule } from '@ngrx/effects';
import { GridModule } from '@progress/kendo-angular-grid';
import { LayoutModule } from '@progress/kendo-angular-layout';
import { StoreModule } from '@ngrx/store';

import { PfCommonUIModule } from 'libs/ui/common';
import { PfCommonModule } from 'libs/core';
import { PfFormsModule } from 'libs/forms';

import { AddCompanyRoleModalComponent } from './containers/add-company-role-modal';
import { CompanyAdminRoutingModule } from './company-admin-routing.module';
import { reducers } from './reducers';
import { UserRoleFunctionTabComponent } from './containers/user-role-functions-tab';
import { UserRoleUsersTabComponent } from './containers/user-role-users-tab';
import { UserRolePageComponent } from './containers/pages';
import { UserRoleService, UserRoleValidationService} from './services';
import { UserRoleEffects } from './effects/user-role.effects';
import { UserRoleDataAccessTabComponent } from './containers/user-role-data-access-tab';

@NgModule({
  imports: [
    // Angular
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    // 3rd Party
    GridModule,
    DropDownsModule,
    LayoutModule,
    StoreModule.forFeature('userRoleAdminMain', reducers),
    EffectsModule.forFeature([
      UserRoleEffects
    ]),

    // Routing
    CompanyAdminRoutingModule,

    // PF
    PfCommonModule,
    PfCommonUIModule,
    PfFormsModule
  ],
  declarations: [
    // Components
    UserRoleDataAccessTabComponent,
    UserRoleFunctionTabComponent,
    UserRolePageComponent,
    UserRoleUsersTabComponent,
    AddCompanyRoleModalComponent
  ],
  providers: [
    // Services
    UserRoleService,
    UserRoleValidationService
  ]
})
export class CompanyAdminModule { }
