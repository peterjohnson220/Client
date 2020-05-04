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

import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';

import * as fromFaIcons from './fa-icons';

import { PfCommonModule } from 'libs/core';
import { PfFormsModule } from 'libs/forms';
import { PfCommonUIModule } from 'libs/ui/common';
import { CompanyApiService } from 'libs/data/payfactors-api/company';

import { reducers } from './reducers';
import { UserRoleEffects } from './effects/user-role.effects';
import { DataAccessService, UserRoleService, UserRoleValidationService } from './services';

import { UserRolePageComponent } from './user-role.page/user-role.page';
import { AddCompanyRoleModalComponent, UserRoleDataAccessTabComponent, UserRoleFunctionTabComponent, UserRoleUsersTabComponent } from './containers';
import { DataFieldFilterComponent } from './components';
import { VisiblePermissionsPipe } from './pipes/visible-permissions.pipe';

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
    StoreModule.forFeature('companyAdminUserRoles', reducers),
    EffectsModule.forFeature([UserRoleEffects]),

    // PF
    PfCommonModule,
    PfCommonUIModule,
    PfFormsModule,
    FontAwesomeModule,

  ],
  declarations: [
    // Feature
    UserRolePageComponent,

    // Containers
    UserRoleDataAccessTabComponent,
    UserRoleFunctionTabComponent,
    UserRoleUsersTabComponent,
    AddCompanyRoleModalComponent,

    // Components
    DataFieldFilterComponent,

    // Pipes
    VisiblePermissionsPipe
  ],
  providers: [
    UserRoleService,
    UserRoleValidationService,
    DataAccessService,
    CompanyApiService,
  ],
  exports: [
    UserRolePageComponent,
  ]
})
export class UserRoleModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(...fromFaIcons.faIcons);
  }
}
