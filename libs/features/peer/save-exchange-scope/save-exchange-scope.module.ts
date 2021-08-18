import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { PfFormsModule } from 'libs/forms';
import { PfCommonUIModule } from 'libs/ui/common';

import { SaveExchangeScopeModalComponent } from './containers/save-exchange-scope-modal';
import { reducers } from './reducers';
import { SaveExchangeScopeEffects } from './effects';

@NgModule({
  imports: [
    StoreModule.forFeature('save_exchange_scope', reducers),
    // Angular
    CommonModule,
    ReactiveFormsModule,
    PfFormsModule,
    PfCommonUIModule,
    EffectsModule.forFeature(
      [SaveExchangeScopeEffects]
    )
  ],
  exports: [
    SaveExchangeScopeModalComponent
  ],
  declarations: [
    SaveExchangeScopeModalComponent
  ]
})

export class SaveExchangeScopeModule { }
