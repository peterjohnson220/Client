import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { GridModule } from '@progress/kendo-angular-grid';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { LayoutModule } from '@progress/kendo-angular-layout';
import { StoreModule } from '@ngrx/store';

import { UserRolePageComponent } from './containers/pages';
import { CompanyAdminRoutingModule } from './company-admin-routing.module';
import { UserRoleFunctionTabComponent } from './containers/user-role-functions-tab';
import { UserRoleUsersTabComponent } from './containers/user-role-users-tab';
import { reducers } from './reducers';
import { UserRoleService } from './services';

@NgModule({
  imports: [
    // Angular
    CommonModule,
    FormsModule,

    // 3rd Party
    GridModule,
    DropDownsModule,
    LayoutModule,
    StoreModule.forFeature('userRoleViewAdminMain', reducers),

    // Routing
    CompanyAdminRoutingModule,

  ],
  declarations: [
    // Components
    UserRolePageComponent,
    UserRoleFunctionTabComponent,
    UserRoleUsersTabComponent
  ],
  providers: [
    // Services
    UserRoleService
  ]
})
export class CompanyAdminModule { }
