import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { EffectsModule } from '@ngrx/effects';
import { NumericTextBoxModule } from '@progress/kendo-angular-inputs';
import { StoreModule } from '@ngrx/store';

import { SettingsService } from 'libs/state/app-context/services';

import { RangeFieldEditorComponent } from './containers';
import { RangeFieldEditEffects } from './effects';

@NgModule({
  imports: [
    // Angular
    CommonModule,
    FormsModule,

    // 3rd Party
    StoreModule,
    EffectsModule.forFeature([
      RangeFieldEditEffects
    ]),
    NumericTextBoxModule
  ],
  providers: [
    SettingsService
  ],
  declarations: [
    RangeFieldEditorComponent
  ],
  exports: [
    RangeFieldEditorComponent
  ]
})

export class RangeEditorModule {
  constructor() {}
}

