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

import { AddCompanyRoleModalComponent,
  NavigationPageComponent,
  UserRoleFunctionTabComponent,
  UserRoleUsersTabComponent,
  UserRolePageComponent,
  UserRoleDataAccessTabComponent } from './containers';
import { NavigationEffects, UserRoleEffects } from './effects';
import { reducers } from './reducers';
import { UserRoleService, UserRoleValidationService} from './services';
import { CompanyAdminRoutingModule } from './company-admin-routing.module';

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
    UserRoleUsersTabComponent,
    AddCompanyRoleModalComponent,

    // Pages
    UserRolePageComponent,
    NavigationPageComponent
  ],
  providers: [
    // Services
    UserRoleService,
    UserRoleValidationService
  ]
})
export class CompanyAdminModule { }
