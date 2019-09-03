import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ScrollingModule } from '@angular/cdk/scrolling';

import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { GridModule } from '@progress/kendo-angular-grid';
import { LayoutModule } from '@progress/kendo-angular-layout';
import { NotificationModule } from '@progress/kendo-angular-notification';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { PfCommonModule } from 'libs/core';
import { PfFormsModule } from 'libs/forms';
import { PfCommonUIModule } from 'libs/ui/common';

import { CompanyAdminRoutingModule } from './company-admin-routing.module';

import {
  UsersListModule,
  UserManagementModule,
  UserRoleModule,
  PasswordManagementModule,
  NavigationModule
} from './';

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

    // Routing
    CompanyAdminRoutingModule,

    // PF
    PfCommonModule,
    PfCommonUIModule,
    PfFormsModule,
    FontAwesomeModule,

    // Features
    UsersListModule,
    UserManagementModule,
    UserRoleModule,
    PasswordManagementModule,
    NavigationModule
  ]
})
export class CompanyAdminModule {
  constructor() { }
}
