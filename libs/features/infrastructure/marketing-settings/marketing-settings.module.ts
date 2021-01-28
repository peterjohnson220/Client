import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { reducers } from './marketing-settings/reducers';
import { MarketingSettingsEffects } from './marketing-settings/effects';



@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,

    // 3rd Party
    StoreModule.forFeature('feature_marketing_settings', reducers),
    EffectsModule.forFeature([
      MarketingSettingsEffects
    ])
  ],
  exports: [

  ]
})
export class MarketingSettingsModule { }
