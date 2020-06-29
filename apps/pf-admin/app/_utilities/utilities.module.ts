import { NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import * as fromFaIcons from './fa-icons';

import { PfCommonUIModule } from 'libs/ui/common';
import { PfFormsModule } from 'libs/forms';
import { PfCommonModule } from 'libs/core';

import { CompanyModule } from '../_companies/company.module';
import {
  ConfirmDeleteJobDescriptionsModalComponent,
  DataListCardComponent,
  MatchResultsComponent,
  ScopeSelectorComponent
} from './components';
import {
  SelectCompanyPageComponent,
  YoyDefaultScopesPageComponent,
  JobDescriptionLoaderPageComponent,
  UtilitiesSelectCompanyPageComponent
} from './containers';
import {
  JobDescriptionLoaderEffects,
  SelectCompanyEffects,
  YoyDefaultScopesCompaniesListEffects,
  YoyDefaultScopesPageEffects
} from './effects';
import { reducers } from './reducers';
import { UtilitiesRoutingModule } from './utilities-routing.module';
import { JobDescriptionLoaderValidationErrorsPipe } from './pipes';
import { LoadJobDescriptionLoaderGuard } from './guards';
import { PfJobDescriptionManagementModule } from 'libs/features/job-description-management/job-description-management.module';

@NgModule({
  imports: [
    // Angular
    CommonModule,

    // 3rd Party
    StoreModule.forFeature('pf-admin_utilities', reducers),
    EffectsModule.forFeature([
      SelectCompanyEffects,
      YoyDefaultScopesPageEffects,
      YoyDefaultScopesCompaniesListEffects,
      JobDescriptionLoaderEffects
    ]),
    FontAwesomeModule,

    // Routing
    UtilitiesRoutingModule,

    // Payfactors
    PfCommonUIModule,
    PfFormsModule,
    PfCommonModule,
    FormsModule,
    PfJobDescriptionManagementModule,
    CompanyModule
  ],
  declarations: [
    // Components
    DataListCardComponent, MatchResultsComponent, ScopeSelectorComponent,

    // Pages
    SelectCompanyPageComponent, YoyDefaultScopesPageComponent, JobDescriptionLoaderPageComponent, UtilitiesSelectCompanyPageComponent,

    // Modals
    ConfirmDeleteJobDescriptionsModalComponent,

    // Pipes
    JobDescriptionLoaderValidationErrorsPipe
  ],
  providers: [
    // Guards
    LoadJobDescriptionLoaderGuard
    ]
})
export class UtilitiesModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(...fromFaIcons.faIcons);
  }
}
