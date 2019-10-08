import { NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { GridModule } from '@progress/kendo-angular-grid';
import { LayoutModule } from '@progress/kendo-angular-layout';
import { UploadModule } from '@progress/kendo-angular-upload';
import { NgbTabsetModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';

import { PfCommonUIModule } from 'libs/ui/common';
import { PfFormsModule } from 'libs/forms';
import { PfCommonModule } from 'libs/core';
import { UserManagementModule } from 'libs/features/user-management';

import * as fromFaIcons from './fa-icons';
import { CompanySearchPipe } from './pipes';
import { CompaniesListPageComponent, CompaniesListComponent, CompanyPageComponent, CompanyFormComponent,
  CompanyTabsComponent } from './containers';
import { SecondarySurveyFieldsModalComponent, CompanyTagsModalComponent } from './components';
import { CompaniesEffects, CompanyPageEffects } from './effects';
import { reducers } from './reducers';
import { CompanyRoutingModule } from './company-routing.module';

@NgModule({
  imports: [
    // Angular
    CommonModule, FormsModule, ReactiveFormsModule,

    // 3rd Party
    StoreModule.forFeature('pf-admin_companies', reducers),
    EffectsModule.forFeature([
      CompaniesEffects,
      CompanyPageEffects
    ]),
    GridModule,
    LayoutModule,
    UploadModule,
    NgbTabsetModule,
    NgbModalModule,
    FontAwesomeModule,

    // Routing
    CompanyRoutingModule,

    // Payfactors
    PfCommonUIModule,
    PfFormsModule,
    PfCommonModule,

    // Features
    UserManagementModule
  ],
  exports: [
    CompaniesListComponent
  ],
  declarations: [
    // Components
    CompaniesListComponent,
    CompanyFormComponent,
    CompanyTabsComponent,
    SecondarySurveyFieldsModalComponent,
    CompanyTagsModalComponent,

    // Pages
    CompaniesListPageComponent,
    CompanyPageComponent,

    // Pipes
    CompanySearchPipe,
  ]
})
export class CompanyModule {
  constructor() {
    library.add(...fromFaIcons.faIcons);
  }
}
