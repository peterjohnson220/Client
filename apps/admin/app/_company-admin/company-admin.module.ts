import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { GridModule } from '@progress/kendo-angular-grid';
import { LayoutModule } from '@progress/kendo-angular-layout';

import { PfCommonModule } from 'libs/core';
import { PfFormsModule } from 'libs/forms';
import { PfCommonUIModule } from 'libs/ui/common';
import { CompanyApiService } from 'libs/data/payfactors-api/company';
import { UsersModule } from 'libs/features/pf-admin/users';

import { DataFieldFilterComponent } from './components';
import {
    AddCompanyRoleModalComponent, NavigationPageComponent, PasswordManagementPageComponent, PasswordManagementSettingsComponent,
    SavePasswordSettingsModalComponent, UserRoleDataAccessTabComponent, UserRoleFunctionTabComponent, UserRolePageComponent,
    UserRoleUsersTabComponent
} from './containers';
import { NavigationEffects, PasswordSettingEffects, UserRoleEffects } from './effects';
import { reducers } from './reducers';
import { DataAccessService, UserRoleService, UserRoleValidationService } from './services';
import { CompanyAdminRoutingModule } from './company-admin-routing.module';
import { CompanyAdminUsersListPageComponent } from './components/pages/company-admin-users-list';

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
      NavigationEffects,
      UserRoleEffects,
      PasswordSettingEffects
    ]),

    // Routing
    CompanyAdminRoutingModule,

    // PF
    PfCommonModule,
    PfCommonUIModule,
    PfFormsModule,
    UsersModule,
  ],
  declarations: [
    // Components
    UserRoleDataAccessTabComponent,
    UserRoleFunctionTabComponent,
    UserRoleUsersTabComponent,
    AddCompanyRoleModalComponent,
    DataFieldFilterComponent,
    NavigationPageComponent,
    PasswordManagementSettingsComponent,
    SavePasswordSettingsModalComponent,

    // Pages
    UserRolePageComponent,
    PasswordManagementPageComponent,
    CompanyAdminUsersListPageComponent,
  ],
  providers: [
    // Services
    UserRoleService,
    UserRoleValidationService,
    DataAccessService,
    CompanyApiService
  ]
})
export class CompanyAdminModule { }
