import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { FooterViewEffects } from './effects';
import { reducers } from './reducers';
import { FooterViewPageComponent } from './footer-view.page/footer-view.page';
import { PfCommonUIModule } from 'libs/ui/common';

@NgModule({
  imports: [
    // Angular
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    // 3rd Party
    StoreModule.forFeature('jobDescriptionManagement_settings_footerView', reducers),
    EffectsModule.forFeature([FooterViewEffects]),

    // Payfactors
    PfCommonUIModule
  ],
  declarations: [
    // Components
    FooterViewPageComponent
  ],
  exports: [
    FooterViewPageComponent,
  ]
})
export class FooterViewModule { }
