import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ScrollingModule } from '@angular/cdk/scrolling';

import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { GridModule } from '@progress/kendo-angular-grid';
import { LayoutModule } from '@progress/kendo-angular-layout';
import { NotificationModule } from '@progress/kendo-angular-notification';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';

import * as fromFaIcons from './fa-icons';

import { PfCommonModule } from 'libs/core';
import { PfFormsModule } from 'libs/forms';
import { PfCommonUIModule } from 'libs/ui/common';
import { CompanyApiService } from 'libs/data/payfactors-api/company';
import { UsersModule } from 'libs/features/pf-admin/users';

import { CompanyAdminRoutingModule } from './company-admin-routing.module';
import { DataAccessService, UserRoleService, UserRoleValidationService } from './services';
import { NavigationEffects, PasswordSettingEffects, UserRoleEffects, UserEffects } from './effects';
import { reducers } from './reducers';

import { UserPageComponent } from './pages';
import {
  AddCompanyRoleModalComponent, NavigationPageComponent, PasswordManagementPageComponent, PasswordManagementSettingsComponent,
  SavePasswordSettingsModalComponent, UserRoleDataAccessTabComponent, UserRoleFunctionTabComponent, UserRolePageComponent,
  UserRoleUsersTabComponent
} from './containers';
import { DataFieldFilterComponent, UserFormComponent } from './components';

import { CompanyAdminUsersListPageComponent } from './components/pages/company-admin-users-list';

@NgModule({
  imports: [
    // Angular
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ScrollingModule,

    // 3rd Party
    NotificationModule,
    GridModule,
    DropDownsModule,
    LayoutModule,
    StoreModule.forFeature('companyAdminMain', reducers),
    EffectsModule.forFeature([
      NavigationEffects,
      UserRoleEffects,
      PasswordSettingEffects,
      UserEffects
    ]),

    // Routing
    CompanyAdminRoutingModule,

    // PF
    PfCommonModule,
    PfCommonUIModule,
    PfFormsModule,
    FontAwesomeModule,
    UsersModule
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
    UserFormComponent,

    // Pages
    UserRolePageComponent,
    PasswordManagementPageComponent,
    CompanyAdminUsersListPageComponent,
    UserPageComponent
  ],
  providers: [
    // Services
    UserRoleService,
    UserRoleValidationService,
    DataAccessService,
    CompanyApiService,
  ]
})
export class CompanyAdminModule {
  constructor() {
    library.add(...fromFaIcons.faIcons);
  }
}
