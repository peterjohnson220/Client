import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { reducers } from './reducers';

import { CompanyNotesModalComponent } from './containers';
import { CompanyNotesListComponent } from './components';

import { CompanyNotesEffects } from './effects';
import { PfCommonUIModule } from '../../../ui/common';
import { PfFormsModule } from '../../../forms';
import { MomentModule } from 'ngx-moment';
import { ImgFallbackModule } from 'ngx-img-fallback';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

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
    MomentModule,
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

