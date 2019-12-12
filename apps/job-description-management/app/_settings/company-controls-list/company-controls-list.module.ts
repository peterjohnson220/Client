import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { PfFormsModule } from 'libs/forms';
import { PfCommonUIModule } from 'libs/ui/common';
import { PfCommonModule } from 'libs/core';

import { reducers } from './reducers';
import { CompanyControlsListEffects, CompanyControlsCreateEffects, CompanyControlsDeleteEffects } from './effects';
import { CompanyControlsListPageComponent } from './company-controls-list.page';
import { DeleteCompanyControlModalComponent, CreateCompanyControlModalComponent } from './containers';
import { SharedModule } from '../../shared/shared.module';


@NgModule({
  declarations: [
    // Components
    CompanyControlsListPageComponent,
    DeleteCompanyControlModalComponent,
    CreateCompanyControlModalComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    // 3rd Party
    FontAwesomeModule,
    StoreModule.forFeature('jobDescriptionManagement_settings_companyControlsList', reducers),
    EffectsModule.forFeature([CompanyControlsListEffects, CompanyControlsCreateEffects, CompanyControlsDeleteEffects]),

    // Payfactors
    PfFormsModule,
    PfCommonUIModule,
    PfCommonModule,
    SharedModule
  ]
})
export class CompanyControlsListModule { }
