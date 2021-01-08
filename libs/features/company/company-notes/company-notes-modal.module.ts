import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { ImgFallbackModule } from 'ngx-img-fallback';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormatPurePipeModule } from 'ngx-date-fns';

import { reducers } from './reducers';

import { CompanyNotesModalComponent } from './containers';
import { CompanyNotesListComponent } from './containers';

import { CompanyNotesEffects } from './effects';
import { PfCommonUIModule } from '../../../ui/common';
import { PfFormsModule } from '../../../forms';

@NgModule({
  imports: [
    // 3rd Party
    StoreModule.forFeature('feature_CompanyNotesModalFeature', reducers),
    EffectsModule.forFeature([
      CompanyNotesEffects
    ]),
    CommonModule,
    PfCommonUIModule,
    ReactiveFormsModule,
    PfFormsModule,
    FormatPurePipeModule,
    ImgFallbackModule,
    FontAwesomeModule,
    FormsModule
  ],
  declarations: [
    CompanyNotesModalComponent,
    CompanyNotesListComponent
  ],
  exports: [
    CompanyNotesModalComponent
  ],
})
export class PfCompanyNotesModalModule { }

